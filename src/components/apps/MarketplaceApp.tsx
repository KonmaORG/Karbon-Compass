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
  CheckCircle,
  XCircle,
  AlertCircle,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CrowdfundingModal from "./CrowdfundingModal";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import dynamic from "next/dynamic";
const CreditListingCards = dynamic(
  () => import("../marketplaceUtils/CreditListingCards"),
  {
    ssr: false,
  }
);
const MarketplaceSellModal = dynamic(
  () => import("../marketplaceUtils/MarketplaceSellModal"),
  {
    ssr: false,
  }
);

// Project verification status type
type VerificationStatus = "pending" | "approved" | "rejected" | "canceled";

// Project type definition
type Project = {
  id: number;
  name: string;
  goal: number;
  raised: number;
  days: number;
  location: string;
  category: string;
  description?: string;
  verificationStatus: VerificationStatus;
  submittedAt: Date;
  createdBy?: string; // Added to track project creator
};

const CrowdfundingApp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"submit" | "invest">("submit");
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] =
    useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [projectToCancel, setProjectToCancel] = useState<Project | null>(null);

  // Mock current user ID (in a real app, this would come from authentication)
  const currentUserId = "user123";

  // All projects, including those pending verification
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Amazon Rainforest Restoration",
      goal: 350000,
      raised: 182650,
      days: 15,
      location: "Brazil",
      category: "Reforestation",
      description:
        "Large-scale reforestation project in the Amazon rainforest to restore degraded land and protect biodiversity.",
      verificationStatus: "approved",
      submittedAt: new Date(2024, 2, 15),
      createdBy: "user123",
    },
    {
      id: 2,
      name: "Solar Microgrid Initiative",
      goal: 240000,
      raised: 156800,
      days: 24,
      location: "Kenya",
      category: "Renewable Energy",
      description:
        "Building solar microgrids to provide clean energy access to rural communities in Kenya.",
      verificationStatus: "approved",
      submittedAt: new Date(2024, 2, 5),
      createdBy: "user456",
    },
    {
      id: 3,
      name: "Sustainable Agriculture Project",
      goal: 180000,
      raised: 72500,
      days: 9,
      location: "India",
      category: "Agriculture",
      description:
        "Implementing sustainable farming practices to reduce carbon emissions and improve soil health.",
      verificationStatus: "approved",
      submittedAt: new Date(2024, 1, 28),
      createdBy: "user789",
    },
    {
      id: 4,
      name: "Mangrove Ecosystem Preservation",
      goal: 275000,
      raised: 198000,
      days: 12,
      location: "Indonesia",
      category: "Conservation",
      description:
        "Protecting and restoring mangrove ecosystems to sequester carbon and protect coastal communities.",
      verificationStatus: "approved",
      submittedAt: new Date(2024, 1, 20),
      createdBy: "user123",
    },
    {
      id: 5,
      name: "Urban Green Spaces Initiative",
      goal: 120000,
      raised: 0,
      days: 30,
      location: "United States",
      category: "Urban Greening",
      description:
        "Creating carbon-absorbing green spaces in urban environments to combat heat islands and improve air quality.",
      verificationStatus: "pending",
      submittedAt: new Date(2024, 3, 2),
      createdBy: "user456",
    },
    {
      id: 6,
      name: "Methane Capture from Landfills",
      goal: 290000,
      raised: 0,
      days: 45,
      location: "Canada",
      category: "Emissions Reduction",
      description:
        "Implementing technology to capture methane emissions from landfills and convert them to usable energy.",
      verificationStatus: "pending",
      submittedAt: new Date(2024, 3, 5),
      createdBy: "user123",
    },
  ]);

  // Filter projects for display (only approved projects)
  const approvedProjects = projects.filter(
    (project) => project.verificationStatus === "approved"
  );

  // Count pending verification projects
  const pendingVerificationCount = projects.filter(
    (project) => project.verificationStatus === "pending"
  ).length;

  const openSubmitModal = () => {
    setModalAction("submit");
    setIsModalOpen(true);
  };

  const openInvestModal = (project: Project) => {
    setSelectedProject(project);
    setModalAction("invest");
    setIsModalOpen(true);
  };

  const openVerificationDialog = () => {
    if (pendingVerificationCount === 0) {
      toast.info("No projects currently pending verification");
      return;
    }
    setIsVerificationDialogOpen(true);
  };

  const handleProjectSubmit = (projectData: any) => {
    const newProject: Project = {
      id: projects.length + 1,
      name: projectData.name,
      goal: parseFloat(projectData.fundingGoal),
      raised: 0,
      days: 30, // Default funding period
      location: projectData.location,
      category: projectData.category,
      description: projectData.description,
      verificationStatus: "pending",
      submittedAt: new Date(),
      createdBy: currentUserId, // Associate project with current user
    };

    setProjects([...projects, newProject]);
    toast.success("Project submitted for verification");
  };

  const updateProjectStatus = (
    projectId: number,
    status: VerificationStatus
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            verificationStatus: status,
          };
        }
        return project;
      })
    );

    const statusText =
      status === "approved"
        ? "approved"
        : status === "rejected"
        ? "rejected"
        : "canceled";
    toast.success(`Project ${statusText} successfully`);
  };

  const openCancelDialog = (project: Project) => {
    setProjectToCancel(project);
    setIsCancelDialogOpen(true);
  };

  const handleCancelProject = () => {
    if (projectToCancel) {
      updateProjectStatus(projectToCancel.id, "canceled");
      setIsCancelDialogOpen(false);
      setProjectToCancel(null);
    }
  };

  const getVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Pending Verification
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      case "canceled":
        return (
          <Badge variant="canceled" className="flex items-center gap-1">
            <Ban className="h-3 w-3" /> Canceled
          </Badge>
        );
      default:
        return null;
    }
  };

  // Check if the current user is the creator of a project
  const isProjectOwner = (project: Project) => {
    return project.createdBy === currentUserId;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Crowdfunding</h2>
        <div className="flex gap-2">
          <Button
            className="bg-amber-600 hover:bg-amber-700"
            onClick={openVerificationDialog}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Verify Projects
            {pendingVerificationCount > 0 && (
              <Badge variant="warning" className="ml-2">
                {pendingVerificationCount}
              </Badge>
            )}
          </Button>

          <MarketplaceSellModal />
        </div>
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
              <div className="text-3xl font-bold">
                {approvedProjects.length}
              </div>
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
              Pending Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">
                {pendingVerificationCount}
              </div>
              <AlertCircle className="ml-auto h-5 w-5 text-amber-500" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Awaiting review
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CreditListingCards />

            {/* {approvedProjects.length === 0 && (
              <div className="col-span-2 py-12 text-center text-muted-foreground">
                No approved projects available for funding yet.
              </div>
            )} */}
          </div>
        </CardContent>
      </Card>

      {/* Project Verification Dialog */}
      <Dialog
        open={isVerificationDialogOpen}
        onOpenChange={setIsVerificationDialogOpen}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Verification</DialogTitle>
            <DialogDescription>
              Review and approve carbon offset projects for crowdfunding
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {projects
              .filter((project) => project.verificationStatus === "pending")
              .map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{project.name}</CardTitle>
                      {getVerificationBadge(project.verificationStatus)}
                    </div>
                    <CardDescription>
                      Submitted: {project.submittedAt.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Category
                        </h3>
                        <p>{project.category}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Location
                        </h3>
                        <p>{project.location}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Funding Goal
                        </h3>
                        <p>${project.goal.toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Description
                      </h3>
                      <p>{project.description || "No description provided"}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-100 hover:bg-red-100"
                        onClick={() =>
                          updateProjectStatus(project.id, "rejected")
                        }
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                        onClick={() =>
                          updateProjectStatus(project.id, "approved")
                        }
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {projects.filter(
              (project) => project.verificationStatus === "pending"
            ).length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">
                  No projects pending verification
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsVerificationDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Cancellation Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cancel Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this project? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          {projectToCancel && (
            <div className="py-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {projectToCancel.name}
                  </CardTitle>
                  <CardDescription>
                    {projectToCancel.location} • {projectToCancel.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Current Funding
                      </p>
                      <p className="font-medium">
                        ${projectToCancel.raised.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Goal</p>
                      <p className="font-medium">
                        ${projectToCancel.goal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">
                      Important Notice
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      Canceling this project will:
                    </p>
                    <ul className="text-sm text-amber-700 mt-1 list-disc pl-5">
                      <li>
                        Mark the project as canceled and remove it from active
                        listings
                      </li>
                      <li>
                        Return all invested funds to the investors (in a real
                        application)
                      </li>
                      <li>Send notifications to all stakeholders</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              Keep Project Active
            </Button>
            <Button variant="destructive" onClick={handleCancelProject}>
              <Ban className="mr-2 h-4 w-4" /> Cancel Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrowdfundingApp;
