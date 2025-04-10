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

interface CreditListingCardsProps {
  credits?: CreditListing[];
}

export function CreditListingCards({ credits }: CreditListingCardsProps) {
  return creditListings.map((credit) => (
    <Card key={credit.id} className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{credit.projectName}</CardTitle>
          <Badge
            variant="outline"
            className={
              credit.status === "Available"
                ? "bg-green-500/10 text-green-500 border-green-200"
                : credit.status === "Pending"
                ? "bg-yellow-500/10 text-yellow-500 border-yellow-200"
                : "bg-gray-500/10 text-gray-500 border-gray-200"
            }
          >
            {credit.status}
          </Badge>
        </div>
        <CardDescription className="flex items-center mt-1">
          <Info className="h-3 w-3 mr-1" />
          {credit.certification}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted rounded-md p-2">
            <div className="text-xs text-muted-foreground">Type</div>
            <div className="font-medium">{credit.type}</div>
          </div>
          <div className="bg-muted rounded-md p-2">
            <div className="text-xs text-muted-foreground">Vintage</div>
            <div className="font-medium">{credit.vintage}</div>
          </div>
          <div className="bg-muted rounded-md p-2">
            <div className="text-xs text-muted-foreground">Quantity</div>
            <div className="font-medium">
              {credit.quantity.toLocaleString()}
            </div>
          </div>
          <div className="bg-muted rounded-md p-2">
            <div className="text-xs text-muted-foreground">Price</div>
            <div className="font-medium">${credit.pricePerUnit}/ton</div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Seller: {credit.seller}
        </div>
      </CardContent>
      <CardFooter>
        {credit.status === "Available" ? (
          <CreditPurchaseModal
            credit={credit}
            trigger={
              <Button className="w-full">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Credits
              </Button>
            }
          />
        ) : credit.status === "Pending" ? (
          <Button className="w-full" variant="outline" disabled>
            <Clock className="h-4 w-4 mr-2" />
            Pending
          </Button>
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
