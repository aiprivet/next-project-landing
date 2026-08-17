import { Compare } from "./components/Compare/Compare";
import { Contact } from "./components/Contact/Contact";
import { CookieBanner } from "./components/CookieBanner/CookieBanner";
import { Cta } from "./components/Cta/Cta";
import { Faq } from "./components/Faq/Faq";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { Hero } from "./components/Hero/Hero";
import { Logos } from "./components/Logos/Logos";
import { Metrics } from "./components/Metrics/Metrics";
import { Plans } from "./components/Plans/Plans";
import { Process } from "./components/Process/Process";
import { Roadmap } from "./components/Roadmap/Roadmap";
import { Scenarios } from "./components/Scenarios/Scenarios";
import { Security } from "./components/Security/Security";
import { Testimonials } from "./components/Testimonials/Testimonials";
import { UseCases } from "./components/UseCases/UseCases";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Logos />
        <Process />
        <UseCases />
        <Scenarios />
        <Compare />
        <Metrics />
        <Security />
        <Testimonials />
        <Roadmap />
        <Plans />
        <Faq />
        <Contact />
        <Cta />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
