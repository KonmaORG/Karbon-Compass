
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, FileCheck, PlusCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RegistryApp = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Carbon Offset Project Registry</h2>
        <Button className="bg-karbon-600 hover:bg-karbon-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Register New Project
        </Button>
      </div>
      
      <div className="flex items-center space-x-4 mb-6">
        <Input placeholder="Search projects..." className="max-w-xs" />
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">142</div>
              <ClipboardCheck className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Credits Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">23,456</div>
              <div className="ml-1 text-lg">tCO₂e</div>
              <FileCheck className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projects Pending Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">37</div>
              <ClipboardCheck className="ml-auto h-5 w-5 text-ocean-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Latest carbon offset projects registered on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                <div className="rounded-full bg-karbon-100 dark:bg-karbon-800 p-2 mr-4">
                  <ClipboardCheck className="h-5 w-5 text-karbon-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Reforestation Project #{i}</div>
                  <div className="text-sm text-muted-foreground">Location: {i % 2 === 0 ? 'Brazil' : 'Indonesia'} • Credits: {i * 125} tCO₂e</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistryApp;
