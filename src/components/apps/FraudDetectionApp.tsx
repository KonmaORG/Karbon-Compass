
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const FraudDetectionApp = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fraud Detection & Prevention</h2>
        <Button className="bg-karbon-600 hover:bg-karbon-700">
          <Search className="mr-2 h-4 w-4" /> Run Manual Scan
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold text-green-500">Low</div>
              <Shield className="ml-auto h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              System-wide risk assessment
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">3</div>
              <AlertTriangle className="ml-auto h-5 w-5 text-amber-500" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Requiring investigation
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">1,249</div>
              <CheckCircle className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Fraud Alerts</CardTitle>
          <CardDescription>Anomalies detected by AI monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { severity: 'high', issue: 'Potential double-counting of credits', project: 'Solar Farm Project #12' },
              { severity: 'medium', issue: 'Unusual transaction pattern detected', project: 'Reforestation Initiative #8' },
              { severity: 'low', issue: 'Unverified data source', project: 'Energy Efficiency Program #15' }
            ].map((alert, i) => (
              <div key={i} className={`p-4 border rounded-lg ${
                alert.severity === 'high' ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800' :
                alert.severity === 'medium' ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800' :
                'border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800'
              }`}>
                <div className="flex items-start">
                  <div className={`rounded-full p-2 mr-4 ${
                    alert.severity === 'high' ? 'bg-red-100 dark:bg-red-900/20' :
                    alert.severity === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20' :
                    'bg-blue-100 dark:bg-blue-900/20'
                  }`}>
                    <AlertTriangle className={`h-5 w-5 ${
                      alert.severity === 'high' ? 'text-red-500' :
                      alert.severity === 'medium' ? 'text-amber-500' :
                      'text-blue-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{alert.issue}</div>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        alert.severity === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {alert.severity.toUpperCase()} RISK
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Project: {alert.project}</div>
                    <div className="flex items-center justify-end mt-3 space-x-2">
                      <Button size="sm" variant="outline">Dismiss</Button>
                      <Button size="sm" className="bg-karbon-600 hover:bg-karbon-700">Investigate</Button>
                    </div>
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

export default FraudDetectionApp;
