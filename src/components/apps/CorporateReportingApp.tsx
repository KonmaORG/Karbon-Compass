
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CorporateReportingApp = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Corporate Sustainability Reporting</h2>
        <Button className="bg-karbon-600 hover:bg-karbon-700">
          <FileText className="mr-2 h-4 w-4" /> Generate Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">845</div>
              <div className="ml-1 text-lg">tons CO₂e</div>
              <BarChart3 className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Year-to-date
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Offset Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">520</div>
              <div className="ml-1 text-lg">tons CO₂e</div>
              <BarChart3 className="ml-auto h-5 w-5 text-ocean-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Credits purchased
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Carbon Neutral Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">62%</div>
              <BarChart3 className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 mt-2">
              <div className="bg-karbon-600 h-2.5 rounded-full" style={{ width: '62%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ESG Reports</CardTitle>
            <CardDescription>Recent sustainability reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Annual Sustainability Report 2023', date: 'Dec 15, 2023' },
                { name: 'Q3 2023 Carbon Disclosure', date: 'Oct 10, 2023' },
                { name: 'Climate Action Strategy', date: 'Aug 22, 2023' }
              ].map((report, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 mr-4">
                      <FileText className="h-5 w-5 text-karbon-600" />
                    </div>
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">Published: {report.date}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Emissions by Department</CardTitle>
            <CardDescription>Breakdown of corporate carbon footprint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { dept: 'Operations', percentage: 42, amount: 355 },
                { dept: 'Logistics', percentage: 28, amount: 237 },
                { dept: 'Facilities', percentage: 18, amount: 152 },
                { dept: 'Business Travel', percentage: 12, amount: 101 }
              ].map((dept, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dept.dept}</span>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{dept.amount} tons</span>
                      <span className="text-xs text-muted-foreground">({dept.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-ocean-600 h-2 rounded-full" 
                      style={{ width: `${dept.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CorporateReportingApp;
