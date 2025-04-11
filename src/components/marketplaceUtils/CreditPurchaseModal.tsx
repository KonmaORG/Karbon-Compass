"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormDescription, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Shield, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { KarbonStoreDatum } from "@/types/cardano/datum";
import { toAda } from "@/lib/utils";
import { Label } from "../ui/label";
import { Buy } from "@/lib/cardanoTx/marketplace";
import { useCardano } from "@/context/cardanoContext";
import { toast } from "sonner";

interface CreditPurchaseModalProps {
  datum: KarbonStoreDatum;
  metadata: any;
  token: string;
  qty: number;
  trigger: React.ReactNode;
}

// Purchase validation schema
export default function CreditPurchaseModal({
  datum,
  metadata,
  token,
  qty,
  trigger,
}: CreditPurchaseModalProps) {
  const [walletConnection] = useCardano();
  const [txHash, setTxHash] = useState("");
  const [open, setOpen] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<"details" | "confirmation">(
    "details"
  );
  const [processingPayment, setProcessingPayment] = useState(false);
  const [purchaseQty, setPurchaseQty] = useState(0);
  const totalPrice = purchaseQty * toAda(datum.amount);

  const onSubmit = async () => {
    try {
      setProcessingPayment(true);
      const txHash = await Buy(walletConnection, datum, token, purchaseQty);
      setTxHash(txHash);
      toast.success("Transaction submitted successfully");
      setPurchaseStep("confirmation");
    } catch (error) {
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Buy Now
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {purchaseStep === "details" && (
          <>
            <DialogHeader>
              <DialogTitle>Purchase Carbon Credits</DialogTitle>
              <DialogDescription>
                {metadata.hName} - {"certification"}
              </DialogDescription>
            </DialogHeader>

            <Label>Quantity (tons of CO₂)</Label>
            <Input
              type="number"
              min={1}
              max={qty}
              value={purchaseQty}
              onChange={(e) => setPurchaseQty(+e.target.value)}
            />
            <div>Available: {qty.toLocaleString()} credits</div>

            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Price per unit:</span>
                <span className="font-medium">
                  ${toAda(datum.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Quantity:</span>
                <span className="font-medium">{purchaseQty}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="font-medium">Total price:</span>
                <span className="font-bold text-lg">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <Checkbox />
            <div className="space-y-1 leading-none">
              <Label>I agree to the terms and conditions</Label>
              <div>
                By purchasing, you agree that these credits will be tokenized on
                the blockchain.
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={processingPayment}
                onClick={onSubmit}
              >
                {processingPayment
                  ? "Processing Payment..."
                  : "Complete Purchase"}
              </Button>
            </DialogFooter>
          </>
        )}

        {purchaseStep === "confirmation" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-green-600 flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Purchase Successful!
              </DialogTitle>
              <DialogDescription>
                Your carbon credit purchase has been processed
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-lg mb-2">
                  Transaction Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project:</span>
                    <span className="font-medium">{metadata.hName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credit Type:</span>
                    <span className="font-medium">{metadata.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{purchaseQty} tons CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-medium">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Transaction ID:
                    </span>
                    <span className="font-mono text-xs flex items-baseline">
                      {txHash.slice(0, 10)}...
                      {txHash.slice(-10)}
                      <ExternalLink size={10} className="ml-1 inline" />
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Your carbon credits have been tokenized and added to your
                account. You can view your credits in your dashboard or retire
                them to offset your carbon footprint.
              </p>
            </div>

            <DialogFooter>
              <Button
                onClick={() => {
                  setOpen(false);
                  setPurchaseStep("details");
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
