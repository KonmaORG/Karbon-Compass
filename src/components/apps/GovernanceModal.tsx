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
import { PlusCircle, Vote, MessageSquare } from "lucide-react";

type GovernanceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "create" | "vote" | "details";
  proposalData?: {
    title: string;
    category: string;
    votes: {
      for: number;
      against: number;
    };
    days: number;
  };
};

const GovernanceModal = ({
  open,
  onOpenChange,
  action,
  proposalData,
}: GovernanceModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [voteType, setVoteType] = useState<"for" | "against" | null>(null);

  const handleAction = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      const actionText =
        action === "create"
          ? "Proposal created"
          : action === "vote"
          ? "Vote submitted"
          : "Proposal details viewed";
      toast.success(`${actionText} successfully!`);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {action === "create" ? (
              <div className="flex items-center">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create New Proposal
              </div>
            ) : action === "vote" ? (
              <div className="flex items-center">
                <Vote className="mr-2 h-5 w-5" />
                Vote on Proposal
              </div>
            ) : (
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Proposal Details
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            {action === "create"
              ? "Submit a new governance proposal to the DAO"
              : action === "vote"
              ? `Cast your vote on: ${proposalData?.title}`
              : `View details for: ${proposalData?.title}`}
          </DialogDescription>
        </DialogHeader>

        {action === "create" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="proposal-title" className="text-sm font-medium">
                Proposal Title
              </label>
              <Input
                id="proposal-title"
                placeholder="Enter a clear, concise title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="proposal-category"
                  className="text-sm font-medium"
                >
                  Category
                </label>
                <select
                  id="proposal-category"
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="protocol">Protocol Standards</option>
                  <option value="expansion">Protocol Expansion</option>
                  <option value="validator">Validator Rules</option>
                  <option value="treasury">Treasury Management</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="voting-period" className="text-sm font-medium">
                  Voting Period
                </label>
                <select
                  id="voting-period"
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="3">3 days</option>
                  <option value="5">5 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="proposal-summary" className="text-sm font-medium">
                Summary
              </label>
              <Input
                id="proposal-summary"
                placeholder="Brief summary of your proposal"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="proposal-description"
                className="text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="proposal-description"
                rows={5}
                className="w-full p-2 border rounded-md bg-background"
                placeholder="Detailed description of your proposal..."
              ></textarea>
            </div>
          </div>
        ) : proposalData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-muted-foreground">
                  Category
                </div>
                <div>{proposalData.category}</div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">
                  Voting Ends
                </div>
                <div>In {proposalData.days} days</div>
              </div>
            </div>

            {action === "vote" ? (
              <div className="space-y-4">
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <div
                    className="h-2 bg-karbon-600 rounded-full"
                    style={{ width: `${proposalData.votes.for}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-karbon-600 rounded-full"></div>
                    <span>{proposalData.votes.for}% FOR</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <span>{proposalData.votes.against}% AGAINST</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Cast Your Vote</label>
                  <div className="flex space-x-3">
                    <div
                      className={`flex-1 border rounded-md p-4 cursor-pointer ${
                        voteType === "for"
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "hover:border-muted-foreground"
                      }`}
                      onClick={() => setVoteType("for")}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Vote For</span>
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            voteType === "for"
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {voteType === "for" && (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        Support this proposal and vote for its approval
                      </p>
                    </div>

                    <div
                      className={`flex-1 border rounded-md p-4 cursor-pointer ${
                        voteType === "against"
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "hover:border-muted-foreground"
                      }`}
                      onClick={() => setVoteType("against")}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Vote Against</span>
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            voteType === "against"
                              ? "bg-red-500 border-red-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {voteType === "against" && (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        Oppose this proposal and vote against its approval
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="vote-rationale"
                    className="text-sm font-medium"
                  >
                    Rationale (Optional)
                  </label>
                  <textarea
                    id="vote-rationale"
                    rows={2}
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="Explain your voting decision..."
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Proposal Description</h3>
                  <p className="text-sm text-muted-foreground">
                    This proposal aims to update the carbon credit verification
                    standards to enhance transparency and accountability in the
                    verification process. The new standards will require more
                    rigorous documentation and third-party validation.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Current Voting Status
                  </h3>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <div
                      className="h-2 bg-karbon-600 rounded-full"
                      style={{ width: `${proposalData.votes.for}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <div>{proposalData.votes.for}% FOR</div>
                    <div>{proposalData.votes.against}% AGAINST</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Recent Comments</h3>
                  <div className="space-y-2">
                    {[
                      {
                        user: "Alice Johnson",
                        comment:
                          "This is a much needed update to our standards.",
                        time: "2 hours ago",
                      },
                      {
                        user: "Bob Smith",
                        comment:
                          "I have concerns about the implementation timeline.",
                        time: "5 hours ago",
                      },
                    ].map((comment, i) => (
                      <div key={i} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{comment.user}</span>
                          <span className="text-xs text-muted-foreground">
                            {comment.time}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-karbon-600 hover:bg-karbon-700"
            onClick={handleAction}
            isLoading={isLoading}
            disabled={action === "vote" && !voteType}
          >
            {action === "create"
              ? "Submit Proposal"
              : action === "vote"
              ? "Submit Vote"
              : "Close Details"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GovernanceModal;
