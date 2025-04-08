"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BadgeDollarSign,
  CreditCard,
  Timer,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CrowdfundingModal from "./CrowdfundingModal";

const CrowdfundingApp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"submit" | "invest">("submit");
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const openSubmitModal = () => {
    setModalAction("submit");
    setIsModalOpen(true);
  };

  const openInvestModal = (project: any) => {
    setSelectedProject(project);
    setModalAction("invest");
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Crowdfunding</h2>
        <Button
          className="bg-karbon-600 hover:bg-karbon-700"
          onClick={openSubmitModal}
        >
          <FileText className="mr-2 h-4 w-4" /> Submit Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">12</div>
              <BadgeDollarSign className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Open for funding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Funded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">$4.2M</div>
              <CreditCard className="ml-auto h-5 w-5 text-ocean-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Across all projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your Investments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">$2,500</div>
              <ArrowUpRight className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Current portfolio value
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Featured Projects</CardTitle>
          <CardDescription>
            Carbon offset projects seeking funding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                id: 1,
                name: "Amazon Rainforest Restoration",
                goal: 350000,
                raised: 182650,
                days: 15,
                location: "Brazil",
                category: "Reforestation",
              },
              {
                id: 2,
                name: "Solar Microgrid Initiative",
                goal: 240000,
                raised: 156800,
                days: 24,
                location: "Kenya",
                category: "Renewable Energy",
              },
              {
                id: 3,
                name: "Sustainable Agriculture Project",
                goal: 180000,
                raised: 72500,
                days: 9,
                location: "India",
                category: "Agriculture",
              },
              {
                id: 4,
                name: "Mangrove Ecosystem Preservation",
                goal: 275000,
                raised: 198000,
                days: 12,
                location: "Indonesia",
                category: "Conservation",
              },
            ].map((project) => (
              <Card key={project.id} className="border overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-karbon-100 to-ocean-100 dark:from-karbon-900 dark:to-ocean-900 flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
                    Project Image
                  </span>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>
                        {project.location} • {project.category}
                      </CardDescription>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Timer className="h-4 w-4 mr-1" />
                      <span>{project.days} days left</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">
                          ${(project.raised / 1000).toFixed(1)}K raised
                        </span>
                        <span className="text-muted-foreground">
                          of ${(project.goal / 1000).toFixed(1)}K goal
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                        <div
                          className="h-2 bg-karbon-600 rounded-full"
                          style={{
                            width: `${(project.raised / project.goal) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {Math.round((project.raised / project.goal) * 100)}%
                        funded
                      </div>
                      <Button
                        className="bg-ocean-600 hover:bg-ocean-700"
                        onClick={() => openInvestModal(project)}
                      >
                        Invest Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <CrowdfundingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        action={modalAction}
        projectData={selectedProject}
      />
    </div>
  );
};

export default CrowdfundingApp;
