"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, TrendingDown, Leaf, ActivitySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import FootprintModal from "./FootprintModal";

const FootprintApp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"offset" | "purchase">(
    "offset"
  );
  const [selectedOffset, setSelectedOffset] = useState<any>(null);

  const openOffsetModal = () => {
    setModalAction("offset");
    setIsModalOpen(true);
  };

  const openPurchaseModal = (offset: any) => {
    setSelectedOffset(offset);
    setModalAction("purchase");
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Carbon Footprint Management</h2>
        <Button
          className="bg-karbon-600 hover:bg-karbon-700"
          onClick={openOffsetModal}
        >
          <Leaf className="mr-2 h-4 w-4" /> Offset My Emissions
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your Carbon Footprint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">5.2</div>
              <div className="ml-1 text-lg">tons CO₂e</div>
              <ActivitySquare className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Annual emissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Offset Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">2.8</div>
              <div className="ml-1 text-lg">tons CO₂e</div>
              <Leaf className="ml-auto h-5 w-5 text-ocean-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Credits you've purchased
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Emissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">2.4</div>
              <div className="ml-1 text-lg">tons CO₂e</div>
              <TrendingDown className="ml-auto h-5 w-5 text-karbon-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Remaining to offset
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emissions Breakdown</CardTitle>
            <CardDescription>Your carbon footprint by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: "Transportation", percentage: 35, amount: 1.82 },
                { category: "Home Energy", percentage: 28, amount: 1.46 },
                { category: "Food & Diet", percentage: 15, amount: 0.78 },
                { category: "Goods & Services", percentage: 12, amount: 0.62 },
                { category: "Other", percentage: 10, amount: 0.52 },
              ].map((emission, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {emission.category}
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">
                        {emission.amount} tons
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({emission.percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-karbon-600 h-2 rounded-full"
                      style={{ width: `${emission.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Offsets</CardTitle>
            <CardDescription>
              Carbon credits matched to your footprint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  name: "Reforestation Carbon Credits",
                  price: 12.5,
                  location: "Brazil",
                },
                {
                  id: 2,
                  name: "Solar Energy Carbon Credits",
                  price: 14.0,
                  location: "India",
                },
                {
                  id: 3,
                  name: "Wind Energy Carbon Credits",
                  price: 13.25,
                  location: "Denmark",
                },
              ].map((offset) => (
                <div
                  key={offset.id}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="rounded-full bg-ocean-100 dark:bg-ocean-800 p-2 mr-4">
                    <Leaf className="h-5 w-5 text-ocean-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{offset.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ${offset.price.toFixed(2)} per ton • {offset.location}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-ocean-600 hover:bg-ocean-700"
                    onClick={() => openPurchaseModal(offset)}
                  >
                    Purchase
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Offset Options
            </Button>
          </CardContent>
        </Card>
      </div>

      <FootprintModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        action={modalAction}
        offsetData={selectedOffset}
      />
    </div>
  );
};

export default FootprintApp;
