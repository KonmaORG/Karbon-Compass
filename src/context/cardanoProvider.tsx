// Wallet Provider to pass the wallet context
"use client";

import { useState } from "react";

import { Cardano, CardanoContext } from "@/context/cardanoContext";

export default function CardanoProvider(props: { children: React.ReactNode }) {
  return (
    <CardanoContext.Provider value={useState<Cardano>({ isEmulator: false })}>
      {props.children}
    </CardanoContext.Provider>
  );
}
