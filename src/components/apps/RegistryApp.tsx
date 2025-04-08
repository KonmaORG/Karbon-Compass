"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ClipboardCheck,
  FileCheck,
  PlusCircle,
  Filter,
  Search,
  X,
  FileText,
  Download,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProjectRegistrationForm from "./ProjectRegistrationForm";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { blockfrost } from "@/lib/blockfrost";
import { NETWORK, PROVIDER, VALIDATOR_CONTRACT_ADDRESS } from "@/config";
import {
  Data,
  Lucid,
  mintingPolicyToId,
  toText,
  UTxO,
  Validator,
  validatorToAddress,
} from "@lucid-evolution/lucid";
import { ValidatorContract, ValidatorMinter } from "@/config/scripts/scripts";
import { KarbonDatum } from "@/types/cardano/datum";
import { Provider } from "@radix-ui/react-toast";

export type VerificationStatus =
  | "pending"
  | "in_review"
  | "verified"
  | "rejected";
export type ProjectDocument = {
  id: number;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
};

export type Project = {
  id: number;
  name: string;
  location: string;
  type: string;
  credits: number;
  description?: string;
  verificationStatus: VerificationStatus;
  submittedAt: Date;
  verifiedAt?: Date;
  documents: ProjectDocument[];
};

const RegistryApp = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] =
    useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterLocation, setFilterLocation] = useState<string | undefined>(
    undefined
  );
  const [filterStatus, setFilterStatus] = useState<
    VerificationStatus | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cardanoProjects, setCardanoProjects] = useState<UTxO[]>([]);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Reforestation Project #1",
      location: "Brazil",
      type: "reforestation",
      credits: 125,
      description:
        "Large scale reforestation of degraded land in the Amazon basin",
      verificationStatus: "verified",
      submittedAt: new Date(2024, 0, 15),
      verifiedAt: new Date(2024, 2, 20),
      documents: [
        {
          id: 1,
          name: "Project Methodology.pdf",
          type: "application/pdf",
          url: "#",
          uploadedAt: new Date(2024, 0, 15),
        },
        {
          id: 2,
          name: "Satellite Images.zip",
          type: "application/zip",
          url: "#",
          uploadedAt: new Date(2024, 0, 16),
        },
      ],
    },
    {
      id: 2,
      name: "Reforestation Project #2",
      location: "Indonesia",
      type: "reforestation",
      credits: 250,
      description: "Mangrove restoration project along coastal areas",
      verificationStatus: "in_review",
      submittedAt: new Date(2024, 1, 5),
      documents: [
        {
          id: 3,
          name: "Project Description.pdf",
          type: "application/pdf",
          url: "#",
          uploadedAt: new Date(2024, 1, 5),
        },
      ],
    },
    {
      id: 3,
      name: "Reforestation Project #3",
      location: "Brazil",
      type: "reforestation",
      credits: 375,
      description: "Community-led forest restoration project",
      verificationStatus: "pending",
      submittedAt: new Date(2024, 2, 10),
      documents: [],
    },
    {
      id: 4,
      name: "Solar Farm Project",
      location: "Indonesia",
      type: "renewable-energy",
      credits: 500,
      description:
        "Large scale solar installation providing clean energy to local communities",
      verificationStatus: "verified",
      submittedAt: new Date(2023, 11, 5),
      verifiedAt: new Date(2024, 1, 15),
      documents: [
        {
          id: 4,
          name: "Technical Specifications.pdf",
          type: "application/pdf",
          url: "#",
          uploadedAt: new Date(2023, 11, 5),
        },
        {
          id: 5,
          name: "Impact Assessment.docx",
          type: "application/docx",
          url: "#",
          uploadedAt: new Date(2023, 11, 8),
        },
      ],
    },
    {
      id: 5,
      name: "Methane Capture Project",
      location: "Canada",
      type: "methane-capture",
      credits: 625,
      description: "Capturing methane from agricultural waste",
      verificationStatus: "rejected",
      submittedAt: new Date(2023, 10, 20),
      documents: [
        {
          id: 6,
          name: "Project Proposal.pdf",
          type: "application/pdf",
          url: "#",
          uploadedAt: new Date(2023, 10, 20),
        },
      ],
    },
  ]);

  const handleRegistration = (
    projectData: any,
    documents: ProjectDocument[]
  ) => {
    const newProject: Project = {
      id: projects.length + 1,
      name: projectData.name,
      location: projectData.location,
      type: projectData.type,
      credits: parseInt(projectData.estimatedCredits, 10),
      description: projectData.description,
      verificationStatus: "pending",
      submittedAt: new Date(),
      documents,
    };

    setProjects([newProject, ...projects]);
  };

  const updateProjectStatus = (
    projectId: number,
    newStatus: VerificationStatus
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          const updatedProject = {
            ...project,
            verificationStatus: newStatus,
            ...(newStatus === "verified" ? { verifiedAt: new Date() } : {}),
          };
          return updatedProject;
        }
        return project;
      })
    );

    toast.success(`Project status updated to ${newStatus.replace("_", " ")}`);
    setSelectedProject(null);
  };

  const getVerificationStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "in_review":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            In Review
          </Badge>
        );
      case "verified":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const openVerificationDialog = () => {
    const pendingProjects = projects.filter(
      (p) =>
        p.verificationStatus === "pending" ||
        p.verificationStatus === "in_review"
    );

    if (pendingProjects.length === 0) {
      toast.info("No projects currently pending verification");
      return;
    }

    setIsVerificationDialogOpen(true);
  };

  const filteredProjects = projects
    .filter(
      (project) =>
        !searchQuery ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (project) =>
        !filterType || filterType === "all-types" || project.type === filterType
    )
    .filter(
      (project) =>
        !filterLocation ||
        filterLocation === "all-locations" ||
        project.location === filterLocation
    )
    .filter((project) => {
      if (!filterStatus) return true;
      return project.verificationStatus === filterStatus;
    });

  const projectTypes = Array.from(new Set(projects.map((p) => p.type)));
  const projectLocations = Array.from(new Set(projects.map((p) => p.location)));

  const pendingVerificationCount = projects.filter(
    (p) =>
      p.verificationStatus === "pending" || p.verificationStatus === "in_review"
  ).length;
  const pendingProjects = projects.filter(
    (p) =>
      p.verificationStatus === "pending" || p.verificationStatus === "in_review"
  );

  useEffect(() => {
    const fetchUtxos = async () => {
      const validator: Validator = ValidatorContract();
      const validatorAddress = validatorToAddress(NETWORK, validator);
      const PID_MINTER = mintingPolicyToId(ValidatorMinter());
      const lucid = await Lucid(PROVIDER, NETWORK);
      const utxos = await lucid.utxosAt(validatorAddress);
      const filteredUtxos = utxos.filter((utxo) => {
        const assets = utxo.assets;
        return Object.keys(assets).some((key) => key.startsWith(PID_MINTER));
      });
      // .map(async (utxo) => {
      //   let decodedDatum: KarbonDatum | null = null;
      //   try {
      //     // Convert hex string to buffer and decode CBOR
      //     const data = await lucid.datumOf(utxo);
      //     const decodedDatum = Data.castFrom(data, KarbonDatum);
      //   } catch (error) {
      //     console.error("Error decoding datum:", error);
      //   }

      //   return {
      //     ...utxo,
      //     Datum: decodedDatum, // Add the decoded datum field
      //   };
      // });
      console.log(filteredUtxos, "filteredUtxos");
      setCardanoProjects(filteredUtxos);
    };
    fetchUtxos();
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Carbon Offset Project Registry</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
            onClick={openVerificationDialog}
          >
            <CheckSquare className="mr-2 h-4 w-4" /> Verify Projects
            {pendingVerificationCount > 0 && (
              <Badge
                className="ml-2 bg-amber-200 text-amber-800"
                variant="outline"
              >
                {pendingVerificationCount}
              </Badge>
            )}
          </Button>
          <Button
            className="bg-karbon-600 hover:bg-karbon-700"
            onClick={() => setIsRegistrationOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Register New Project
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">{projects.length}</div>
              <ClipboardCheck className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Credits Issued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">
                {projects
                  .filter((p) => p.verificationStatus === "verified")
                  .reduce((sum, project) => sum + project.credits, 0)
                  .toLocaleString()}
              </div>
              <div className="ml-1 text-lg">tCO₂e</div>
              <FileCheck className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projects Pending Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">
                {pendingVerificationCount}
              </div>
              <ClipboardCheck className="ml-auto h-5 w-5 text-ocean-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            All carbon offset projects registered on the platform
            {(searchQuery || filterType || filterLocation || filterStatus) && (
              <span className="ml-2 text-sm">
                ({filteredProjects.length} results)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Credits (tCO₂e)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cardanoProjects.map((project, index) => (
                <ProjectRows
                  key={index}
                  project={project}
                  setSelectedProject={setSelectedProject}
                  mockProject={filteredProjects[index]}
                />
              ))}

              {filteredProjects.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No projects found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProjectRegistrationForm
        open={isRegistrationOpen}
        onOpenChange={setIsRegistrationOpen}
        onProjectRegistered={handleRegistration}
      />

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Projects</DialogTitle>
            <DialogDescription>
              Apply filters to narrow down project results
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">
                Project Type
              </label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">All types</SelectItem>
                  {projectTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type.replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-locations">All locations</SelectItem>
                  {projectLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                Verification Status
              </label>
              <Select
                value={filterStatus}
                onValueChange={(value: string) => {
                  if (value === "all-statuses") {
                    setFilterStatus(undefined);
                  } else {
                    setFilterStatus(value as VerificationStatus);
                  }
                }}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setFilterType(undefined);
                setFilterLocation(undefined);
                setFilterStatus(undefined);
              }}
            >
              Reset
            </Button>
            <Button onClick={() => setIsFilterOpen(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedProject.name}</span>
                  <div>
                    {getVerificationStatusBadge(
                      selectedProject.verificationStatus
                    )}
                  </div>
                </DialogTitle>
                <DialogDescription>
                  ID: {selectedProject.id} • Submitted:{" "}
                  {selectedProject.submittedAt.toLocaleDateString()}
                  {selectedProject.verifiedAt &&
                    ` • Verified: ${selectedProject.verifiedAt.toLocaleDateString()}`}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Project Type
                    </h3>
                    <p className="capitalize">
                      {selectedProject.type.replace("-", " ")}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Location
                    </h3>
                    <p>{selectedProject.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Credits
                    </h3>
                    <p>{selectedProject.credits.toLocaleString()} tCO₂e</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </h3>
                  <p>
                    {selectedProject.description || "No description provided"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Project Documents
                  </h3>
                  {selectedProject.documents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedProject.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center p-2 border rounded-lg bg-gray-50 dark:bg-gray-900"
                        >
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="flex-1 text-sm">{doc.name}</span>
                          <span className="text-xs text-muted-foreground mr-2">
                            {doc.uploadedAt.toLocaleDateString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No documents attached
                    </p>
                  )}
                </div>

                {(selectedProject.verificationStatus === "pending" ||
                  selectedProject.verificationStatus === "in_review") && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Verification Actions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.verificationStatus === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          onClick={() => {
                            setSelectedProject(selectedProject);
                            setIsVerificationDialogOpen(false);
                          }}
                        >
                          View Details
                        </Button>
                      )}

                      {selectedProject.verificationStatus === "in_review" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            onClick={() => {
                              updateProjectStatus(
                                selectedProject.id,
                                "verified"
                              );
                              toast.success(
                                `${selectedProject.name} has been verified`
                              );
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            onClick={() => {
                              updateProjectStatus(
                                selectedProject.id,
                                "rejected"
                              );
                              toast.error(
                                `${selectedProject.name} has been rejected`
                              );
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedProject(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isVerificationDialogOpen}
        onOpenChange={setIsVerificationDialogOpen}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Verification</DialogTitle>
            <DialogDescription>
              Manage projects awaiting verification
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {pendingProjects.length > 0 ? (
              <div className="space-y-4">
                {pendingProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {project.type.replace("-", " ")} • {project.location}{" "}
                          • {project.credits.toLocaleString()} tCO₂e
                        </div>
                        <div className="mt-1">
                          {getVerificationStatusBadge(
                            project.verificationStatus
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProject(project);
                            setIsVerificationDialogOpen(false);
                          }}
                        >
                          View Details
                        </Button>
                        {project.verificationStatus === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                            onClick={() => {
                              updateProjectStatus(project.id, "in_review");
                              toast.success(`${project.name} moved to review`);
                            }}
                          >
                            Start Review
                          </Button>
                        )}
                        {project.verificationStatus === "in_review" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              onClick={() => {
                                updateProjectStatus(project.id, "verified");
                                toast.success(
                                  `${project.name} has been verified`
                                );
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                              onClick={() => {
                                updateProjectStatus(project.id, "rejected");
                                toast.error(
                                  `${project.name} has been rejected`
                                );
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
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
    </div>
  );
};

export default RegistryApp;

interface ProjectRowsProps {
  project: UTxO;
  setSelectedProject: Dispatch<SetStateAction<Project | null>>;
  mockProject: Project;
}

function ProjectRows({
  project,
  setSelectedProject,
  mockProject,
}: ProjectRowsProps) {
  const [datum, setDatum] = useState<KarbonDatum | undefined>(undefined);

  useEffect(() => {
    async function fetchDatum() {
      const lucid = await Lucid(PROVIDER, NETWORK);
      const data = await lucid.datumOf(project);
      const datum = Data.castFrom(data, KarbonDatum);
      setDatum(datum);
    }
    fetchDatum();
  }, []);

  return (
    datum && (
      <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
        <TableCell> {toText(datum.asset_name)}</TableCell>
        <TableCell className="capitalize">{toText(datum.categories)}</TableCell>
        <TableCell>{"location"}</TableCell>
        <TableCell>{"credits"}</TableCell>
        <TableCell>{"verificationStatus"}</TableCell>
        <TableCell>{"documents"}</TableCell>
        <TableCell className="text-right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedProject(mockProject)}
          >
            Details
          </Button>
        </TableCell>
      </TableRow>
    )
  );
}
