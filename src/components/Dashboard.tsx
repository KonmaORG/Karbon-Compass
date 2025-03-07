
import { AreaChart, Thermometer, Activity, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  // Sample data for the dashboard
  const carbonData = {
    totalEmissions: 42.8,
    comparisonPercentage: -12.5,
    emissionsSources: [
      { name: "Energy Consumption", amount: 18.3, percentage: 42.7, trend: "down" },
      { name: "Transportation", amount: 12.5, percentage: 29.2, trend: "down" },
      { name: "Manufacturing", amount: 8.4, percentage: 19.6, trend: "up" },
      { name: "Other Sources", amount: 3.6, percentage: 8.5, trend: "down" }
    ],
    offsetCredits: 15.2,
    netEmissions: 27.6,
    reductionTarget: 75,
    currentReduction: 32
  };

  return (
    <div id="dashboard" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Emissions Dashboard</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Track, analyze, and optimize your carbon footprint with real-time data and actionable insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Emissions Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Emissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">{carbonData.totalEmissions}</div>
                <div className="ml-1 text-lg">tCO₂e</div>
                <div className={`ml-auto flex items-center ${carbonData.comparisonPercentage < 0 ? 'emission-down' : 'emission-up'}`}>
                  {carbonData.comparisonPercentage < 0 ? (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  )}
                  <span>{Math.abs(carbonData.comparisonPercentage)}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Compared to previous month
              </p>
            </CardContent>
          </Card>
          
          {/* Carbon Offsets Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Carbon Offsets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">{carbonData.offsetCredits}</div>
                <div className="ml-1 text-lg">tCO₂e</div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Credits obtained through marketplace
              </p>
            </CardContent>
          </Card>
          
          {/* Net Emissions Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Emissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">{carbonData.netEmissions}</div>
                <div className="ml-1 text-lg">tCO₂e</div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                After applying offset credits
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Emissions by Source Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Emissions by Source</CardTitle>
              <CardDescription>Breakdown of carbon emissions by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {carbonData.emissionsSources.map((source, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">{source.name}</div>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">{source.amount} tCO₂e</span>
                        <span className={`flex items-center text-xs ${source.trend === 'down' ? 'emission-down' : 'emission-up'}`}>
                          {source.trend === 'down' ? (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          )}
                          {source.trend === 'down' ? '↓' : '↑'}
                        </span>
                      </div>
                    </div>
                    <Progress value={source.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Reduction Progress</CardTitle>
              <CardDescription>Towards 2030 carbon neutral goal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#e2e8f0" 
                      strokeWidth="10"
                    />
                    {/* Progress circle */}
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 45} 
                      strokeDashoffset={2 * Math.PI * 45 * (1 - carbonData.currentReduction / 100)}
                      strokeLinecap="round" 
                      className="text-karbon-500 transition-all duration-1000 ease-in-out" 
                      transform="rotate(-90 50 50)" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{carbonData.currentReduction}%</span>
                    <span className="text-xs text-muted-foreground">of target</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Target: {carbonData.reductionTarget}% reduction by 2030
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Real-time Monitoring Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg card-gradient border border-karbon-100 dark:border-karbon-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-karbon-600 mr-2" />
                <span className="font-medium">Building A</span>
              </div>
              <span className="text-sm text-muted-foreground">Real-time</span>
            </div>
            <div className="text-2xl font-bold">24.5 kWh</div>
            <div className="text-sm text-muted-foreground mt-1">Current consumption</div>
          </div>
          
          <div className="p-4 rounded-lg card-gradient border border-karbon-100 dark:border-karbon-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Thermometer className="h-5 w-5 text-ocean-600 mr-2" />
                <span className="font-medium">Data Center</span>
              </div>
              <span className="text-sm text-muted-foreground">Real-time</span>
            </div>
            <div className="text-2xl font-bold">23.1°C</div>
            <div className="text-sm text-muted-foreground mt-1">Average temperature</div>
          </div>
          
          <div className="p-4 rounded-lg card-gradient border border-karbon-100 dark:border-karbon-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-karbon-600 mr-2" />
                <span className="font-medium">Solar Array</span>
              </div>
              <span className="text-sm text-muted-foreground">Real-time</span>
            </div>
            <div className="text-2xl font-bold">12.8 kWh</div>
            <div className="text-sm text-muted-foreground mt-1">Current generation</div>
          </div>
          
          <div className="p-4 rounded-lg card-gradient border border-karbon-100 dark:border-karbon-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <AreaChart className="h-5 w-5 text-ocean-600 mr-2" />
                <span className="font-medium">Transport Fleet</span>
              </div>
              <span className="text-sm text-muted-foreground">Real-time</span>
            </div>
            <div className="text-2xl font-bold">42%</div>
            <div className="text-sm text-muted-foreground mt-1">EV utilization rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
