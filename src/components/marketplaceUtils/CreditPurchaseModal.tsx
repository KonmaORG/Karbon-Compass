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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ShoppingCart,
  CreditCard,
  Wallet,
  ArrowRight,
  Shield,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreditListing, PurchaseFormData } from "./types";

interface CreditPurchaseModalProps {
  credit: CreditListing;
  trigger?: React.ReactNode;
}

// Purchase validation schema
const purchaseSchema = z.object({
  quantity: z
    .number()
    .min(1, { message: "Quantity must be at least 1" })
    .refine((val) => Number.isInteger(val), {
      message: "Quantity must be a whole number",
    }),
  paymentMethod: z.enum(["crypto", "fiat"], {
    required_error: "Please select a payment method",
  }),
  agreeTos: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  buyerWallet: z.string().optional(),
});

export function CreditPurchaseModal({
  credit,
  trigger,
}: CreditPurchaseModalProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<
    "details" | "payment" | "confirmation"
  >("details");
  const [processingPayment, setProcessingPayment] = useState(false);

  const form = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      quantity: 1,
      paymentMethod: "crypto",
      agreeTos: false,
      buyerWallet: "",
    },
  });

  const quantity = form.watch("quantity");
  const totalPrice = quantity * credit.pricePerUnit;
  const paymentMethod = form.watch("paymentMethod");

  const onSubmit = (data: z.infer<typeof purchaseSchema>) => {
    // call cardano function to submit
    // then set the step to confirmation

    if (purchaseStep === "details") {
      // Start payment processing
      setProcessingPayment(true);

      // Simulate blockchain transaction
      setTimeout(() => {
        setProcessingPayment(false);
        setPurchaseStep("confirmation");
      }, 2000);
      return;
    }

    if (purchaseStep === "confirmation") {
      // Complete purchase and close modal
      const purchaseData: PurchaseFormData = {
        creditId: credit.id,
        quantity: data.quantity,
        totalPrice: totalPrice,
        paymentMethod: data.paymentMethod,
        buyerWallet: data.buyerWallet,
        agreeTos: data.agreeTos,
      };

      // Here you would typically call an API to complete the purchase
      console.log("Purchase completed:", purchaseData);

      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${quantity} carbon credits from ${credit.projectName}`,
      });

      // Reset form and close dialog
      form.reset();
      setPurchaseStep("details");
      setOpen(false);
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
                {credit.projectName} - {credit.certification}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity (tons of CO₂)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={credit.quantity}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Available: {credit.quantity.toLocaleString()} credits
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Price per unit:</span>
                    <span className="font-medium">
                      ${credit.pricePerUnit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Quantity:</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="font-medium">Total price:</span>
                    <span className="font-bold text-lg">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="agreeTos"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the terms and conditions
                        </FormLabel>
                        <FormDescription>
                          By purchasing, you agree that these credits will be
                          tokenized on the blockchain.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={processingPayment}>
                    {processingPayment
                      ? "Processing Payment..."
                      : "Complete Purchase"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
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
                    <span className="font-medium">{credit.projectName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credit Type:</span>
                    <span className="font-medium">{credit.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{quantity} tons CO₂</span>
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
                      0x{Math.random().toString(16).slice(2, 10)}...
                      {Math.random().toString(16).slice(2, 10)}
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
