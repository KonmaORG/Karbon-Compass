"use client";

import { CardanoWallet } from "@/types/cardano/cardano";
import React, { useEffect, useState } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { toast } from "sonner";
import { Lucid } from "@lucid-evolution/lucid";
import { NETWORK, PROVIDER } from "@/config";
import { useCardano } from "@/context/cardanoContext";
import { WalletType, UserRole } from "./DashboardHeader";

interface CardanoWalletConnectorProps {
  setIsConnecting: React.Dispatch<React.SetStateAction<boolean>>;
  setWalletAddress: React.Dispatch<React.SetStateAction<string>>;
  setWalletType: React.Dispatch<React.SetStateAction<WalletType>>;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
  isConnecting: boolean;
}
export default function CardanoWalletConnector({
  setIsConnecting,
  setWalletAddress,
  setWalletType,
  setIsConnected,
  setUserRole,
  isConnecting,
}: CardanoWalletConnectorProps) {
  // STATE VARIABLES
  const [cardanoWallets, setCardanoWallets] = useState<CardanoWallet[]>([]);
  const [walletConnection, setWalletConnection] = useCardano();
  useEffect(() => {
    const installedWallets: CardanoWallet[] = [];
    const { cardano } = window;

    for (const c in cardano) {
      const wallet = cardano[c];

      if (!wallet.apiVersion) continue;
      installedWallets.push(wallet);
    }
    const updatedWallets = installedWallets.map((provider) => ({
      name: provider.name,
      enable: provider.enable,
      icon: provider.icon,
    }));
    setCardanoWallets(
      updatedWallets.sort((a, b) => a.name.localeCompare(b.name))
    );
  }, []);

  const connectWallet = async (wallet: CardanoWallet) => {
    setIsConnecting(true);
    try {
      const api = await wallet.enable();
      const lucid = await Lucid(PROVIDER, NETWORK);
      lucid.selectWallet.fromAPI(api);
      const address = await lucid.wallet().address();
      const balance = parseInt(await api.getBalance());
      setWalletConnection((prev: any) => {
        return { ...prev, wallet, address, balance };
      });
      setWalletAddress(address);
      setWalletType(wallet.name as WalletType);
      setIsConnected(true);
      setUserRole("user"); // Default role for Cardano wallets
      toast.success(`Wallet connected: ${wallet.name} on Cardano`);
    } catch (error) {
      toast.error("Failed to connect wallet");
      console.error("Wallet connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };
  return (
    <>
      {cardanoWallets === null ? (
        <DropdownMenuItem disabled>Loading wallets...</DropdownMenuItem>
      ) : cardanoWallets.length > 0 ? (
        cardanoWallets.map((wallet) => (
          <DropdownMenuItem
            key={wallet.name}
            disabled={isConnecting}
            onClick={() => connectWallet(wallet)}
          >
            {wallet.name}
          </DropdownMenuItem>
        ))
      ) : (
        <DropdownMenuItem disabled>No wallets detected</DropdownMenuItem>
      )}
    </>
  );
}
