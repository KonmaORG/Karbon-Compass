
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, Activity, BarChart, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";

const IoTDemo = () => {
  // Simulate real-time data updates
  const [sensors, setSensors] = useState([
    { id: 1, name: "Energy Sensor A1", status: "online", reading: 12.4, unit: "kWh", lastUpdate: "Just now" },
    { id: 2, name: "Energy Sensor B2", status: "online", reading: 8.7, unit: "kWh", lastUpdate: "1 min ago" },
    { id: 3, name: "Temperature C3", status: "online", reading: 23.5, unit: "°C", lastUpdate: "5 mins ago" },
    { id: 4, name: "Carbon Sensor D4", status: "offline", reading: 42.1, unit: "ppm", lastUpdate: "1 hour ago" },
    { id: 5, name: "Air Quality E5", status: "online", reading: 87, unit: "AQI", lastUpdate: "2 mins ago" },
    { id: 6, name: "Water Flow F6", status: "online", reading: 3.2, unit: "L/min", lastUpdate: "3 mins ago" }
  ]);

  // Simulate data updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prevSensors => {
        return prevSensors.map(sensor => {
          if (sensor.status === "offline") return sensor;
          
          // Random slight change in reading
          const change = (Math.random() - 0.5) * (sensor.reading * 0.05);
          const newReading = parseFloat((sensor.reading + change).toFixed(1));
          
          return {
            ...sensor,
            reading: newReading,
            lastUpdate: "Just now"
          };
        });
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Simulate a refresh action
  const handleRefresh = () => {
    // Toggle the D4 sensor between online and offline for demo purposes
    setSensors(prevSensors => {
      return prevSensors.map(sensor => {
        if (sensor.id === 4) {
          return {
            ...sensor,
            status: sensor.status === "online" ? "offline" : "online",
            lastUpdate: "Just now"
          };
        }
        return sensor;
      });
    });
  };

  return (
    <div id="iot" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">IoT Integration</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Connect IoT sensors to KarbonLedger for real-time emissions data capture and automatic verification.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-lg border border-karbon-100 dark:border-karbon-800 p-4 md:p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  <Cpu className="h-5 w-5 mr-2 text-karbon-600" />
                  IoT Sensor Network
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Real-time monitoring of energy usage and emissions</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 md:mt-0 flex items-center gap-1"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
            
            <Tabs defaultValue="grid">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-karbon-50 dark:bg-karbon-900">
                    <span className="flex items-center">
                      <CheckCircle className="h-3 w-3 text-karbon-600 mr-1" />
                      <span>{sensors.filter(s => s.status === "online").length} Online</span>
                    </span>
                  </Badge>
                  <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20">
                    <span className="flex items-center">
                      <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                      <span>{sensors.filter(s => s.status === "offline").length} Offline</span>
                    </span>
                  </Badge>
                </div>
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="grid" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sensors.map((sensor) => (
                    <Card key={sensor.id} className={`transition-all duration-300 ${sensor.status === "offline" ? "opacity-70" : ""}`}>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{sensor.name}</CardTitle>
                          <Badge variant={sensor.status === "online" ? "outline" : "destructive"} className={sensor.status === "online" ? "bg-karbon-50 dark:bg-karbon-900 text-karbon-600 dark:text-karbon-400" : ""}>
                            {sensor.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="mt-2 flex items-end gap-1">
                          <span className="text-2xl font-bold">{sensor.reading}</span>
                          <span className="text-sm text-muted-foreground">{sensor.unit}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <Activity className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">Updated {sensor.lastUpdate}</span>
                          </div>
                          {sensor.status === "online" && (
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="mt-0">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 py-2 px-4 bg-muted/50 text-sm font-medium">
                    <div className="col-span-4">Sensor</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-3 text-right">Reading</div>
                    <div className="col-span-3 text-right">Last Update</div>
                  </div>
                  {sensors.map((sensor) => (
                    <div key={sensor.id} className="grid grid-cols-12 py-3 px-4 border-t text-sm">
                      <div className="col-span-4">{sensor.name}</div>
                      <div className="col-span-2 text-center">
                        <Badge variant={sensor.status === "online" ? "outline" : "destructive"} className={sensor.status === "online" ? "bg-karbon-50 dark:bg-karbon-900 text-karbon-600 dark:text-karbon-400" : ""}>
                          {sensor.status}
                        </Badge>
                      </div>
                      <div className="col-span-3 text-right font-medium">{sensor.reading} {sensor.unit}</div>
                      <div className="col-span-3 text-right text-muted-foreground">{sensor.lastUpdate}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-lg border border-karbon-100 dark:border-karbon-800 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-karbon-600" /> 
                Data Verification
              </h3>
              <p className="text-foreground/80 mb-4">
                IoT sensors provide trusted data sources that are automatically verified and recorded on the blockchain.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-karbon-600 mr-2 mt-0.5" />
                  <span>Tamper-proof hardware ensures data integrity</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-karbon-600 mr-2 mt-0.5" />
                  <span>Cryptographic signatures for each data point</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-karbon-600 mr-2 mt-0.5" />
                  <span>Anomaly detection identifies suspicious readings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-karbon-600 mr-2 mt-0.5" />
                  <span>Multi-sensor validation for critical measurements</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-lg border border-karbon-100 dark:border-karbon-800 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-ocean-600" /> 
                Easy Integration
              </h3>
              <p className="text-foreground/80 mb-4">
                KarbonLedger supports a wide range of IoT devices with simple plug-and-play integration options.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-ocean-600 mr-2 mt-0.5" />
                  <span>SDK for major IoT platforms and manufacturers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-ocean-600 mr-2 mt-0.5" />
                  <span>API for custom sensor integration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-ocean-600 mr-2 mt-0.5" />
                  <span>Low-cost retrofit options for existing sensors</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-ocean-600 mr-2 mt-0.5" />
                  <span>Automatic calibration and maintenance alerts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IoTDemo;
