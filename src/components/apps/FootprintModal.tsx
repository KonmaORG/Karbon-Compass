// "use client";

// import { useState } from "react";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { CreditCard, Leaf, TrendingDown } from "lucide-react";

// import { useCardano } from "@/context/cardanoContext";
// import { CetMinter } from "@/lib/cardanoTx/emission";
// import { fromText } from "@lucid-evolution/lucid";

// type FootprintModalProps = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   action: "offset" | "purchase";
//   offsetData?: {
//     name: string;
//     price: number;
//     location: string;
//   };
// };

// const FootprintModal = ({
//   open,
//   onOpenChange,
//   action,
//   offsetData,
// }: FootprintModalProps) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [offsetAmount, setOffsetAmount] = useState(1);
//   const [walletConnection] = useCardano();
//   const [qty, setQty] = useState("0");

//   const handleComplete = () => {
//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       onOpenChange(false);
//       toast.success(
//         `${
//           action === "offset"
//             ? "Emissions offset successfully!"
//             : "Offset credits purchased!"
//         }`
//       );
//     }, 1500);
//   };

//   // async function handleMint() {
//   //   const result = await CetMinter(walletConnection, {
//   //     location: fromText("location"),
//   //     cet_qty: BigInt(parseInt(qty)),
//   //     time: 126935457738n,
//   //   });
//   //   console.log(result);
//   // }
//   async function handleMint() {
//     if (typeof window === "undefined") return; // Prevent server-side execution
//     const result = await CetMinter(walletConnection, {
//       location: fromText("location"),
//       cet_qty: BigInt(parseInt(qty)),
//       time: 126935457738n,
//     });
//     console.log(result);
//   }
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>
//             {action === "offset" ? (
//               <div className="flex items-center">
//                 <Leaf className="mr-2 h-5 w-5" />
//                 Offset Your Emissions
//               </div>
//             ) : (
//               <div className="flex items-center">
//                 <CreditCard className="mr-2 h-5 w-5" />
//                 Purchase Offset Credits
//               </div>
//             )}
//           </DialogTitle>
//           <DialogDescription>
//             {action === "offset"
//               ? "Neutralize your carbon footprint with verified carbon credits"
//               : "Purchase carbon credits to offset your emissions"}
//           </DialogDescription>
//         </DialogHeader>

//         {action === "offset" ? (
//           <div className="space-y-4">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Your Carbon Footprint
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <TrendingDown className="h-4 w-4 mr-2 text-karbon-600" />
//                     <span>Current Net Emissions</span>
//                   </div>
//                   <span className="font-bold">2.4 tons CO₂e</span>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="space-y-4">
//               <h3 className="text-sm font-medium">
//                 Recommended Offset Projects
//               </h3>
//               {[
//                 {
//                   name: "Reforestation in Brazil",
//                   price: 12.5,
//                   efficiency: "High",
//                 },
//                 {
//                   name: "Solar Farm in India",
//                   price: 10.75,
//                   efficiency: "Medium",
//                 },
//                 {
//                   name: "Wind Energy in Denmark",
//                   price: 15.25,
//                   efficiency: "High",
//                 },
//               ].map((project, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
//                 >
//                   <div>
//                     <div className="font-medium">{project.name}</div>
//                     <div className="text-sm text-muted-foreground">
//                       ${project.price} per ton • {project.efficiency} impact
//                     </div>
//                   </div>
//                   <Button size="sm" className="bg-ocean-600 hover:bg-ocean-700">
//                     Select
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : offsetData ? (
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Offset Project
//                 </p>
//                 <p>{offsetData.name}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Price
//                 </p>
//                 <p>${offsetData.price.toFixed(2)} per ton</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Location
//                 </p>
//                 <p>{offsetData.location}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Amount to Offset
//                 </p>
//                 <div className="flex items-center mt-1">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() =>
//                       setOffsetAmount(Math.max(1, offsetAmount - 1))
//                     }
//                   >
//                     -
//                   </Button>
//                   <span className="mx-3">{offsetAmount} tons</span>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setOffsetAmount(offsetAmount + 1)}
//                   >
//                     +
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             <div className="border rounded-md p-4">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-medium">Quantity</span>
//                 <span>{offsetAmount} tons CO₂e</span>
//               </div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-medium">Price per ton</span>
//                 <span>${offsetData.price.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-medium">Subtotal</span>
//                 <span>${(offsetData.price * offsetAmount).toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-medium">Processing fee</span>
//                 <span>
//                   ${(offsetData.price * offsetAmount * 0.03).toFixed(2)}
//                 </span>
//               </div>
//               <div className="border-t pt-2 flex justify-between items-center font-bold">
//                 <span>Total</span>
//                 <span>
//                   ${(offsetData.price * offsetAmount * 1.03).toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ) : null}

//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button
//             className="bg-ocean-600 hover:bg-ocean-700"
//             onClick={handleMint}
//             isLoading={isLoading}
//           >
//             Mint CET
//           </Button>
//           <Button
//             className="bg-ocean-600 hover:bg-ocean-700"
//             onClick={handleComplete}
//             isLoading={isLoading}
//           >
//             {action === "offset" ? "Offset Emissions" : "Complete Purchase"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default FootprintModal;

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Leaf, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input"; // Make sure to import Input component

import { useCardano } from "@/context/cardanoContext";
import { Burn, CetMinter } from "@/lib/cardanoTx/emission";
import { fromText } from "@lucid-evolution/lucid";

type FootprintModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "offset" | "purchase";
  offsetData?: {
    name: string;
    price: number;
    location: string;
  };
};

