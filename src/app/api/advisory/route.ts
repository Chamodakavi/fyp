// app/api/advisory/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Use your Hugging Face Direct URL here
    // app/api/advisory/route.ts
    const HF_SPACE_URL = "https://chamodakavi-sri-lanka-crop-api.hf.space/get_market_advisory";

    const pythonResponse = await fetch(HF_SPACE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        crop: body.crop, // Next.js sends 'CARROT'
        year: body.year,
        month: body.month
    }),
    });

    if (!pythonResponse.ok) {
      console.error("HF Error:", await pythonResponse.text());
      return NextResponse.json({ error: "Hugging Face backend error" }, { status: 500 });
    }

    const data = await pythonResponse.json();
    
    // Calculation logic remains the same
    const suggestedHectares = (data.Required_Harvest_MT / 22).toFixed(2);

    return NextResponse.json({
      ...data,
      Suggested_Hectares: suggestedHectares
    });

  } catch (error) {
    console.error("Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}