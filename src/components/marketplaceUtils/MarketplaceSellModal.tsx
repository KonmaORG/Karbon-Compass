"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import { useCardano } from "@/context/cardanoContext";
import { COTPOLICYID, NETWORK, PROVIDER } from "@/config";
import { Lucid } from "@lucid-evolution/lucid";
import { blockfrost } from "@/lib/blockfrost";
import clsx from "clsx";
import { Sell } from "@/lib/cardanoTx/marketplace";
import { toast } from "sonner";

// Mock token data

export default function MarketplaceSellModal() {
  const [walletConnection] = useCardano();
  const { wallet, address } = walletConnection;
  const [karbonTokens, setKarbonTokens] = useState<
    Record<string, number> | undefined
  >();
  const [tokenMetadata, setTokenMetadata] = useState<Record<string, any>>({});
  const [open, setOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const handleTokenSelect = (value: string) => {
    setSelectedToken(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToken) {
      toast.error("Please select a token");
      return;
    }
    try {
      const txHash = await Sell(
        walletConnection,
        Number(price),
        selectedToken,
        Number(quantity)
      );
      toast.success("Transaction submitted successfully");
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setOpen(false);
    }
  };

  const selectedTokenData = selectedToken ? tokenMetadata[selectedToken] : null;

  useEffect(() => {
    async function tokens() {
      console.log("tokens");
      if (!address || !wallet) return;
      try {
        const lucid = await Lucid(PROVIDER, NETWORK);
        lucid.selectWallet.fromAPI(await wallet.enable());
        const utxos = await lucid.wallet().getUtxos();
        const aggregateTokenQuantities = () => {
          const quantities: Record<string, number> = {};

          utxos.forEach((utxo) => {
            if (utxo.assets) {
              Object.entries(utxo.assets).forEach(([assetKey, quantity]) => {
                if (assetKey.startsWith(COTPOLICYID)) {
                  if (quantities[assetKey as keyof typeof quantities]) {
                    quantities[assetKey as keyof typeof quantities] +=
                      Number(quantity); // Add quantity if the token exists
                  } else {
                    quantities[assetKey as keyof typeof quantities] =
                      Number(quantity); // Initialize the token with its quantity
                  }
                }
              });
            }
          });
          setKarbonTokens(quantities);
          console.log(quantities);
        };
        aggregateTokenQuantities();
      } catch (error: any) {
        console.log("error", error);
      }
    }
    tokens();
  }, [address]);

  async function fetchMetadata(token: string) {
    const result = await blockfrost.getMetadata(token);
    return result;
  }
  useEffect(() => {
    async function loadMetadata() {
      if (!karbonTokens) return;
      const metadata: Record<string, any> = {};

      for (const tokenId of Object.keys(karbonTokens)) {
        try {
          const result = await fetchMetadata(tokenId);
          metadata[tokenId] = result;
        } catch (error) {
          console.error(`Error fetching metadata for ${tokenId}:`, error);
          metadata[tokenId] = { hName: "Unknown Token" };
        }
      }

      setTokenMetadata(metadata);
    }

    if (Object.keys(karbonTokens || {}).length > 0) {
      loadMetadata();
    }
  }, [karbonTokens]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-karbon-600 hover:bg-karbon-700">
          <FileText className="mr-2 h-4 w-4" /> List Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Token Transaction</DialogTitle>
          <DialogDescription>
            Select a token and enter the quantity and price for your
            transaction.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Select Token</Label>
                <Select
                  onValueChange={handleTokenSelect}
                  value={selectedToken || undefined}
                >
                  <SelectTrigger id="token">
                    <SelectValue placeholder="Select a token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectContent>
                      {!karbonTokens ? (
                        <SelectItem value="loading">
                          Loading... | check wallet connection
                        </SelectItem>
                      ) : Object.keys(karbonTokens).length > 0 ? (
                        Object.entries(karbonTokens).map(([key, amount]) => (
                          <SelectItem key={key} value={key}>
                            {tokenMetadata[key]?.hName ||
                              "token name not found"}{" "}
                            x{amount}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none">No tokens found</SelectItem>
                      )}
                    </SelectContent>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="quantity"
                  className="flex justify-between items-center"
                >
                  Quantity
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(String(karbonTokens?.[selectedToken || ""]))
                    }
                    className={clsx(
                      "text-sm hover:underline",
                      selectedToken && karbonTokens?.[selectedToken]
                        ? "text-blue-600"
                        : "text-muted-foreground"
                    )}
                    disabled={!selectedToken}
                  >
                    Max
                  </button>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  step="1"
                  min="0"
                  max={
                    selectedToken ? karbonTokens?.[selectedToken] : undefined
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-md border p-4",
                !selectedToken && "bg-muted"
              )}
            >
              {selectedTokenData ? (
                <>
                  <Image
                    src={selectedTokenData.image || "/placeholder.svg"}
                    alt={selectedTokenData.hName}
                    width={150}
                    height={150}
                    className="mb-4 rounded-md"
                  />
                  <p className="text-lg font-medium">
                    {selectedTokenData.hName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTokenData.category}
                  </p>
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>Select a token to display its image</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!selectedToken || !quantity || !price}
            >
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
