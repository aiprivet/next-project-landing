import { Compare } from "./components/Compare/Compare";
import { CookieBanner } from "./components/CookieBanner/CookieBanner";
import { Cta } from "./components/Cta/Cta";
import { Faq } from "./components/Faq/Faq";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { Hero } from "./components/Hero/Hero";
import { Logos } from "./components/Logos/Logos";
import { Process } from "./components/Process/Process";
import { Roadmap } from "./components/Roadmap/Roadmap";
import { Security } from "./components/Security/Security";
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
        <Compare />
        <Security />
        <Roadmap />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
