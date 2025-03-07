
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Zap, Activity, Broadcast } from "lucide-react";
import { Button } from "@/components/ui/button";

const IoTMonitoringApp = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">IoT Emissions Monitoring</h2>
        <Button className="bg-ocean-600 hover:bg-ocean-700">
          <Broadcast className="mr-2 h-4 w-4" /> Connect Devices
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Sensors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">62</div>
              <Broadcast className="ml-auto h-5 w-5 text-ocean-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">24.3°C</div>
              <Thermometer className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Energy Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">432</div>
              <div className="ml-1 text-lg">kWh</div>
              <Zap className="ml-auto h-5 w-5 text-ocean-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Real-time Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">2.4</div>
              <div className="ml-1 text-lg">kg CO₂e/h</div>
              <Activity className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Connected Sensors</CardTitle>
          <CardDescription>Real-time data from your IoT devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Factory A", "Building B", "Solar Array", "Transport Fleet"].map((location, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="rounded-full bg-green-100 p-2 mr-3">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                    <span className="font-medium">{location}</span>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Emissions</span>
                    </div>
                    <span className="font-medium">{(Math.random() * 5).toFixed(2)} kg/h</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="flex items-center">
                      <Thermometer className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Temperature</span>
                    </div>
                    <span className="font-medium">{(20 + Math.random() * 10).toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Energy</span>
                    </div>
                    <span className="font-medium">{Math.floor(Math.random() * 200)} kWh</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IoTMonitoringApp;
