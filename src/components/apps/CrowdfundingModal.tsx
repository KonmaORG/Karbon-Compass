"use client";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeDollarSign, CreditCard, FileText, Timer } from "lucide-react";
import {
  fromAbsolute,
  getLocalTimeZone,
  today,
  ZonedDateTime,
} from "@internationalized/date";
import { CampaignDatum } from "@/types/cardano/datum";
import {
  fromText,
  paymentCredentialOf,
  stakeCredentialOf,
} from "@lucid-evolution/lucid";
import { CreateCampaign } from "@/lib/cardanoTx/crowdfunding";
import { useCardano } from "@/context/cardanoContext";
import { toLovelace } from "@/lib/utils";
import { DatePicker } from "@heroui/date-picker";
import { set } from "date-fns";

type CrowdfundingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "submit" | "invest";
  projectData?: {
    name: string;
    location: string;
    category: string;
    goal: number;
    raised: number;
    days: number;
  };
  onProjectSubmit?: (data: any) => void;
};

const CrowdfundingModal = ({
  open,
  onOpenChange,
  action,
  projectData,
}: CrowdfundingModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(100);
  const [projectName, setProjectName] = useState<string>("");
  const [projectGoal, setProjectGoal] = useState<number>(0);
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [numberOfMilestones, setNumberOfMilestones] = useState<number>(1);
  const [fractions, setFractions] = useState<number>(0);
  const timezone = getLocalTimeZone();
  const timeNow = fromAbsolute(Date.now(), timezone);
  const [campaignDeadline, setCampaignDeadline] =
    useState<ZonedDateTime | null>(timeNow);

  const [walletConnection] = useCardano();
  const { address } = walletConnection;
  const handleAction = async () => {
    if (!address) {
      toast.error("Wallet not connected!");
      return;
    }
    setIsLoading(true);
    if (action === "submit") {
      if (
        !campaignDeadline ||
        !projectName ||
        !projectGoal ||
        !fractions ||
        !numberOfMilestones ||
        !projectDescription
      ) {
        toast.error("Required fields are missing!");
        setIsLoading(false);
        return;
      }
      const deadline = BigInt(campaignDeadline.toDate().getTime());
      const datum: CampaignDatum = {
        name: fromText(projectName || ""),
        goal: toLovelace(projectGoal || 0),
        deadline: deadline + 100000n, //temporary fix for deadline till date picker works
        creator: [
          paymentCredentialOf(address).hash,
          stakeCredentialOf(address).hash,
        ],
        milestone: new Array(numberOfMilestones).fill(false),
        state: "Initiated",
        fraction: BigInt(fractions),
      };
      await CreateCampaign(walletConnection, datum, projectDescription);
    }
    if (action === "invest") {
      if (!investmentAmount) {
        toast.error("Investment amount is required!");
        setIsLoading(false);
        return;
      }
      // Handle investment logic here
      console.log("Investment Amount:", investmentAmount);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {action === "submit" ? (
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Submit Carbon Project
              </div>
            ) : (
              <div className="flex items-center">
                <BadgeDollarSign className="mr-2 h-5 w-5" />
                Invest in Project
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            {action === "submit"
              ? "Submit your carbon offset project for crowdfunding"
              : `Invest in: ${projectData?.name}`}
          </DialogDescription>
        </DialogHeader>

        {action === "submit" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="project-name"
                placeholder="Enter your project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="project-category"
                  className="text-sm font-medium"
                >
                  Category
                </label>
                <select
                  id="project-category"
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="reforestation">Reforestation</option>
                  <option value="renewable">Renewable Energy</option>
                  <option value="agriculture">Sustainable Agriculture</option>
                  <option value="conservation">Conservation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="project-location"
                  className="text-sm font-medium"
                >
                  Location
                </label>
                <Input id="project-location" placeholder="Country/Region" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="funding-goal" className="text-sm font-medium">
                  Funding Goal ($)
                </label>
                <Input
                  id="funding-goal"
                  type="number"
                  min="1000"
                  placeholder="50000"
                  value={projectGoal}
                  onChange={(e) => setProjectGoal(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                {/* Campaign Deadline */}
                <DatePicker
                  hideTimeZone
                  showMonthAndYearPickers
                  granularity="minute"
                  hourCycle={24}
                  defaultValue={timeNow}
                  label="Set Deadline"
                  minValue={timeNow}
                  onChange={setCampaignDeadline}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="numberOfMilestones"
                  className="text-sm font-medium"
                >
                  Number of Milestones
                </label>
                <Input
                  id="numberOfMilestones"
                  type="number"
                  value={numberOfMilestones.toString()}
                  onChange={(e) => {
                    setNumberOfMilestones(Number(e.target.value));
                    console.log(numberOfMilestones, "changed");
                  }}
                  placeholder="Enter number"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="fractions" className="text-sm font-medium">
                  No of Fractions
                </label>
                <Input
                  id="fractions"
                  type="number"
                  value={fractions.toString()}
                  onChange={(e) => {
                    setFractions(Number(e.target.value));
                  }}
                  placeholder="Enter number of fractions"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="project-summary" className="text-sm font-medium">
                Project Summary
              </label>
              <textarea
                id="project-summary"
                rows={3}
                className="w-full p-2 border rounded-md bg-background"
                placeholder="Brief description of your project..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Image</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-600">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <div className="flex text-sm text-muted-foreground">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer"
                  >
                    <span className="text-karbon-600 hover:underline">
                      Upload a file
                    </span>
                    <input id="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        ) : projectData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Project
                </p>
                <p>{projectData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Location
                </p>
                <p>{projectData.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Category
                </p>
                <p>{projectData.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Time Remaining
                </p>
                <div className="flex items-center">
                  <Timer className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{projectData.days} days</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">
                  ${(projectData.raised / 1000).toFixed(1)}K raised
                </span>
                <span className="text-muted-foreground">
                  of ${(projectData.goal / 1000).toFixed(1)}K goal
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <div
                  className="h-2 bg-karbon-600 rounded-full"
                  style={{
                    width: `${(projectData.raised / projectData.goal) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round((projectData.raised / projectData.goal) * 100)}%
                funded
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">
                Investment Amount ($)
              </label>
              <div className="flex items-center space-x-3">
                {[50, 100, 250, 500].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={
                      investmentAmount === amount ? "default" : "outline"
                    }
                    className={
                      investmentAmount === amount
                        ? "bg-ocean-600 hover:bg-ocean-700"
                        : ""
                    }
                    onClick={() => setInvestmentAmount(amount)}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">Custom:</div>
                <Input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  min={10}
                  max={100000}
                  className="max-w-[150px]"
                />
              </div>
            </div>

            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Investment amount</span>
                <span>${investmentAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Platform fee</span>
                <span>${(investmentAmount * 0.02).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center font-bold">
                <span>Total</span>
                <span>${(investmentAmount * 1.02).toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">
                <strong>Note:</strong> Your investment helps fund carbon
                reduction projects while potentially earning returns from carbon
                credit generation.
              </p>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-ocean-600 hover:bg-ocean-700"
            onClick={handleAction}
            isLoading={isLoading}
          >
            {action === "submit" ? (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Submit Project
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Complete Investment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CrowdfundingModal;
