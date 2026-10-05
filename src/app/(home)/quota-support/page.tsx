import QuotaSupport from "@/components/quota/QuotaSupport";
import React, { Suspense } from "react";

function page() {
  // QuotaSupport reads ?registration= with useSearchParams, which needs a Suspense boundary
  return (
    <Suspense fallback={null}>
      <QuotaSupport />
    </Suspense>
  );
}

export default page;
