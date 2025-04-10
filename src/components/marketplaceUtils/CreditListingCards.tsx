"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Circle, Clock, Info, ShoppingCart } from "lucide-react";
import { CreditPurchaseModal } from "./CreditPurchaseModal";
import { CreditListing, creditListings } from "./types";
import { useCardano } from "@/context/cardanoContext";
import { useEffect, useState } from "react";
import { COTPOLICYID, KARBONSTOREADDR, NETWORK, PROVIDER } from "@/config";
import { Data, Lucid } from "@lucid-evolution/lucid";
import { blockfrost } from "@/lib/blockfrost";
import { KarbonStoreDatum } from "@/types/cardano/datum";
import { toAda } from "@/lib/utils";

interface CreditListingCardsProps {
  credits?: CreditListing[];
}

export function CreditListingCards() {
  const [balance, setBalance] = useState<
    { unit: string; quantity: number; datum: KarbonStoreDatum; metadata: any }[]
  >([]);

  useEffect(() => {
    async function fetchutxos() {
      try {
        const lucid = await Lucid(PROVIDER, NETWORK);

        const utxos = await lucid.utxosAt(KARBONSTOREADDR);

        utxos.map(async (utxo) => {
          const data = await lucid.datumOf(utxo);
          const datum = Data.castFrom(data, KarbonStoreDatum);

          Object.entries(utxo.assets).map(async ([assetKey, quantity]) => {
            if (assetKey.startsWith(COTPOLICYID)) {
              const metadata = await blockfrost.getMetadata(assetKey);
              setBalance((prev) => [
                ...prev,
                {
                  unit: assetKey,
                  quantity: Number(quantity),
                  datum: datum,
                  metadata: metadata,
                },
              ]);
            }
          });
        });
      } catch (error: any) {
        console.log("error", error);
      }
    }
    fetchutxos();
  }, []);

  return balance.map(({ unit, quantity, datum, metadata }, key) => (
    <Card key={key} className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{metadata.hName}</CardTitle>
          <Badge
            variant="outline"
            className={
              metadata?.status === "Available"
                ? "bg-green-500/10 text-green-500 border-green-200"
                : metadata?.status === "Pending"
                ? "bg-yellow-500/10 text-yellow-500 border-yellow-200"
                : "bg-gray-500/10 text-gray-500 border-gray-200"
            }
          >
            {"status"}
          </Badge>
        </div>
        <CardDescription className="flex items-center mt-1">
          <Info className="h-3 w-3 mr-1" />
          {"certification"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted rounded-md p-2">
            <div className="text-xs text-muted-foreground">Type</div>
            <div className="font-medium">{metadata?.category}</div>
          </div>
          <div className="bg-muted rounded-md p-2">
            <div className="text-xs text-muted-foreground">Vintage</div>
            <div className="font-medium">{"vintage"}</div>
          </div>
          <div className="bg-muted rounded-md p-2">
            <div className="text-xs text-muted-foreground">Quantity</div>
            <div className="font-medium">{quantity.toLocaleString()}</div>
          </div>
          <div className="bg-muted rounded-md p-2">
            <div className="text-xs text-muted-foreground">Price</div>
            <div className="font-medium">${toAda(datum.amount)}/ton</div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground truncate">
          Seller: {datum.owner}
        </div>
      </CardContent>
      <CardFooter>
        {quantity >= 0 ? (
          // <CreditPurchaseModal
          //   credit={credit}
          //   trigger={
          //     <Button className="w-full">
          //       <ShoppingCart className="h-4 w-4 mr-2" />
          //       Buy Credits
          //     </Button>
          //   }
          // />
          <>modal</>
        ) : (
          <Button className="w-full" variant="outline" disabled>
            <Circle className="h-4 w-4 mr-2" />
            Sold Out
          </Button>
        )}
      </CardFooter>
    </Card>
  ));
}
