
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardOverview from '@/components/DashboardOverview';
import RegistryApp from '@/components/apps/RegistryApp';
import MarketplaceApp from '@/components/apps/MarketplaceApp';
import FootprintApp from '@/components/apps/FootprintApp';
import IoTMonitoringApp from '@/components/apps/IoTMonitoringApp';
import FraudDetectionApp from '@/components/apps/FraudDetectionApp';
import CorporateReportingApp from '@/components/apps/CorporateReportingApp';
import GovernanceApp from '@/components/apps/GovernanceApp';
import CrowdfundingApp from '@/components/apps/CrowdfundingApp';
import EducationalApp from '@/components/apps/EducationalApp';

export type AppType = 
  | 'overview' 
  | 'registry' 
  | 'marketplace' 
  | 'footprint' 
  | 'iot' 
  | 'fraud' 
  | 'corporate' 
  | 'governance' 
  | 'crowdfunding' 
  | 'educational';

const appNames: Record<AppType, string> = {
  overview: 'Dashboard Overview',
  registry: 'Carbon Offset Project Registry',
  marketplace: 'Carbon Credit Marketplace',
  footprint: 'Carbon Footprint Management',
  iot: 'IoT Emissions Monitoring',
  fraud: 'Fraud Detection & Prevention',
  corporate: 'Corporate ESG Reporting',
  governance: 'DAO Governance',
  crowdfunding: 'Project Crowdfunding',
  educational: 'Educational Resources'
};

const Dashboard = () => {
  const [activeApp, setActiveApp] = useState<AppType>('overview');
  const [previousApp, setPreviousApp] = useState<AppType>('overview');

  useEffect(() => {
    if (previousApp !== activeApp) {
      toast.success(`Switched to ${appNames[activeApp]}`);
      setPreviousApp(activeApp);
    }
  }, [activeApp, previousApp]);

  const renderApp = () => {
    switch (activeApp) {
      case 'overview':
        return <DashboardOverview />;
      case 'registry':
        return <RegistryApp />;
      case 'marketplace':
        return <MarketplaceApp />;
      case 'footprint':
        return <FootprintApp />;
      case 'iot':
        return <IoTMonitoringApp />;
      case 'fraud':
        return <FraudDetectionApp />;
      case 'corporate':
        return <CorporateReportingApp />;
      case 'governance':
        return <GovernanceApp />;
      case 'crowdfunding':
        return <CrowdfundingApp />;
      case 'educational':
        return <EducationalApp />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar activeApp={activeApp} setActiveApp={setActiveApp} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeApp={activeApp} />
        <main className="flex-1 overflow-y-auto p-4">
          {renderApp()}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Dashboard;
