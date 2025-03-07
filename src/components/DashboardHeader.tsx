
import { Link } from 'react-router-dom';
import { Bell, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppType } from '@/pages/Dashboard';

interface DashboardHeaderProps {
  activeApp: AppType;
}

const getAppTitle = (activeApp: AppType): string => {
  switch (activeApp) {
    case 'overview': return 'Dashboard Overview';
    case 'registry': return 'Carbon Registry';
    case 'marketplace': return 'Carbon Marketplace';
    case 'footprint': return 'Carbon Footprint Management';
    case 'iot': return 'IoT Emissions Monitoring';
    case 'fraud': return 'Fraud Detection & Prevention';
    case 'corporate': return 'Corporate Sustainability Reporting';
    case 'governance': return 'DAO Governance';
    case 'crowdfunding': return 'Project Crowdfunding';
    case 'educational': return 'Educational Hub';
    default: return 'Dashboard';
  }
};

const DashboardHeader = ({ activeApp }: DashboardHeaderProps) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {getAppTitle(activeApp)}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome to the KarbonLedger platform
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex relative">
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] lg:w-[300px]"
            />
          </div>
          
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings size={20} />
          </Button>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User size={20} />
            </Button>
            <div className="hidden md:block">
              <Link to="/" className="text-sm font-medium">
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
