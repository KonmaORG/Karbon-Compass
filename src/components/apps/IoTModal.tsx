
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Thermometer, Wifi, Zap } from "lucide-react";

type IoTModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "connect" | "details";
  deviceData?: {
    name: string;
    location: string;
    type: string;
  };
};

const IoTModal = ({ open, onOpenChange, action, deviceData }: IoTModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  
  const handleAction = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      toast.success(`${action === "connect" ? "Devices connected successfully!" : "Device details updated!"}`);
    }, 1500);
  };
  
  const toggleDevice = (id: string) => {
    if (selectedDevices.includes(id)) {
      setSelectedDevices(selectedDevices.filter(deviceId => deviceId !== id));
    } else {
      setSelectedDevices([...selectedDevices, id]);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {action === "connect" ? (
              <div className="flex items-center">
                <Wifi className="mr-2 h-5 w-5" />
                Connect IoT Devices
              </div>
            ) : (
              <div className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Device Details
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            {action === "connect" 
              ? "Connect new IoT devices to your emissions monitoring network"
              : `Detailed information for ${deviceData?.name}`
            }
          </DialogDescription>
        </DialogHeader>
        
        {action === "connect" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Available Devices</h3>
              {["Smart Energy Meter", "Carbon Sensor", "Temperature Monitor", "Energy Distribution Node"].map((device, i) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between p-3 border rounded-md cursor-pointer ${
                    selectedDevices.includes(`device-${i}`) ? "border-ocean-600 bg-ocean-50 dark:bg-ocean-900/20" : ""
                  }`}
                  onClick={() => toggleDevice(`device-${i}`)}
                >
                  <div className="flex items-center">
                    <div className={`rounded-full p-2 mr-3 ${
                      selectedDevices.includes(`device-${i}`) ? "bg-ocean-100 dark:bg-ocean-800" : "bg-gray-100 dark:bg-gray-800"
                    }`}>
                      <Wifi className={`h-4 w-4 ${
                        selectedDevices.includes(`device-${i}`) ? "text-ocean-600" : "text-gray-500"
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium">{device}</div>
                      <div className="text-sm text-muted-foreground">ID: IOT-{1000 + i}</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border ${
                    selectedDevices.includes(`device-${i}`) 
                      ? "bg-ocean-600 border-ocean-600" 
                      : "border-gray-300 dark:border-gray-600"
                  }`}>
                    {selectedDevices.includes(`device-${i}`) && (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">
                <strong>Note:</strong> Connecting new devices may require additional configuration via the device's management interface.
              </p>
            </div>
          </div>
        ) : deviceData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Device Name</p>
                <p>{deviceData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p>{deviceData.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Device Type</p>
                <p>{deviceData.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="flex items-center text-green-600">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-600 mr-1 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            
            <h3 className="text-sm font-medium">Real-time Measurements</h3>
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Emissions</span>
                    <Activity className="h-4 w-4 text-karbon-600" />
                  </div>
                  <div className="text-xl font-bold">{(Math.random() * 5).toFixed(2)} kg/h</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Temperature</span>
                    <Thermometer className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="text-xl font-bold">{(20 + Math.random() * 10).toFixed(1)}°C</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Energy</span>
                    <Zap className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div className="text-xl font-bold">{Math.floor(Math.random() * 200)} kWh</div>
                </CardContent>
              </Card>
            </div>
            
            <h3 className="text-sm font-medium">Historical Data</h3>
            <div className="h-40 border rounded-md flex items-center justify-center bg-muted/50">
              <p className="text-sm text-muted-foreground">Emissions chart would be displayed here</p>
            </div>
          </div>
        ) : null}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {action === "details" ? "Close" : "Cancel"}
          </Button>
          {action === "connect" && (
            <Button 
              className="bg-ocean-600 hover:bg-ocean-700"
              onClick={handleAction}
              isLoading={isLoading}
              disabled={selectedDevices.length === 0}
            >
              Connect {selectedDevices.length} {selectedDevices.length === 1 ? "Device" : "Devices"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IoTModal;
