
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface CrowdfundingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "submit" | "invest";
  projectData?: any;
  onProjectSubmit?: (data: any) => void;
}

// Schema for project submission
const projectFormSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(20, "Please provide a more detailed description"),
  category: z.string().min(1, "Please select a category"),
  location: z.string().min(1, "Please provide a location"),
  fundingGoal: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, "Please enter a valid funding goal")
});

// Schema for investment
const investFormSchema = z.object({
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, "Please enter a valid amount")
});

const CrowdfundingModal = ({ 
  open, 
  onOpenChange, 
  action, 
  projectData,
  onProjectSubmit
}: CrowdfundingModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const projectForm = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      location: "",
      fundingGoal: ""
    }
  });
  
  const investForm = useForm<z.infer<typeof investFormSchema>>({
    resolver: zodResolver(investFormSchema),
    defaultValues: {
      amount: ""
    }
  });
  
  // Handle project submission
  const handleProjectSubmit = (data: z.infer<typeof projectFormSchema>) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      if (onProjectSubmit) {
        onProjectSubmit(data);
      }
      setIsSubmitting(false);
      onOpenChange(false);
      projectForm.reset();
    }, 1000);
  };
  
  // Handle investment submission
  const handleInvestSubmit = (data: z.infer<typeof investFormSchema>) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log("Investment submitted:", { project: projectData?.name, amount: data.amount });
      setIsSubmitting(false);
      onOpenChange(false);
      investForm.reset();
    }, 1000);
  };
  
  // Calculate suggested amounts based on project goal
  const getSuggestedAmounts = () => {
    if (!projectData) return [10, 50, 100];
    
    const goal = projectData.goal;
    return [
      Math.round(goal * 0.01),
      Math.round(goal * 0.05),
      Math.round(goal * 0.1)
    ];
  };
  
  const suggestedAmounts = getSuggestedAmounts();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {action === "submit" ? (
          // Submit Project Form
          <>
            <DialogHeader>
              <DialogTitle>Submit a Carbon Project</DialogTitle>
              <DialogDescription>
                Submit your carbon offset project for verification and fundraising
              </DialogDescription>
            </DialogHeader>
            
            <Form {...projectForm}>
              <form onSubmit={projectForm.handleSubmit(handleProjectSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={projectForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={projectForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Reforestation">Reforestation</SelectItem>
                            <SelectItem value="Renewable Energy">Renewable Energy</SelectItem>
                            <SelectItem value="Agriculture">Sustainable Agriculture</SelectItem>
                            <SelectItem value="Conservation">Conservation</SelectItem>
                            <SelectItem value="Emissions Reduction">Emissions Reduction</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={projectForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Country or region" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={projectForm.control}
                  name="fundingGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Goal (USD)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 100000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={projectForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your carbon offset project in detail" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-karbon-600 hover:bg-karbon-700" isLoading={isSubmitting}>
                    Submit for Verification
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          // Invest in Project Form
          <>
            <DialogHeader>
              <DialogTitle>Invest in {projectData?.name}</DialogTitle>
              <DialogDescription>
                Support this carbon offset project by investing funds
              </DialogDescription>
            </DialogHeader>
            
            <div className="pt-4 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Project</p>
                    <p className="font-medium">{projectData?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{projectData?.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Goal</p>
                    <p className="font-medium">${projectData?.goal.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Funded</p>
                    <p className="font-medium">{Math.round((projectData?.raised / projectData?.goal) * 100)}%</p>
                  </div>
                </div>
              </div>
              
              <Form {...investForm}>
                <form onSubmit={investForm.handleSubmit(handleInvestSubmit)} className="space-y-6">
                  <FormField
                    control={investForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment Amount (USD)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} />
                        </FormControl>
                        <div className="flex gap-2 mt-2">
                          {suggestedAmounts.map((amount, i) => (
                            <Button
                              key={i}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => investForm.setValue("amount", amount.toString())}
                            >
                              ${amount.toLocaleString()}
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-ocean-600 hover:bg-ocean-700" isLoading={isSubmitting}>
                      Complete Investment
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CrowdfundingModal;
