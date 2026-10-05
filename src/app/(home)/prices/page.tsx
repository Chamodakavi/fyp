import CropPrices from "@/components/prices/CropPrices";
import React, { Suspense } from "react";

function page() {
  // CropPrices reads ?crop= with useSearchParams, which needs a Suspense boundary
  return (
    <Suspense fallback={null}>
      <CropPrices variant="farmer" />
    </Suspense>
  );
}

export default page;
