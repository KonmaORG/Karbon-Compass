
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ModulesFeatures from "@/components/ModulesFeatures";
import Dashboard from "@/components/Dashboard";
import Marketplace from "@/components/Marketplace";
import IoTDemo from "@/components/IoTDemo";
import Footer from "@/components/Footer";

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
      </main>
      <Footer />
    </div>
  );
};

export default Index;
