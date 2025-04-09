"use client";
import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import CardanoProvider from "@/context/cardanoProvider";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CardanoProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              {/* <Toaster /> */}
              <Sonner />
              <Navbar />
              {children}
            </TooltipProvider>
          </QueryClientProvider>
        </CardanoProvider>
      </body>
    </html>
  );
}
