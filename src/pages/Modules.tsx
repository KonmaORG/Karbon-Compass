
import Navbar from "@/components/Navbar";
import ModulesFeatures from "@/components/ModulesFeatures";
import Footer from "@/components/Footer";

const Modules = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="py-20 bg-gradient-to-b from-background to-karbon-50/30 dark:to-karbon-950/30">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Platform Modules & Features</h1>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto mb-12">
              Explore our comprehensive suite of modules designed to address every aspect of carbon management
              across the value chain.
            </p>
          </div>
        </div>
        <ModulesFeatures />
      </main>
      <Footer />
    </div>
  );
};

export default Modules;
