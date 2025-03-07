
import { Button } from "@/components/ui/button";
import { ChevronRight, LineChart, Cpu, Leaf } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-10 md:right-40 w-64 h-64 bg-karbon-200/20 dark:bg-karbon-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-ocean-200/20 dark:bg-ocean-900/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 sm:py-24 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-karbon-100 dark:bg-karbon-800/40 text-karbon-800 dark:text-karbon-200 text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-karbon-500 mr-2"></span>
            Open Source Decentralized Carbon Management
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="gradient-text">Transparent Carbon Tracking</span>
            <br /> 
            For a Sustainable Future
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            KarbonLedger leverages IoT, AI/ML, and blockchain to create a transparent, 
            scalable platform for monitoring carbon emissions and trading verified carbon credits.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-karbon-600 hover:bg-karbon-700 text-white">
              Get Started <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-karbon-200 dark:border-karbon-700">
              View Documentation
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-karbon-100 dark:border-karbon-800">
              <div className="h-12 w-12 rounded-full bg-karbon-100 dark:bg-karbon-800 flex items-center justify-center mb-3">
                <LineChart className="h-6 w-6 text-karbon-600" />
              </div>
              <h3 className="font-medium text-lg mb-1">Emissions Tracking</h3>
              <p className="text-foreground/70 text-center text-sm">Real-time monitoring of carbon footprint</p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-karbon-100 dark:border-karbon-800">
              <div className="h-12 w-12 rounded-full bg-ocean-100 dark:bg-ocean-800 flex items-center justify-center mb-3">
                <Leaf className="h-6 w-6 text-ocean-600" />
              </div>
              <h3 className="font-medium text-lg mb-1">Carbon Credits</h3>
              <p className="text-foreground/70 text-center text-sm">Tokenized, verified carbon offsets marketplace</p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-karbon-100 dark:border-karbon-800">
              <div className="h-12 w-12 rounded-full bg-karbon-100 dark:bg-karbon-800 flex items-center justify-center mb-3">
                <Cpu className="h-6 w-6 text-karbon-600" />
              </div>
              <h3 className="font-medium text-lg mb-1">IoT Integration</h3>
              <p className="text-foreground/70 text-center text-sm">Connect sensors for accurate data capture</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
