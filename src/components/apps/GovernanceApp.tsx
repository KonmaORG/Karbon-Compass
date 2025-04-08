"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Vote, MessageSquare, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import GovernanceModal from "./GovernanceModal";

const GovernanceApp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"create" | "vote" | "details">(
    "create"
  );
  const [selectedProposal, setSelectedProposal] = useState<any>(null);

  const openCreateModal = () => {
    setModalAction("create");
    setIsModalOpen(true);
  };

  const openVoteModal = (proposal: any) => {
    setSelectedProposal(proposal);
    setModalAction("vote");
    setIsModalOpen(true);
  };

  const openDetailsModal = (proposal: any) => {
    setSelectedProposal(proposal);
    setModalAction("details");
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">DAO Governance</h2>
        <Button
          className="bg-ocean-600 hover:bg-ocean-700"
          onClick={openCreateModal}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Create Proposal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Proposals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">7</div>
              <Vote className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Open for voting
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              DAO Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">1,842</div>
              <Users className="ml-auto h-5 w-5 text-ocean-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Active participants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your Voting Power
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">152</div>
              <div className="ml-1 text-lg">tokens</div>
              <Vote className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Based on staked tokens
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Proposals</CardTitle>
          <CardDescription>
            Governance proposals open for voting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 1,
                title: "Update Carbon Credit Verification Standards",
                category: "Protocol Standards",
                votes: { for: 65, against: 35 },
                days: 3,
              },
              {
                id: 2,
                title: "Add New Project Category: Blue Carbon",
                category: "Protocol Expansion",
                votes: { for: 82, against: 18 },
                days: 5,
              },
              {
                id: 3,
                title: "Increase Validator Requirements",
                category: "Validator Rules",
                votes: { for: 48, against: 52 },
                days: 2,
              },
            ].map((proposal) => (
              <div
                key={proposal.id}
                className="border rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-base">
                        {proposal.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Category: {proposal.category} • Ends in {proposal.days}{" "}
                        days
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                        {proposal.votes.for}% FOR
                      </div>
                      <div className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                        {proposal.votes.against}% AGAINST
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-3">
                    <div
                      className="h-2 bg-karbon-600 rounded-full"
                      style={{ width: `${proposal.votes.for}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{12 + proposal.id * 5} comments</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDetailsModal(proposal)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="bg-karbon-600 hover:bg-karbon-700"
                        onClick={() => openVoteModal(proposal)}
                      >
                        Vote Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <GovernanceModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        action={modalAction}
        proposalData={selectedProposal}
      />
    </div>
  );
};

export default GovernanceApp;
