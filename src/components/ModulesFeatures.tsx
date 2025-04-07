"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  ShieldCheck,
  ShoppingCart,
  Activity,
  Brain,
  Users,
  Link,
  Lock,
  Coins,
} from "lucide-react";

const ModulesFeatures = () => {
  const [selectedModule, setSelectedModule] = useState("tokenization");

  const modules = [
    {
      id: "tokenization",
      title: "Carbon Credit Tokenization",
      icon: <FileText className="h-6 w-6 text-karbon-600" />,
      description:
        "Handles the full lifecycle of carbon offset credits, from tokenization to trading and retirement, ensuring transparency, traceability and efficiency.",
      features: [
        {
          title: "Carbon Offset Credit Tokenization",
          description:
            "Converts verified carbon reductions into fungible or non-fungible tokens (NFTs) for easy trading and fractional ownership.",
        },
        {
          title: "Smart Contract Automation",
          description:
            "Automates issuance, trading and retirement of credits, triggered by verified data.",
        },
        {
          title: "Token Lifecycle Management",
          description:
            "Manages credit issuance, trading and retirement based on pre-set conditions and market requirements.",
        },
      ],
      benefits:
        "Simplifies trading, enhances transparency and automates credit issuance with minimal manual intervention.",
    },
    {
      id: "verification",
      title: "Decentralized Verification",
      icon: <ShieldCheck className="h-6 w-6 text-ocean-600" />,
      description:
        "Verifies carbon projects and emissions reductions using data from IoT devices, satellite imagery and decentralized validators to ensure trust and transparency.",
      features: [
        {
          title: "Decentralized Oracles",
          description:
            "Pull real-time data from trusted sources like IoT devices and satellite imagery.",
        },
        {
          title: "Community-Based Validators",
          description:
            "Use incentive mechanisms to reward validators for assessing project claims, reducing dependence on centralized auditors.",
        },
        {
          title: "Third-Party Standards Integration",
          description:
            "Supports verification with established standards such as Gold Standard and Verified Carbon Standard.",
        },
      ],
      benefits:
        "Reduces verification costs and builds trust by decentralizing project validation, promoting transparency.",
    },
    {
      id: "marketplace",
      title: "Carbon Marketplace",
      icon: <ShoppingCart className="h-6 w-6 text-karbon-600" />,
      description:
        "Facilitates the buying, selling and trading of carbon credits in a decentralized environment.",
      features: [
        {
          title: "Decentralized Exchange (DEX) Integration",
          description:
            "Enables peer-to-peer trading of carbon credits, increasing market liquidity.",
        },
        {
          title: "Auction and Dynamic Pricing",
          description:
            "Implements auction mechanisms to set dynamic prices based on real-time market data and demand.",
        },
      ],
      benefits:
        "Expands access to carbon markets, ensuring credits can flow seamlessly between stakeholders.",
    },
    {
      id: "tracking",
      title: "Carbon Footprint Tracking",
      icon: <Activity className="h-6 w-6 text-ocean-600" />,
      description:
        "Tracks, calculates and visualizes the carbon footprint of individuals and organizations, providing actionable insights to reduce emissions.",
      features: [
        {
          title: "IoT Integration",
          description:
            "Real-time monitoring of energy usage and emissions from industrial, agricultural or transportation sectors using IoT devices.",
        },
        {
          title: "Carbon Footprint Calculator",
          description:
            "Offers tools to estimate emissions and visualize carbon footprints through an intuitive dashboard.",
        },
        {
          title: "AI-Powered Emissions Analytics",
          description:
            "Uses AI and ML algorithms to analyze data, optimize carbon reduction strategies and detect fraudulent activity.",
        },
      ],
      benefits:
        "Provides real-time, actionable insights to participants, helping them reduce emissions and optimize carbon management strategies.",
    },
    {
      id: "analytics",
      title: "AI/ML Analytics",
      icon: <Brain className="h-6 w-6 text-karbon-600" />,
      description:
        "Uses advanced AI and machine learning algorithms to optimize carbon management, detect fraud and predict emissions patterns.",
      features: [
        {
          title: "Predictive Emissions Modeling",
          description:
            "Analyzes historical and real-time data to forecast future emissions and suggest strategies to reduce carbon output.",
        },
        {
          title: "Anomaly Detection for Fraud Prevention",
          description:
            "Uses AI algorithms to detect irregularities in project data or trading activity.",
        },
        {
          title: "Optimization of Carbon Sequestration",
          description:
            "AI-driven models optimize project performance, from reforestation to soil carbon sequestration.",
        },
      ],
      benefits:
        "Enhances decision-making, strengthens fraud detection and improves the efficiency of carbon reduction projects through AI-driven insights.",
    },
    {
      id: "governance",
      title: "Governance & Community",
      icon: <Users className="h-6 w-6 text-ocean-600" />,
      description:
        "Enables decentralized governance of the protocol and fosters community participation in carbon management decisions.",
      features: [
        {
          title: "DAO for Decentralized Governance",
          description:
            "Allows community members to vote on protocol updates, carbon credit standards and fee structures, ensuring democratic decision-making.",
        },
        {
          title: "Incentive Mechanisms for Validators",
          description:
            "Rewards validators for verifying emissions reductions and project outcomes.",
        },
        {
          title: "Educational Hub and Gamification",
          description:
            "Offers educational resources on carbon markets and rewards participants for reducing emissions or engaging in governance.",
        },
      ],
      benefits:
        "Promotes active community participation, decentralized decision-making and education, ensuring the protocol evolves based on user input.",
    },
    {
      id: "integration",
      title: "Integration & API",
      icon: <Link className="h-6 w-6 text-karbon-600" />,
      description:
        "Provides APIs and tools to integrate the decentralized carbon management platform with external systems and blockchains.",
      features: [
        {
          title: "API for External Integration",
          description:
            "Enables third-party applications (e.g., corporate sustainability tracking) to interact with the platform.",
        },
        {
          title: "Blockchain Interoperability",
          description:
            "Facilitates cross-chain carbon credit trading and data sharing across multiple blockchains.",
        },
        {
          title: "Webhook and SDK Support",
          description:
            "Allows for automated actions and seamless interaction between external systems and the protocol.",
        },
      ],
      benefits:
        "Promotes broad adoption by enabling integration with existing platforms and systems, while supporting cross-chain trading.",
    },
    {
      id: "security",
      title: "Privacy & Compliance",
      icon: <Lock className="h-6 w-6 text-ocean-600" />,
      description:
        "Ensures the privacy, security and regulatory compliance of all data and transactions within the decentralized platform.",
      features: [
        {
          title: "Zero-Knowledge Proofs (ZKPs)",
          description:
            "Verifies emissions reductions and project data without revealing sensitive information, ensuring privacy.",
        },
        {
          title: "Data Encryption and Role-Based Access Control",
          description:
            "Protects sensitive data and restricts access based on participant roles (e.g., validators, project developers).",
        },
        {
          title: "Regulatory Compliance Tracking and Reporting",
          description:
            "Generates automated compliance reports for organizations, integrating with national and international carbon registries.",
        },
      ],
      benefits:
        "Ensures data security and privacy while making regulatory compliance straightforward, helping participants meet legal obligations.",
    },
    {
      id: "finance",
      title: "Project Crowdfunding",
      icon: <Coins className="h-6 w-6 text-karbon-600" />,
      description:
        "Supports the decentralized financing of carbon projects through crowdfunding, tokenized investments and smart contracts.",
      features: [
        {
          title: "Crowdfunding Platform",
          description:
            "Allows individuals to fund carbon reduction projects by purchasing carbon credits or tokenized project shares.",
        },
        {
          title: "Smart Contracts for Financial Settlements",
          description:
            "Automates distribution of returns based on project success, reducing administrative burden.",
        },
      ],
      benefits:
        "Empowers small investors to participate in and benefit from sustainability projects, democratizing access to project financing.",
    },
  ];

  return (
    <div
      id="modules"
      className="py-20 bg-gradient-to-b from-background to-karbon-50/50 dark:to-karbon-950/50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Platform Modules & Features
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            KarbonLedger's comprehensive set of modules provides everything
            needed for transparent and efficient carbon management.
          </p>
        </div>

        <Tabs
          defaultValue="tokenization"
          value={selectedModule}
          onValueChange={setSelectedModule}
          className="w-full"
        >
          <div className="overflow-x-auto pb-4">
            <TabsList className="inline-flex w-auto h-auto p-1 mb-8">
              {modules.map((module) => (
                <TabsTrigger
                  key={module.id}
                  value={module.id}
                  className="px-4 py-2 flex items-center gap-2 whitespace-nowrap"
                >
                  {module.icon}
                  <span>{module.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {modules.map((module) => (
            <TabsContent
              key={module.id}
              value={module.id}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {module.icon}
                      <CardTitle>{module.title}</CardTitle>
                    </div>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-karbon-50 dark:bg-karbon-900 rounded-lg">
                      <h4 className="font-semibold mb-2">Key Benefits</h4>
                      <p className="text-foreground/80">{module.benefits}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {module.features.map((feature, index) => (
                        <div
                          key={index}
                          className="p-4 border border-karbon-100 dark:border-karbon-800 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <h4 className="font-semibold mb-2">
                            {feature.title}
                          </h4>
                          <p className="text-foreground/80 text-sm">
                            {feature.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-center mt-12">
          <Button className="bg-karbon-600 hover:bg-karbon-700 text-white">
            Explore KarbonLedger Protocol
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModulesFeatures;
