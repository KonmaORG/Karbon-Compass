
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ModulesFeatures from "@/components/ModulesFeatures";
import Dashboard from "@/components/Dashboard";
import Marketplace from "@/components/Marketplace";
import IoTDemo from "@/components/IoTDemo";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <ModulesFeatures />
        <Dashboard />
        <Marketplace />
        <IoTDemo />
        
        {/* Added Applications section */}
        <div className="py-16 bg-gradient-to-b from-background to-karbon-50/30 dark:to-karbon-950/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tailored Interfaces for Every Stakeholder</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              KarbonLedger provides specialized interfaces for project developers, credit buyers, validators, 
              regulators, investors, and community members.
            </p>
            <Link to="/applications">
              <Button variant="default" className="bg-ocean-600 hover:bg-ocean-700 text-white">
                Explore Interfaces
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
