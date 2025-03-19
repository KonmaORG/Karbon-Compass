
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, FileCheck, PlusCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProjectRegistrationForm from "./ProjectRegistrationForm";

type Project = {
  id: number;
  name: string;
  location: string;
  type: string;
  credits: number;
};

const RegistryApp = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: "Reforestation Project #1", location: "Brazil", type: "reforestation", credits: 125 },
    { id: 2, name: "Reforestation Project #2", location: "Indonesia", type: "reforestation", credits: 250 },
    { id: 3, name: "Reforestation Project #3", location: "Brazil", type: "reforestation", credits: 375 },
    { id: 4, name: "Reforestation Project #4", location: "Indonesia", type: "reforestation", credits: 500 },
    { id: 5, name: "Reforestation Project #5", location: "Brazil", type: "reforestation", credits: 625 },
  ]);

  const handleRegistration = (projectData: any) => {
    const newProject = {
      id: projects.length + 1,
      name: projectData.name,
      location: projectData.location,
      type: projectData.type,
      credits: parseInt(projectData.estimatedCredits, 10),
    };
    
    setProjects([newProject, ...projects]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Carbon Offset Project Registry</h2>
        <Button 
          className="bg-karbon-600 hover:bg-karbon-700"
          onClick={() => setIsRegistrationOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Register New Project
        </Button>
      </div>
      
      <div className="flex items-center space-x-4 mb-6">
        <Input placeholder="Search projects..." className="max-w-xs" />
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Credits Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">
                {projects.reduce((sum, project) => sum + project.credits, 0).toLocaleString()}
              </div>
              <div className="ml-1 text-lg">tCO₂e</div>
              <FileCheck className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projects Pending Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">37</div>
              <ClipboardCheck className="ml-auto h-5 w-5 text-ocean-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Latest carbon offset projects registered on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                <div className="rounded-full bg-karbon-100 dark:bg-karbon-800 p-2 mr-4">
                  <ClipboardCheck className="h-5 w-5 text-karbon-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{project.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Location: {project.location} • Credits: {project.credits.toLocaleString()} tCO₂e
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ProjectRegistrationForm 
        open={isRegistrationOpen} 
        onOpenChange={setIsRegistrationOpen} 
        onProjectRegistered={handleRegistration}
      />
    </div>
  );
};

export default RegistryApp;
