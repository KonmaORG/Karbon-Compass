"use client";
import { useState } from "react";
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
import { AlertTriangle, Search, Shield } from "lucide-react";

type FraudModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "scan" | "investigate" | "dismiss";
  alertData?: {
    issue: string;
    project: string;
    severity: string;
  };
};

const FraudModal = ({
  open,
  onOpenChange,
  action,
  alertData,
}: FraudModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleAction = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (action === "scan") {
        setScanComplete(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        onOpenChange(false);
        const actionText =
          action === "investigate"
            ? "Investigation initiated"
            : "Alert dismissed";
        toast.success(`${actionText} successfully!`);
      }
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {action === "scan" ? (
              <div className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Manual Fraud Scan
              </div>
            ) : action === "investigate" ? (
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                Investigate Alert
              </div>
            ) : (
              <div className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Dismiss Alert
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            {action === "scan"
              ? "Run a manual scan to detect potential fraudulent activities"
              : action === "investigate"
              ? `Investigate the alert: ${alertData?.issue}`
              : `Dismiss the alert: ${alertData?.issue}`}
          </DialogDescription>
        </DialogHeader>

        {action === "scan" ? (
          <div className="space-y-4">
            {!scanComplete ? (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="scan-type" className="text-sm font-medium">
                      Scan Type
                    </label>
                    <select
                      id="scan-type"
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="all">Complete System Scan</option>
                      <option value="transactions">Transaction Scan</option>
                      <option value="projects">
                        Project Verification Scan
                      </option>
                      <option value="accounts">Account Activity Scan</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="scan-timeframe"
                      className="text-sm font-medium"
                    >
                      Timeframe
                    </label>
                    <select
                      id="scan-timeframe"
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="day">Last 24 hours</option>
                      <option value="week">Last 7 days</option>
                      <option value="month">Last 30 days</option>
                      <option value="all">All time</option>
                    </select>
                  </div>
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm">
                    <strong>Note:</strong> Manual scans might take up to several
                    minutes depending on the selected parameters.
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-200 dark:border-green-800">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800 dark:text-green-300">
                      Scan Complete
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-green-700 dark:text-green-400">
                    No suspicious activities detected
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Scan Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 bg-muted rounded-md">
                      <div className="text-muted-foreground">
                        Transactions scanned
                      </div>
                      <div className="font-medium mt-1">1,249</div>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <div className="text-muted-foreground">
                        Projects verified
                      </div>
                      <div className="font-medium mt-1">42</div>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <div className="text-muted-foreground">
                        Accounts checked
                      </div>
                      <div className="font-medium mt-1">127</div>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <div className="text-muted-foreground">Time elapsed</div>
                      <div className="font-medium mt-1">24 seconds</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : alertData ? (
          <div className="space-y-4">
            <div
              className={`p-4 border rounded-lg ${
                alertData.severity === "high"
                  ? "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800"
                  : alertData.severity === "medium"
                  ? "border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800"
                  : "border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800"
              }`}
            >
              <div className="flex items-start">
                <div
                  className={`rounded-full p-2 mr-4 ${
                    alertData.severity === "high"
                      ? "bg-red-100 dark:bg-red-900/20"
                      : alertData.severity === "medium"
                      ? "bg-amber-100 dark:bg-amber-900/20"
                      : "bg-blue-100 dark:bg-blue-900/20"
                  }`}
                >
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      alertData.severity === "high"
                        ? "text-red-500"
                        : alertData.severity === "medium"
                        ? "text-amber-500"
                        : "text-blue-500"
                    }`}
                  />
                </div>
                <div>
                  <div className="font-medium">{alertData.issue}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Project: {alertData.project}
                  </div>
                  <div
                    className={`text-xs font-medium px-2 py-1 rounded-full mt-2 inline-block ${
                      alertData.severity === "high"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        : alertData.severity === "medium"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    }`}
                  >
                    {alertData.severity.toUpperCase()} RISK
                  </div>
                </div>
              </div>
            </div>

            {action === "investigate" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label
                    htmlFor="investigation-notes"
                    className="text-sm font-medium"
                  >
                    Investigation Notes
                  </label>
                  <textarea
                    id="investigation-notes"
                    rows={3}
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="Enter your findings or next steps..."
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label htmlFor="assign-to" className="text-sm font-medium">
                    Assign To
                  </label>
                  <select
                    id="assign-to"
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="self">Myself</option>
                    <option value="team">Compliance Team</option>
                    <option value="alice">Alice Johnson</option>
                    <option value="bob">Bob Smith</option>
                  </select>
                </div>
              </div>
            )}

            {action === "dismiss" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label
                    htmlFor="dismiss-reason"
                    className="text-sm font-medium"
                  >
                    Reason for Dismissal
                  </label>
                  <select
                    id="dismiss-reason"
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="false-positive">False Positive</option>
                    <option value="already-resolved">Already Resolved</option>
                    <option value="known-issue">Known Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="dismiss-notes"
                    className="text-sm font-medium"
                  >
                    Additional Notes
                  </label>
                  <textarea
                    id="dismiss-notes"
                    rows={2}
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="Provide additional context for dismissal..."
                  ></textarea>
                </div>
              </div>
            )}
          </div>
        ) : null}

        <DialogFooter>
          {!scanComplete ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                className={
                  action === "dismiss"
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-karbon-600 hover:bg-karbon-700"
                }
                onClick={handleAction}
                isLoading={isLoading}
              >
                {action === "scan"
                  ? "Run Scan"
                  : action === "investigate"
                  ? "Start Investigation"
                  : "Dismiss Alert"}
              </Button>
            </>
          ) : (
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FraudModal;
