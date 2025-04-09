import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  Leaf,
  LineChart,
  AlertTriangle,
  Thermometer,
  ShieldCheck,
  ShoppingBag,
  Users,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppType } from "@/component_pages/Dashboard";
import Link from "next/link";

interface SidebarProps {
  activeApp: AppType;
  setActiveApp: (app: AppType) => void;
}

interface AppItem {
  id: AppType;
  name: string;
  icon: React.ReactNode;
  description: string;
  stakeholder?: string;
}

const Sidebar = ({ activeApp, setActiveApp }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const apps: AppItem[] = [
    {
      id: "overview",
      name: "Dashboard Overview",
      icon: <Home size={20} />,
      description: "Overview of all carbon management activities",
    },
    {
      id: "registry",
      name: "Carbon Registry",
      icon: <ClipboardCheck size={20} />,
      description: "Track creation, validation & retirement of carbon credits",
      stakeholder: "Project Developers",
    },
    {
      id: "marketplace",
      name: "Carbon Marketplace",
      icon: <ShoppingBag size={20} />,
      description: "Buy, sell and trade tokenized carbon credits",
      stakeholder: "Credit Buyers",
    },
    {
      id: "footprint",
      name: "Carbon Footprint",
      icon: <LineChart size={20} />,
      description: "Calculate, track and offset your carbon footprint",
      stakeholder: "Individuals/Companies",
    },
    {
      id: "iot",
      name: "IoT Monitoring",
      icon: <Thermometer size={20} />,
      description: "Real-time monitoring of carbon emissions via IoT",
      stakeholder: "Tech Providers",
    },
    {
      id: "fraud",
      name: "Fraud Detection",
      icon: <AlertTriangle size={20} />,
      description: "AI-powered detection of fraudulent carbon activities",
      stakeholder: "Validators/Regulators",
    },
    {
      id: "corporate",
      name: "Corporate Reporting",
      icon: <BarChart3 size={20} />,
      description: "Enterprise-grade sustainability reporting",
      stakeholder: "Corporations",
    },
    {
      id: "governance",
      name: "DAO Governance",
      icon: <Users size={20} />,
      description: "Decentralized governance of the carbon protocol",
      stakeholder: "Community",
    },
    {
      id: "crowdfunding",
      name: "Project Crowdfunding",
      icon: <CreditCard size={20} />,
      description: "Fund carbon projects through crowdfunding",
      stakeholder: "Investors/NGOs",
    },
    {
      id: "educational",
      name: "Educational Hub",
      icon: <BookOpen size={20} />,
      description: "Learn about carbon markets and sustainability",
      stakeholder: "All Users",
    },
  ];

  return (
    <div
      className={cn(
        "h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-karbon-600" />
            <span className="text-lg font-bold text-foreground">
              KarbonLedger
            </span>
          </Link>
        )}
        {collapsed && <Leaf className="h-6 w-6 text-karbon-600 mx-auto" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Apps List */}
      <div className="p-2 space-y-1 overflow-y-auto h-[calc(100%-64px)]">
        {apps.map((app) => (
          <Button
            key={app.id}
            variant={activeApp === app.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start font-normal text-left",
              collapsed ? "px-2" : "px-3"
            )}
            onClick={() => setActiveApp(app.id)}
          >
            <div
              className={cn(
                "flex items-center",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <div
                className={cn(
                  activeApp === app.id
                    ? "text-karbon-600"
                    : "text-muted-foreground"
                )}
              >
                {app.icon}
              </div>
              {!collapsed && (
                <div className="ml-3 flex flex-col">
                  <span className="text-sm">{app.name}</span>
                  {app.stakeholder && (
                    <span className="text-xs text-muted-foreground">
                      {app.stakeholder}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
