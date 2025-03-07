
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, TrendingUp, ArrowUpRight, CreditCard, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MarketplaceApp = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Carbon Credit Marketplace</h2>
        <Button className="bg-ocean-600 hover:bg-ocean-700">
          <CreditCard className="mr-2 h-4 w-4" /> My Portfolio
        </Button>
      </div>
      
      <div className="flex items-center space-x-4 mb-6">
        <Input placeholder="Search marketplace..." className="max-w-xs" />
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">18,245</div>
              <div className="ml-1 text-lg">tCO₂e</div>
              <ShoppingBag className="ml-auto h-5 w-5 text-ocean-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">$12.35</div>
              <div className="ml-1 text-sm">per tCO₂e</div>
              <TrendingUp className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Trading Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">$1.2M</div>
              <ArrowUpRight className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Featured Carbon Credits</CardTitle>
          <CardDescription>Popular credits available for purchase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{i % 2 === 0 ? 'Reforestation' : 'Solar Energy'} Project #{i}</CardTitle>
                      <CardDescription className="text-xs">
                        {i % 2 === 0 ? 'Brazil' : 'India'} • Verified by {i % 3 === 0 ? 'Gold Standard' : 'Verra'}
                      </CardDescription>
                    </div>
                    <div className="rounded-full bg-ocean-100 dark:bg-ocean-800 p-1">
                      <ShoppingBag className="h-4 w-4 text-ocean-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-end mt-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Price</div>
                      <div className="text-lg font-bold">${(10 + i * 0.5).toFixed(2)}</div>
                    </div>
                    <Button size="sm" className="bg-ocean-600 hover:bg-ocean-700">
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketplaceApp;
