import { NextResponse } from "next/server";

type DistrictLocation = {
  lat: number;
  lon: number;
  name: string;
};

/**
 * Normalize district names so database values are not case-sensitive
 * and small formatting differences do not break the lookup.
 *
 * Examples:
 * Colombo       -> colombo
 * COLOMBO       -> colombo
 * " Colombo "   -> colombo
 * Nuwara Eliya  -> nuwaraeliya
 * Nuwara-Eliya  -> nuwaraeliya
 */
function normalizeDistrict(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * District coordinates.
 *
 * The keys are already normalized because normalizeDistrict()
 * is used before looking them up.
 */
const DISTRICT_COORDINATES: Record<string, DistrictLocation> = {
  colombo: {
    lat: 6.9271,
    lon: 79.8612,
    name: "Colombo",
  },

  gampaha: {
    lat: 7.084,
    lon: 80.0098,
    name: "Gampaha",
  },

  kalutara: {
    lat: 6.5854,
    lon: 80.0538,
    name: "Kalutara",
  },

  kandy: {
    lat: 7.2906,
    lon: 80.6337,
    name: "Kandy",
  },

  matale: {
    lat: 7.4675,
    lon: 80.6234,
    name: "Matale",
  },

  nuwaraeliya: {
    lat: 6.9497,
    lon: 80.7891,
    name: "Nuwara Eliya",
  },

  kegalle: {
    lat: 7.2513,
    lon: 80.3464,
    name: "Kegalle",
  },

  ratnapura: {
    lat: 6.7056,
    lon: 80.3847,
    name: "Ratnapura",
  },

  galle: {
    lat: 6.0329,
    lon: 80.2168,
    name: "Galle",
  },

  matara: {
    lat: 5.9549,
    lon: 80.555,
    name: "Matara",
  },

  hambantota: {
    lat: 6.1429,
    lon: 81.1212,
    name: "Hambantota",
  },

  jaffna: {
    lat: 9.6615,
    lon: 80.0255,
    name: "Jaffna",
  },

  kilinochchi: {
    lat: 9.3803,
    lon: 80.377,
    name: "Kilinochchi",
  },

  mannar: {
    lat: 8.981,
    lon: 79.9044,
    name: "Mannar",
  },

  mullaitivu: {
    lat: 9.2671,
    lon: 80.8142,
    name: "Mullaitivu",
  },

  vavuniya: {
    lat: 8.7514,
    lon: 80.4971,
    name: "Vavuniya",
  },

  batticaloa: {
    lat: 7.731,
    lon: 81.6747,
    name: "Batticaloa",
  },

  ampara: {
    lat: 7.2917,
    lon: 81.6729,
    name: "Ampara",
  },

  trincomalee: {
    lat: 8.5874,
    lon: 81.2152,
    name: "Trincomalee",
  },

  kurunegala: {
    lat: 7.4863,
    lon: 80.3623,
    name: "Kurunegala",
  },

  puttalam: {
    lat: 8.0362,
    lon: 79.8283,
    name: "Puttalam",
  },

  anuradhapura: {
    lat: 8.3114,
    lon: 80.4037,
    name: "Anuradhapura",
  },

  polonnaruwa: {
    lat: 7.9403,
    lon: 81.0188,
    name: "Polonnaruwa",
  },

  badulla: {
    lat: 6.9934,
    lon: 81.055,
    name: "Badulla",
  },

  monaragala: {
    lat: 6.8714,
    lon: 81.3487,
    name: "Monaragala",
  },
};

const DEFAULT_DISTRICT = DISTRICT_COORDINATES.colombo;

function getDistrictLocation(district: string | null | undefined): {
  location: DistrictLocation;
  isFallback: boolean;
} {
  const normalized = normalizeDistrict(district);

  if (!normalized) {
    return {
      location: DEFAULT_DISTRICT,
      isFallback: true,
    };
  }

  const location = DISTRICT_COORDINATES[normalized];

  if (!location) {
    return {
      location: DEFAULT_DISTRICT,
      isFallback: true,
    };
  }

  return {
    location,
    isFallback: false,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const district = searchParams.get("district");

    const { location, isFallback } = getDistrictLocation(district);

    const params = new URLSearchParams({
      latitude: String(location.lat),
      longitude: String(location.lon),

      current:
        "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",

      timezone: "Asia/Colombo",
    });

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      {
        next: {
          revalidate: 1800,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Open-Meteo request failed: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      district: location.name,
      isFallback,

      current: {
        temperature_2m: data.current?.temperature_2m ?? null,
        relative_humidity_2m: data.current?.relative_humidity_2m ?? null,
        precipitation: data.current?.precipitation ?? null,
        weather_code: data.current?.weather_code ?? null,
        wind_speed_10m: data.current?.wind_speed_10m ?? null,
      },
    });
  } catch (error) {
    console.error("Weather API error:", error);

    return NextResponse.json(
      {
        error: "Unable to load weather",
      },
      {
        status: 500,
      },
    );
  }
}
