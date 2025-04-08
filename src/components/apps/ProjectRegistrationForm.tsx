"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, FileCheck, Upload, Paperclip } from "lucide-react";
import { ProjectDocument } from "./RegistryApp";
import { CATEGORIES } from "@/config";
import { submitProject } from "@/lib/cardanoTx/registry";
import { useCardano } from "@/context/cardanoContext";

type ProjectFormValues = {
  name: string;
  location: string;
  type: string;
  estimatedCredits: string;
  description: string;
};

const initialFormValues: ProjectFormValues = {
  name: "",
  location: "",
  type: "reforestation",
  estimatedCredits: "",
  description: "",
};

interface ProjectRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectRegistered?: (
    project: ProjectFormValues,
    documents: ProjectDocument[]
  ) => void;
}

const ProjectRegistrationForm = ({
  open,
  onOpenChange,
  onProjectRegistered,
}: ProjectRegistrationFormProps) => {
  const [walletConnection] = useCardano();
  const [formValues, setFormValues] =
    useState<ProjectFormValues>(initialFormValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof ProjectFormValues, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File change triggered", e.target.files);
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    } else {
      console.log("No files selected");
    }
  };
  const handleFiles = (files: FileList) => {
    try {
      const newDocs = Array.from(files).map((file) => ({
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
      }));

      setDocuments((prevDocs) => [...prevDocs, ...newDocs]);
      newDocs.forEach((doc) => toast.success(`File ${doc.name} added`));
    } catch (error) {
      console.error("Error processing files:", error);
      toast.error("Error uploading files");
    }
  };

  const removeDocument = (docId: number) => {
    setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== docId));
  };

  const calculateCombinedHash = async (
    documents: ProjectDocument[]
  ): Promise<string> => {
    try {
      // Get individual hashes
      const individualHashes = await Promise.all(
        documents.map(async (doc) => {
          const file = await fetch(doc.url).then((res) => res.blob()); // Convert URL back to file-like object
          const buffer = await file.arrayBuffer();
          const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        })
      );

      // Combine all hashes into a single string
      const combinedString = individualHashes.join("");

      // Create a final hash from the combined string
      const encoder = new TextEncoder();
      const combinedBuffer = encoder.encode(combinedString);
      const finalHashBuffer = await crypto.subtle.digest(
        "SHA-256",
        combinedBuffer
      );
      const finalHashArray = Array.from(new Uint8Array(finalHashBuffer));
      return finalHashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch (error) {
      console.error("Error calculating combined hash:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call with timeout
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      //call cardano register function here
      const documentsHash = await calculateCombinedHash(documents);
      await submitProject(
        walletConnection,
        documentsHash,
        formValues.type,
        formValues.name
      );
      console.log(formValues, documents);
      // Handle success
      if (onProjectRegistered) {
        onProjectRegistered(formValues, documents);
      }

      toast.success("Project successfully registered", {
        description: `${formValues.name} has been registered and is pending verification.`,
      });

      // Reset form and close dialog
      setFormValues(initialFormValues);
      setDocuments([]);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to register project", {
        description:
          "There was an error registering your project. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
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
                  {CATEGORIES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated-credits">
                Estimated Credits (tCO₂e)
              </Label>
              <Input
                id="estimated-credits"
                type="number"
                min="1"
                value={formValues.estimatedCredits}
                onChange={(e) =>
                  handleChange("estimatedCredits", e.target.value)
                }
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

          <div className="space-y-2">
            <Label>Project Documents</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <Paperclip className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">
                Drag and drop files here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload project documentation, methodologies, and supporting
                evidence
              </p>
              <Input
                type="file"
                className="hidden"
                id="file-upload"
                multiple
                onChange={handleFileChange}
                accept="*" // Optional: specify accepted file types if needed
              />
              <Label htmlFor="file-upload" className="mt-4 inline-block">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> Browse Files
                </Button>
              </Label>
            </div>
          </div>

          {/* Document Preview Section */}
          {documents.length > 0 && (
            <div className="space-y-2">
              <Label>Attached Documents ({documents.length})</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto p-1">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <FileCheck className="h-4 w-4 text-green-600" />
                      <span className="text-sm truncate max-w-[200px] sm:max-w-[300px]">
                        {doc.name}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-500 hover:text-red-500"
                      onClick={() => removeDocument(doc.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-karbon-600 hover:bg-karbon-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectRegistrationForm;
