"use client";

import type React from "react";

import { useState } from "react";
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

// Mock token data
const tokens = [
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "avax",
    name: "Avalanche",
    symbol: "AVAX",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "matic",
    name: "Polygon",
    symbol: "MATIC",
    image: "/placeholder.svg?height=200&width=200",
  },
];

export function MarketplaceSellModal() {
  const [open, setOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const handleTokenSelect = (value: string) => {
    setSelectedToken(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      token: selectedToken,
      quantity,
      price,
    });
    setOpen(false);
  };

  const selectedTokenData = tokens.find((token) => token.id === selectedToken);

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
                    {tokens.map((token) => (
                      <SelectItem key={token.id} value={token.id}>
                        {token.name} ({token.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  step="0.0001"
                  min="0"
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
                    alt={selectedTokenData.name}
                    width={150}
                    height={150}
                    className="mb-4 rounded-md"
                  />
                  <p className="text-lg font-medium">
                    {selectedTokenData.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTokenData.symbol}
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
