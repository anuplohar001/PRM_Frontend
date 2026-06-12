import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Workflow from "../components/landing/Workflow";
import Testimonials from "../components/landing/Testimonials";
import Pricing from "../components/landing/Pricing";
import Footer from "../components/landing/Footer";

interface LandingPageProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function LandingPage({ theme, onToggleTheme }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <Hero />
      <Features />
      <Workflow />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  );
}
