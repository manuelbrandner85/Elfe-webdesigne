import Hero from "@/components/Hero";
import SpotlightCursor from "@/components/SpotlightCursor";
import GoldCursor from "@/components/GoldCursor";
import CinemaBanner from "@/components/CinemaBanner";
import Nav from "@/components/Nav";
import ScrollProgress from "@/components/ScrollProgress";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Audience from "@/components/Audience";
import Portfolio from "@/components/Portfolio";
import BeforeAfter from "@/components/BeforeAfter";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <>
      <SpotlightCursor />
      <GoldCursor />
      <ScrollProgress />
      <Nav />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Hero />
        <Stats />
        <Services />
        <Process />
        <Audience />
        <Portfolio />
        <CinemaBanner />
        <BeforeAfter />
        <Pricing />
        <Testimonials />
        <FAQ />
        <About />
        <Contact />
      </main>
      <Footer />
      <StickyCta />
      <BackToTop />
    </>
  );
}
