
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ShoppingCart, Wallet } from "lucide-react";

type MarketplaceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "buy" | "portfolio";
  creditData?: {
    name: string;
    price: number;
    location: string;
    type: string;
  };
};

const MarketplaceModal = ({ open, onOpenChange, action, creditData }: MarketplaceModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePurchase = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      toast.success(`${action === "buy" ? "Purchase successful!" : "Portfolio updated!"}`);
    }, 1500);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {action === "buy" ? (
              <div className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Purchase Carbon Credits
              </div>
            ) : (
              <div className="flex items-center">
                <Wallet className="mr-2 h-5 w-5" />
                Your Credit Portfolio
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            {action === "buy" 
              ? "Review and confirm your carbon credit purchase"
              : "Manage your carbon credit portfolio"
            }
          </DialogDescription>
        </DialogHeader>
        
        {action === "buy" && creditData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Credit Type</p>
                <p>{creditData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Price</p>
                <p>${creditData.price.toFixed(2)} per credit</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p>{creditData.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Project Type</p>
                <p>{creditData.type}</p>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Quantity</span>
                <span>10 credits</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Price per credit</span>
                <span>${creditData.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Subtotal</span>
                <span>${(creditData.price * 10).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Processing fee</span>
                <span>${(creditData.price * 0.03).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center font-bold">
                <span>Total</span>
                <span>${(creditData.price * 10 + creditData.price * 0.03).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : action === "portfolio" ? (
          <Tabs defaultValue="owned">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="owned">Owned</TabsTrigger>
              <TabsTrigger value="retired">Retired</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="owned">
              <div className="space-y-3">
                {[
                  { name: "Reforestation Project #1", quantity: 10, price: 12.35 },
                  { name: "Solar Energy Project #2", quantity: 5, price: 11.50 },
                  { name: "Wind Energy Project #3", quantity: 15, price: 10.25 },
                ].map((credit, i) => (
                  <Card key={i}>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">{credit.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="flex justify-between items-center text-sm">
                        <span>{credit.quantity} credits</span>
                        <span>${(credit.quantity * credit.price).toFixed(2)} value</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="retired">
              <div className="space-y-3">
                {[
                  { name: "Reforestation Project #4", quantity: 2, date: "2023-12-10" },
                ].map((credit, i) => (
                  <Card key={i}>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">{credit.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="flex justify-between items-center text-sm">
                        <span>{credit.quantity} credits</span>
                        <span>Retired on {credit.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="history">
              <div className="space-y-3">
                {[
                  { type: "Purchase", project: "Solar Energy Project #2", amount: 5, date: "2023-12-15" },
                  { type: "Retirement", project: "Reforestation Project #4", amount: 2, date: "2023-12-10" },
                  { type: "Purchase", project: "Reforestation Project #1", amount: 10, date: "2023-11-28" },
                ].map((transaction, i) => (
                  <div key={i} className="flex justify-between items-center p-2 border-b text-sm">
                    <div>
                      <div className="font-medium">{transaction.type}</div>
                      <div className="text-muted-foreground">{transaction.project}</div>
                    </div>
                    <div className="text-right">
                      <div>{transaction.amount} credits</div>
                      <div className="text-muted-foreground">{transaction.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : null}
        
        <DialogFooter>
          {action === "buy" ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-ocean-600 hover:bg-ocean-700"
                onClick={handlePurchase}
                isLoading={isLoading}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Complete Purchase
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarketplaceModal;
