import { Hero } from "@/components/hero/Hero";
import { WhyCards } from "@/components/landing/WhyCards";
import { GoalsList } from "@/components/landing/GoalsList";
import { ServiceCards } from "@/components/landing/ServiceCards";
import { HowToReport } from "@/components/landing/HowToReport";
import { FinalCta } from "@/components/landing/FinalCta";
import { LandingMotion } from "@/components/landing/LandingMotion";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhyCards />
      <GoalsList />
      <ServiceCards />
      <HowToReport />
      <FinalCta />
      <LandingMotion />
    </main>
  );
}
