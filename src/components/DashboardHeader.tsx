
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Settings, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AppType } from '@/pages/Dashboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  activeApp: AppType;
}

type WalletType = 'MetaMask' | 'WalletConnect' | 'Coinbase' | null;
type UserRole = 'admin' | 'verifier' | 'user' | null;

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
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const connectWallet = async (type: WalletType) => {
    setIsConnecting(true);
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock wallet address and role assignment based on wallet type
      const mockAddress = `0x${Math.random().toString(16).slice(2, 12)}...${Math.random().toString(16).slice(2, 6)}`;
      setWalletAddress(mockAddress);
      setWalletType(type);
      setIsConnected(true);
      
      // Assign a role based on the mock address (this would be replaced with actual RBAC logic)
      const roleAssignment: {[key: string]: UserRole} = {
        '0': 'admin',
        '1': 'verifier',
        '2': 'user',
        '3': 'user',
        '4': 'user',
        '5': 'verifier',
        '6': 'user',
        '7': 'user',
        '8': 'admin',
        '9': 'verifier',
      };
      
      const assignedRole = roleAssignment[mockAddress[2]] || 'user';
      setUserRole(assignedRole);
      
      toast.success(`Wallet connected: ${type}`, {
        description: `Role assigned: ${assignedRole.charAt(0).toUpperCase() + assignedRole.slice(1)}`
      });
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error('Wallet connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setWalletType(null);
    setUserRole(null);
    toast.info('Wallet disconnected');
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'verifier':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'user':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

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
          
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Wallet size={16} />
                  <span className="hidden sm:inline-block text-xs">{walletAddress}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(userRole)}`}>
                    {userRole}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Wallet Connected</DropdownMenuLabel>
                <DropdownMenuItem className="text-xs">{walletAddress}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Wallet Type</DropdownMenuLabel>
                <DropdownMenuItem className="text-xs">{walletType}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Role</DropdownMenuLabel>
                <DropdownMenuItem className="text-xs capitalize">{userRole}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnectWallet}>Disconnect</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Wallet size={16} />
                  <span className="hidden sm:inline-block">Connect Wallet</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled={isConnecting} onClick={() => connectWallet('MetaMask')}>
                  MetaMask
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isConnecting} onClick={() => connectWallet('WalletConnect')}>
                  WalletConnect
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isConnecting} onClick={() => connectWallet('Coinbase')}>
                  Coinbase Wallet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
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
