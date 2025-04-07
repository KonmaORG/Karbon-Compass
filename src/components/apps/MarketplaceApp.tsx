
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShoppingBag, TrendingUp, ArrowUpRight, CreditCard, Filter, ListPlus, Tag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MarketplaceModal from "./MarketplaceModal";

const MarketplaceApp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"buy" | "portfolio">("buy");
  const [selectedCredit, setSelectedCredit] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"buyer" | "seller">("buyer");
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [newListing, setNewListing] = useState({
    name: "",
    description: "",
    price: "",
    amount: "",
    projectType: "reforestation",
    validatorName: "Gold Standard"
  });

  // Mock user's registered projects that can be listed
  const registeredProjects = [
    { id: 'p1', name: "Amazon Rainforest Restoration", location: "Brazil", status: "verified", type: "Reforestation", availableCredits: 5000 },
    { id: 'p2', name: "Sustainable Wind Farm", location: "India", status: "verified", type: "Renewable Energy", availableCredits: 8000 },
    { id: 'p3', name: "Mangrove Conservation", location: "Indonesia", status: "pending", type: "Conservation", availableCredits: 3000 },
    { id: 'p4', name: "Solar Array Network", location: "Chile", status: "verified", type: "Renewable Energy", availableCredits: 7500 },
  ];

  // Mock active listings of the seller
  const sellerListings = [
    { id: 'l1', projectName: "Amazon Rainforest Restoration", price: 18.50, amountListed: 2000, amountSold: 500, createdAt: "2025-03-15" },
    { id: 'l2', name: "Solar Array Network", price: 16.25, amountListed: 5000, amountSold: 1200, createdAt: "2025-03-20" },
  ];

  const openBuyModal = (credit: any) => {
    setSelectedCredit(credit);
    setModalAction("buy");
    setIsModalOpen(true);
  };

  const openPortfolioModal = () => {
    setModalAction("portfolio");
    setIsModalOpen(true);
  };

  const handleCreateListing = () => {
    setListingModalOpen(true);
  };

  const handleListingModalSubmit = () => {
    // Here we would handle the actual listing submission
    // For now, just close the modal
    setListingModalOpen(false);
    
    // Reset form
    setNewListing({
      name: "",
      description: "",
      price: "",
      amount: "",
      projectType: "reforestation",
      validatorName: "Gold Standard"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Carbon Credit Marketplace</h2>
        <div className="flex space-x-3">
          <Button 
            className="bg-ocean-600 hover:bg-ocean-700"
            onClick={openPortfolioModal}
          >
            <CreditCard className="mr-2 h-4 w-4" /> My Portfolio
          </Button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="buyer" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "buyer" | "seller")}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="buyer">Buyer View</TabsTrigger>
          <TabsTrigger value="seller">Seller View</TabsTrigger>
        </TabsList>
        
        {/* Buyer Tab Content */}
        <TabsContent value="buyer">
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <Input placeholder="Search marketplace..." className="max-w-xs" />
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Available Credits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline">
                    <div className="text-3xl font-bold">18,245</div>
                    <div className="ml-1 text-lg">tCO₂e</div>
                    <ShoppingBag className="ml-auto h-5 w-5 text-ocean-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline">
                    <div className="text-3xl font-bold">$12.35</div>
                    <div className="ml-1 text-sm">per tCO₂e</div>
                    <TrendingUp className="ml-auto h-5 w-5 text-karbon-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Trading Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline">
                    <div className="text-3xl font-bold">$1.2M</div>
                    <ArrowUpRight className="ml-auto h-5 w-5 text-karbon-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Featured Carbon Credits</CardTitle>
                <CardDescription>Popular credits available for purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: 1, name: "Reforestation Project #1", price: 10.50, location: "Brazil", type: "Reforestation" },
                    { id: 2, name: "Solar Energy Project #1", price: 11.25, location: "India", type: "Renewable Energy" },
                    { id: 3, name: "Reforestation Project #2", price: 12.00, location: "Brazil", type: "Reforestation" },
                    { id: 4, name: "Solar Energy Project #2", price: 12.75, location: "India", type: "Renewable Energy" },
                    { id: 5, name: "Reforestation Project #3", price: 13.50, location: "Brazil", type: "Reforestation" },
                    { id: 6, name: "Solar Energy Project #3", price: 14.25, location: "India", type: "Renewable Energy" }
                  ].map((credit) => (
                    <Card key={credit.id} className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{credit.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {credit.location} • Verified by {credit.id % 3 === 0 ? 'Gold Standard' : 'Verra'}
                            </CardDescription>
                          </div>
                          <div className="rounded-full bg-ocean-100 dark:bg-ocean-800 p-1">
                            <ShoppingBag className="h-4 w-4 text-ocean-600" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-end mt-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Price</div>
                            <div className="text-lg font-bold">${credit.price.toFixed(2)}</div>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-ocean-600 hover:bg-ocean-700"
                            onClick={() => openBuyModal(credit)}
                          >
                            Buy Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Seller Tab Content */}
        <TabsContent value="seller">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">My Carbon Projects</h3>
              <Button 
                onClick={handleCreateListing}
                className="bg-karbon-600 hover:bg-karbon-700"
              >
                <ListPlus className="mr-2 h-4 w-4" /> List New Credits
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Registered Projects</CardTitle>
                <CardDescription>Your verified carbon projects eligible for listing</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Available Credits</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registeredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{project.location}</TableCell>
                        <TableCell>{project.type}</TableCell>
                        <TableCell>
                          <Badge variant={project.status === "verified" ? "success" : "secondary"}>
                            {project.status === "verified" ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>{project.availableCredits.toLocaleString()} tCO₂e</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant={project.status === "verified" ? "default" : "outline"}
                            disabled={project.status !== "verified"}
                            className={project.status === "verified" ? "bg-karbon-600 hover:bg-karbon-700" : ""}
                            onClick={() => {
                              if (project.status === "verified") {
                                setNewListing({
                                  ...newListing,
                                  name: project.name
                                });
                                handleCreateListing();
                              }
                            }}
                          >
                            {project.status === "verified" ? "List Credits" : "Awaiting Verification"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>My Active Listings</CardTitle>
                <CardDescription>Credits currently available on the marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                {sellerListings.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Listed Price</TableHead>
                        <TableHead>Credits Listed</TableHead>
                        <TableHead>Credits Sold</TableHead>
                        <TableHead>Listed Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sellerListings.map((listing) => (
                        <TableRow key={listing.id}>
                          <TableCell className="font-medium">{listing.projectName || listing.name}</TableCell>
                          <TableCell>${listing.price.toFixed(2)} per tCO₂e</TableCell>
                          <TableCell>{listing.amountListed.toLocaleString()} tCO₂e</TableCell>
                          <TableCell>{listing.amountSold.toLocaleString()} tCO₂e</TableCell>
                          <TableCell>{listing.createdAt}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                              <Button size="sm" variant="destructive">
                                Delist
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Tag className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-lg font-medium mb-1">No active listings</p>
                    <p className="text-sm">Start selling carbon credits by listing your verified projects</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Original Buyer Marketplace Modal */}
      <MarketplaceModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        action={modalAction}
        creditData={selectedCredit}
      />
      
      {/* New Listing Dialog */}
      <Dialog open={listingModalOpen} onOpenChange={setListingModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>List Carbon Credits</DialogTitle>
            <DialogDescription>
              Create a new listing to sell your verified carbon credits on the marketplace.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-name" className="text-right">
                Project
              </Label>
              <Select value={newListing.name} onValueChange={(value) => setNewListing({...newListing, name: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {registeredProjects
                    .filter(project => project.status === "verified")
                    .map(project => (
                      <SelectItem key={project.id} value={project.name}>{project.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea 
                id="description" 
                placeholder="Describe your carbon credits and their environmental impact" 
                className="col-span-3"
                value={newListing.description}
                onChange={(e) => setNewListing({...newListing, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount (tCO₂e)
              </Label>
              <Input 
                id="amount" 
                placeholder="Amount of carbon credits to list" 
                className="col-span-3"
                type="number"
                value={newListing.amount}
                onChange={(e) => setNewListing({...newListing, amount: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (USD per tCO₂e)
              </Label>
              <Input 
                id="price" 
                placeholder="Price per carbon credit" 
                className="col-span-3"
                type="number"
                min="0"
                step="0.01"
                value={newListing.price}
                onChange={(e) => setNewListing({...newListing, price: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="validator" className="text-right">
                Validator
              </Label>
              <Select 
                value={newListing.validatorName}
                onValueChange={(value) => setNewListing({...newListing, validatorName: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select validator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gold Standard">Gold Standard</SelectItem>
                  <SelectItem value="Verra">Verra</SelectItem>
                  <SelectItem value="Climate Action Reserve">Climate Action Reserve</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setListingModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-karbon-600 hover:bg-karbon-700"
              onClick={handleListingModalSubmit}
            >
              <Tag className="mr-2 h-4 w-4" />
              List Carbon Credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketplaceApp;
