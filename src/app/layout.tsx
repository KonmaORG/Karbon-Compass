// "use client";
import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import CardanoProvider from "@/context/cardanoProvider";
import { Metadata } from "next";

const queryClient = new QueryClient();
export const metadata: Metadata = {
  title: {
    default: "Karbon Compass",
    template: `%s - ${"Karbon Compass"}`,
  },
  description: "siteConfig.description",
  icons: {
    icon: "/favicon.ico",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CardanoProvider>
          {/* <QueryClientProvider client={queryClient}> */}
          <TooltipProvider>
            {/* <Toaster /> */}
            <Sonner position="top-right" />
            <Navbar />
            {children}
          </TooltipProvider>
          {/* </QueryClientProvider> */}
        </CardanoProvider>
      </body>
    </html>
  );
}
