
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart, Leaf, Users, ShoppingBag, TreeDeciduous } from 'lucide-react';

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Carbon Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">23,456</div>
              <div className="ml-1 text-lg">tCO₂e</div>
              <Leaf className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Total credits issued on platform
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">142</div>
              <TreeDeciduous className="ml-auto h-5 w-5 text-ocean-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Carbon reduction projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Marketplace Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">$1.2M</div>
              <ShoppingBag className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Total trading volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">5,783</div>
              <Users className="ml-auto h-5 w-5 text-ocean-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Across all stakeholder groups
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-0 border-gray-100 dark:border-gray-800">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2">
                    <LineChart className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">New carbon credit issuance</p>
                    <p className="text-xs text-muted-foreground">Project ID: ABC-{i}234 • {i * 235} tCO₂e</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {i * 2} hours ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Applications Overview</CardTitle>
            <CardDescription>Usage across platform modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Carbon Registry', users: 425, icon: <BarChart className="h-4 w-4" /> },
                { name: 'Carbon Marketplace', users: 1258, icon: <ShoppingBag className="h-4 w-4" /> },
                { name: 'Carbon Footprint', users: 879, icon: <LineChart className="h-4 w-4" /> },
                { name: 'IoT Monitoring', users: 364, icon: <LineChart className="h-4 w-4" /> },
                { name: 'DAO Governance', users: 218, icon: <Users className="h-4 w-4" /> }
              ].map((app, i) => (
                <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-0 border-gray-100 dark:border-gray-800">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2">
                    {app.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{app.name}</p>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-karbon-600 h-2 rounded-full" 
                        style={{ width: `${(app.users / 1258) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {app.users} users
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

export default DashboardOverview;
