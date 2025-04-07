
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Leaf, TreeDeciduous, Wind, Droplets, ListPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Marketplace = () => {
  const carbonCredits = [
    {
      id: 1,
      title: "Reforestation Project",
      location: "Amazon Rainforest, Brazil",
      price: 18.50,
      available: 2500,
      verified: true,
      type: "Biological",
      icon: <TreeDeciduous className="h-5 w-5" />,
      color: "bg-karbon-100 dark:bg-karbon-800 text-karbon-600"
    },
    {
      id: 2,
      title: "Wind Farm Initiative",
      location: "Coastal Gujarat, India",
      price: 15.75,
      available: 4200,
      verified: true,
      type: "Renewable Energy",
      icon: <Wind className="h-5 w-5" />,
      color: "bg-ocean-100 dark:bg-ocean-800 text-ocean-600"
    },
    {
      id: 3,
      title: "Solar Array Expansion",
      location: "Atacama Desert, Chile",
      price: 16.25,
      available: 3800,
      verified: true,
      type: "Renewable Energy",
      icon: <Sparkles className="h-5 w-5" />,
      color: "bg-amber-100 dark:bg-amber-800 text-amber-600"
    },
    {
      id: 4,
      title: "Wetland Restoration",
      location: "Mississippi Delta, USA",
      price: 22.30,
      available: 1200,
      verified: true,
      type: "Biological",
      icon: <Droplets className="h-5 w-5" />,
      color: "bg-ocean-100 dark:bg-ocean-800 text-ocean-600"
    }
  ];

  return (
    <div id="marketplace" className="py-20 bg-gradient-to-b from-background via-ocean-50/30 dark:via-ocean-950/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Carbon Credit Marketplace</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Trade verified carbon credits on our transparent, decentralized marketplace with
            real-time pricing and automatic settlement.
          </p>
        </div>
        
        <Tabs defaultValue="buy" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="buy">Buy Carbon Credits</TabsTrigger>
            <TabsTrigger value="sell">Sell Carbon Credits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {carbonCredits.map((credit) => (
                <Card key={credit.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className={`rounded-full p-2 ${credit.color}`}>
                        {credit.icon}
                      </div>
                      {credit.verified && (
                        <Badge variant="outline" className="flex items-center gap-1 bg-karbon-50 dark:bg-karbon-900 text-karbon-600 dark:text-karbon-400">
                          <Leaf className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <CardTitle className="text-lg mb-2">{credit.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-3">{credit.location}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-semibold">${credit.price} <span className="text-xs font-normal">per tCO₂e</span></p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Available</p>
                        <p className="font-semibold">{credit.available.toLocaleString()} <span className="text-xs font-normal">tCO₂e</span></p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-semibold">{credit.type}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="default" className="w-full bg-karbon-600 hover:bg-karbon-700 text-white">
                      Purchase Credits
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-10 flex justify-center">
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Load More Projects
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="sell">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold mb-4">List Your Carbon Credits</h3>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-6">
                Create listings for your verified carbon projects and connect with buyers around the world.
              </p>
              <Button className="bg-karbon-600 hover:bg-karbon-700 text-white flex items-center gap-2">
                <ListPlus className="h-5 w-5" />
                List Your Project
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="text-center p-6 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-lg border border-karbon-100 dark:border-karbon-800">
                <div className="w-12 h-12 rounded-full bg-karbon-100 dark:bg-karbon-800 flex items-center justify-center mx-auto mb-3">
                  <div className="text-karbon-600">1</div>
                </div>
                <h4 className="font-medium mb-2">Register Your Project</h4>
                <p className="text-sm text-foreground/70">Register your carbon project and complete the verification process.</p>
              </div>
              
              <div className="text-center p-6 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-lg border border-karbon-100 dark:border-karbon-800">
                <div className="w-12 h-12 rounded-full bg-karbon-100 dark:bg-karbon-800 flex items-center justify-center mx-auto mb-3">
                  <div className="text-karbon-600">2</div>
                </div>
                <h4 className="font-medium mb-2">Create a Listing</h4>
                <p className="text-sm text-foreground/70">Set your price, available quantity, and add details about your carbon credits.</p>
              </div>
              
              <div className="text-center p-6 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-lg border border-karbon-100 dark:border-karbon-800">
                <div className="w-12 h-12 rounded-full bg-karbon-100 dark:bg-karbon-800 flex items-center justify-center mx-auto mb-3">
                  <div className="text-karbon-600">3</div>
                </div>
                <h4 className="font-medium mb-2">Get Paid Automatically</h4>
                <p className="text-sm text-foreground/70">Receive payments directly when buyers purchase your carbon credits.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-16 max-w-3xl mx-auto bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-lg border border-karbon-100 dark:border-karbon-800 p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">How Our Marketplace Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-karbon-100 dark:bg-karbon-800 flex items-center justify-center mx-auto mb-3">
                <span className="text-karbon-600 font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">Verified Projects</h4>
              <p className="text-sm text-foreground/70">All carbon projects undergo rigorous verification through IoT data and trusted validators.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-karbon-100 dark:bg-karbon-800 flex items-center justify-center mx-auto mb-3">
                <span className="text-karbon-600 font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2">Tokenized Credits</h4>
              <p className="text-sm text-foreground/70">Carbon credits are tokenized on blockchain for transparent ownership and trading.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-karbon-100 dark:bg-karbon-800 flex items-center justify-center mx-auto mb-3">
                <span className="text-karbon-600 font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2">Smart Contracts</h4>
              <p className="text-sm text-foreground/70">Automated settlement ensures immediate transfer of credits upon purchase.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
