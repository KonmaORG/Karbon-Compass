
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ProjectFormValues = {
  name: string;
  location: string;
  type: string;
  estimatedCredits: string;
  description: string;
}

const initialFormValues: ProjectFormValues = {
  name: "",
  location: "",
  type: "reforestation",
  estimatedCredits: "",
  description: ""
}

interface ProjectRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectRegistered?: (project: ProjectFormValues) => void;
}

const ProjectRegistrationForm = ({ 
  open, 
  onOpenChange,
  onProjectRegistered 
}: ProjectRegistrationFormProps) => {
  const [formValues, setFormValues] = useState<ProjectFormValues>(initialFormValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof ProjectFormValues, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle success
      if (onProjectRegistered) {
        onProjectRegistered(formValues);
      }
      
      toast.success("Project successfully registered", {
        description: `${formValues.name} has been registered and is pending verification.`
      });
      
      // Reset form and close dialog
      setFormValues(initialFormValues);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to register project", {
        description: "There was an error registering your project. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Register New Carbon Offset Project</DialogTitle>
          <DialogDescription>
            Fill out the details below to register a new carbon offset project. 
            All projects undergo verification before credits can be issued.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input 
                id="name" 
                value={formValues.name} 
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Amazon Reforestation Initiative" 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={formValues.location} 
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g., Brazil, Amazon Basin" 
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-type">Project Type</Label>
              <Select 
                value={formValues.type} 
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger id="project-type">
                  <SelectValue placeholder="Select a project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reforestation">Reforestation</SelectItem>
                  <SelectItem value="renewable-energy">Renewable Energy</SelectItem>
                  <SelectItem value="methane-capture">Methane Capture</SelectItem>
                  <SelectItem value="soil-carbon">Soil Carbon Sequestration</SelectItem>
                  <SelectItem value="conservation">Forest Conservation</SelectItem>
                  <SelectItem value="blue-carbon">Blue Carbon (Coastal)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimated-credits">Estimated Credits (tCO₂e)</Label>
              <Input 
                id="estimated-credits" 
                type="number" 
                min="1"
                value={formValues.estimatedCredits} 
                onChange={(e) => handleChange("estimatedCredits", e.target.value)}
                placeholder="e.g., 5000" 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea 
              id="description" 
              value={formValues.description} 
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the project's objectives, methodology, and expected impact..." 
              className="h-24" 
              required 
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-karbon-600 hover:bg-karbon-700" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectRegistrationForm;