const FootprintModal = ({
  open,
  onOpenChange,
  action,
  offsetData,
}: FootprintModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [offsetAmount, setOffsetAmount] = useState(1);
  const [walletConnection] = useCardano();
  const [qty, setQty] = useState("0");
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);

  const handleComplete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      toast.success(
        `${
          action === "offset"
            ? "Emissions offset successfully!"
            : "Offset credits purchased!"
        }`
      );
    }, 1500);
  };

  async function handleMint() {
    try {
      setIsLoading(true);
      const result = await CetMinter(walletConnection, {
        location: fromText("location"),
        cet_qty: BigInt(parseInt(qty)),
        time: 126935457738n,
      });
      console.log(result);
      toast.success("CET minted successfully!");
      setIsMintModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to mint CET");
    } finally {
      setIsLoading(false);
    }
  }

  async function BurnClient() {
    const result = await Burn(walletConnection, BigInt(parseInt(qty)));
    console.log(result);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {action === "offset" ? (
                <div className="flex items-center">
                  <Leaf className="mr-2 h-5 w-5" />
                  Offset Your Emissions
                </div>
              ) : (
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Purchase Offset Credits
                </div>
              )}
            </DialogTitle>
            <DialogDescription>
              {action === "offset"
                ? "Neutralize your carbon footprint with verified carbon credits"
                : "Purchase carbon credits to offset your emissions"}
            </DialogDescription>
          </DialogHeader>

          {action === "offset" ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Your Carbon Footprint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingDown className="h-4 w-4 mr-2 text-karbon-600" />
                      <span>Current Net Emissions</span>
                    </div>
                    <span className="font-bold">2.4 tons CO₂e</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">
                  Recommended Offset Projects
                </h3>
                {[
                  {
                    name: "Reforestation in Brazil",
                    price: 12.5,
                    efficiency: "High",
                  },
                  {
                    name: "Solar Farm in India",
                    price: 10.75,
                    efficiency: "Medium",
                  },
                  {
                    name: "Wind Energy in Denmark",
                    price: 15.25,
                    efficiency: "High",
                  },
                ].map((project, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                  >
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ${project.price} per ton • {project.efficiency} impact
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-ocean-600 hover:bg-ocean-700"
                    >
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : offsetData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Offset Project
                  </p>
                  <p>{offsetData.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Price
                  </p>
                  <p>${offsetData.price.toFixed(2)} per ton</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Location
                  </p>
                  <p>{offsetData.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Amount to Offset
                  </p>
                  <div className="flex items-center mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setOffsetAmount(Math.max(1, offsetAmount - 1))
                      }
                    >
                      -
                    </Button>
                    <span className="mx-3">{offsetAmount} tons</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOffsetAmount(offsetAmount + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Quantity</span>
                  <span>{offsetAmount} tons CO₂e</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Price per ton</span>
                  <span>${offsetData.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Subtotal</span>
                  <span>${(offsetData.price * offsetAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Processing fee</span>
                  <span>
                    ${(offsetData.price * offsetAmount * 0.03).toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>
                    ${(offsetData.price * offsetAmount * 1.03).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="bg-ocean-600 hover:bg-ocean-700"
              onClick={() => setIsMintModalOpen(true)}
              disabled={isLoading}
            >
              Mint CET
            </Button>
            <Button
              className="bg-ocean-600 hover:bg-ocean-700"
              onClick={BurnClient}
              disabled={isLoading}
            >
              {/* {action === "offset" ? "Offset Emissions" : "Complete Purchase"} */}
              Offset Emission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Mint CET Modal */}
      <Dialog open={isMintModalOpen} onOpenChange={setIsMintModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Number of CET to Mint</DialogTitle>
            <DialogDescription>
              Enter the number of Carbon Emission Tokens (CET) you want to mint
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              min="0"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="Enter CET quantity"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMintModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-ocean-600 hover:bg-ocean-700"
              onClick={handleMint}
              disabled={isLoading || !qty || parseInt(qty) <= 0}
            >
              {isLoading ? "Minting..." : "Mint CET"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FootprintModal;
