"use client";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CrowdfundingModal from "./CrowdfundingModal";
import {
  CrowdfundingValidator,
  StateTokenValidator,
} from "@/config/scripts/crowdfunding/scripts";
import {
  Constr,
  Data,
  Lucid,
  mintingPolicyToId,
  toText,
  Validator,
  validatorToAddress,
} from "@lucid-evolution/lucid";
import { IdetificationPID, NETWORK, PROVIDER } from "@/config";
import { CampaignDatum } from "@/types/cardano/datum";
import { MetadataType } from "@/types/cardano/crowdfunding/types";
import { useCardano } from "@/context/cardanoContext";
import { blockfrost } from "@/lib/blockfrost";
import { getTimeRemaining, toAda } from "@/lib/utils";
import { set } from "date-fns";
import { ApproveCampaign } from "@/lib/cardanoTx/crowdfunding";
import exp from "constants";

const CrowdfundingApp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"submit" | "invest">("submit");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [balance, setBalance] = useState<
    { unit: string; quantity: number; datum: CampaignDatum }[]
  >([]);
  const openSubmitModal = () => {
    setModalAction("submit");
    setIsModalOpen(true);
  };

  const openInvestModal = (project: any) => {
    setSelectedProject(project);
    setModalAction("invest");
    setIsModalOpen(true);
  };

  useEffect(() => {
    async function fetchutxos() {
      const validator: Validator = StateTokenValidator();
      const state_addr = validatorToAddress(NETWORK, validator);
      const lucid = await Lucid(PROVIDER, NETWORK);
      const utxos = await lucid.utxosAt(state_addr);

      utxos.map(async (utxo) => {
        Object.entries(utxo.assets).map(async ([assetKey, quantity]) => {
          if (
            !assetKey.startsWith(IdetificationPID) &&
            !assetKey.startsWith("lovelace")
          ) {
            const data = await lucid.datumOf(utxo);
            const datum = Data.castFrom(data, CampaignDatum);
            setBalance((prev) => [
              ...prev,
              { unit: assetKey, quantity: Number(quantity), datum: datum },
            ]);
          }
        });
      });
    }
    fetchutxos();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Crowdfunding</h2>
        <Button
          className="bg-karbon-600 hover:bg-karbon-700"
          onClick={openSubmitModal}
        >
          <FileText className="mr-2 h-4 w-4" /> Submit Project
        </Button>
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
              <div className="text-3xl font-bold">12</div>
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
              Your Investments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">$2,500</div>
              <ArrowUpRight className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Current portfolio value
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {balance.map((token, index) => (
              <CampaignCard
                key={index}
                datum={token.datum}
                qty={token.quantity}
                token={token.unit}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <CrowdfundingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        action={modalAction}
        projectData={selectedProject}
      />
    </div>
  );
};

export default CrowdfundingApp;

interface CampaignCardProps {
  token: string;
  qty: number;
  datum: CampaignDatum;
}

function CampaignCard({ token, qty, datum }: CampaignCardProps) {
  const [metadata, setMetadata] = useState<MetadataType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remainingToken, setRemainingToken] = useState(0n);
  const [WalletConnection] = useCardano();

  useEffect(() => {
    async function fetchData() {
      const result = await blockfrost.getMetadata(token);
      setMetadata(result);
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    async function fetchQuantity() {
      if (!metadata) return;
      const oref = new Constr(0, [
        String(metadata.hash),
        BigInt(metadata.outputIndex),
      ]);
      const Campaign_Validator = CrowdfundingValidator([
        datum.creator[0],
        oref,
        IdetificationPID,
      ]);
      // validator address & policyId
      const contarctAddress = validatorToAddress(NETWORK, Campaign_Validator);
      const policyId = mintingPolicyToId(Campaign_Validator);
      const lucid = await Lucid(PROVIDER, NETWORK);
      const utxos = await lucid.utxosAtWithUnit(
        contarctAddress,
        policyId + datum.name
      );
      utxos.map((utxo) => {
        Object.entries(utxo.assets).map(async ([assetKey, qty]) => {
          if (assetKey.startsWith(policyId)) {
            setRemainingToken(qty);
          }
        });
      });
    }
    fetchQuantity();
  }, [metadata]);

  const perFraction = datum.goal / datum.fraction;
  const remainingFund = perFraction * remainingToken;
  const raised = toAda(datum.goal - remainingFund);
  const goal = toAda(datum.goal);

  const imageUrl = metadata?.image.replace("ipfs://", "https://ipfs.io/ipfs/");
  const expired = getTimeRemaining(Number(datum.deadline)) === "Time expired";
  const handleApprove = async () => {
    if (!metadata) return;
    ApproveCampaign(WalletConnection, datum, metadata);
  };
  return (
    metadata && (
      <>
        <Card className="border overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-karbon-100 to-ocean-100 dark:from-karbon-900 dark:to-ocean-900 flex items-center justify-center">
            <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
              Project Image
            </span>
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {metadata.campaignName}
                </CardTitle>
                <CardDescription>
                  {"location"} • {"category"}
                </CardDescription>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Timer className="h-4 w-4 mr-1" />
                <span>{getTimeRemaining(Number(datum.deadline))}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">
                    ${(raised / 1000).toFixed(1)}K raised
                  </span>
                  <span className="text-muted-foreground">
                    of ${(goal / 1000).toFixed(2)}K goal
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <div
                    className="h-2 bg-karbon-600 rounded-full"
                    style={{
                      width: `${(raised / goal) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {Math.round((raised / goal) * 100)}% funded
                </div>
                <Button
                  className="bg-ocean-600 hover:bg-ocean-700"
                  onClick={
                    datum.state === "Running"
                      ? () => setIsModalOpen(true)
                      : datum.state === "Initiated"
                      ? handleApprove
                      : undefined
                  }
                  disabled={
                    datum.state === "Finished" ||
                    datum.state === "Cancelled" ||
                    expired
                  }
                >
                  {expired
                    ? "Time expired"
                    : datum.state === "Running"
                    ? "Invest Now"
                    : datum.state === "Initiated"
                    ? "Approve"
                    : datum.state === "Finished" ||
                      (datum.state === "Cancelled" && datum.state)}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <CrowdfundingModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          action={"invest"}
          projectData={datum}
          raised={raised}
          goal={goal}
        />
      </>
    )
  );
}
