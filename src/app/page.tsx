"use client";

import { Footer } from "@/components/land/Footer";
import Landing from "@/components/land/Land";
import {
  CapabilitiesSection,
  HowItWorksSection,
  WhyWeNeedItSection,
  TestimonialsSection,
  CtaSection,
} from "@/components/land/LandingPageSections";
import Login from "@/components/login/Login";

export default function Home() {
  return (
    <>
      <Landing />
      <CapabilitiesSection />
      <HowItWorksSection />
      <WhyWeNeedItSection />
      {/* <TestimonialsSection /> */}
      <CtaSection />
      <Footer />
    </>
  );
}
