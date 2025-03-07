
import { 
  BarChart3, 
  Shield, 
  Users, 
  Zap,
  Globe, 
  Leaf, 
  Repeat, 
  Lock 
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <BarChart3 className="h-6 w-6 text-karbon-600" />,
      title: "Real-time Emissions Tracking",
      description: "Monitor carbon emissions across your organization with accurate, real-time data collection and analysis."
    },
    {
      icon: <Shield className="h-6 w-6 text-ocean-600" />,
      title: "Verified Carbon Credits",
      description: "Issue, verify, and trade tokenized carbon credits with full transparency and auditability."
    },
    {
      icon: <Globe className="h-6 w-6 text-karbon-600" />,
      title: "Global Participation",
      description: "Lower barriers for individuals, organizations, and communities to engage in carbon markets."
    },
    {
      icon: <Users className="h-6 w-6 text-ocean-600" />,
      title: "Decentralized Governance",
      description: "Stakeholder-driven decisions ensure transparency, accountability, and community alignment."
    },
    {
      icon: <Lock className="h-6 w-6 text-karbon-600" />,
      title: "Secure & Immutable",
      description: "Blockchain technology ensures data integrity and transparent verification of carbon claims."
    },
    {
      icon: <Zap className="h-6 w-6 text-ocean-600" />,
      title: "AI-powered Insights",
      description: "Machine learning algorithms identify optimization opportunities and predict emissions trends."
    },
    {
      icon: <Repeat className="h-6 w-6 text-karbon-600" />,
      title: "Automated Compliance",
      description: "Streamline ESG reporting and regulatory compliance with automated data collection and reporting."
    },
    {
      icon: <Leaf className="h-6 w-6 text-ocean-600" />,
      title: "Incentivized Sustainability",
      description: "Reward emissions reduction efforts through financial incentives and transparent recognition."
    }
  ];

  return (
    <div id="features" className="py-20 bg-gradient-to-b from-background to-karbon-50/50 dark:to-karbon-950/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Carbon Management</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            KarbonLedger combines cutting-edge technology with environmental responsibility to create a comprehensive carbon management solution.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 rounded-lg card-gradient border border-karbon-100 dark:border-karbon-800 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
