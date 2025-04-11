export interface CreditListing {
  id: string;
  projectName: string;
  projectId: string;
  type: string;
  vintage: string;
  quantity: number;
  pricePerUnit: number;
  status: "Available" | "Pending" | "Sold";
  seller: string;
  certification: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  totalSupply?: number;
  availableSupply?: number;
  issuanceDate?: string;
  expiryDate?: string;
}

export interface PurchaseFormData {
  creditId: string;
  quantity: number;
  totalPrice: number;
  buyerWallet?: string;
  paymentMethod: "crypto" | "fiat";
  agreeTos: boolean;
}

export const creditListings: CreditListing[] = [
  {
    id: "1",
    projectName: "Amazonian Forest Restoration",
    projectId: "1",
    type: "Reforestation",
    vintage: "2022",
    quantity: 5000,
    pricePerUnit: 12,
    status: "Available",
    seller: "Eco Ventures",
    certification: "Verified Carbon Standard",
  },
  {
    id: "2",
    projectName: "Solar Farm Initiative",
    projectId: "2",
    type: "Renewable Energy",
    vintage: "2023",
    quantity: 3500,
    pricePerUnit: 10,
    status: "Available",
    seller: "Green Energy Partners",
    certification: "Gold Standard",
  },
  {
    id: "3",
    projectName: "Coastal Mangrove Restoration",
    projectId: "3",
    type: "Conservation",
    vintage: "2022",
    quantity: 2000,
    pricePerUnit: 15,
    status: "Pending",
    seller: "Blue Carbon Initiative",
    certification: "Climate Action Reserve",
  },
  {
    id: "4",
    projectName: "Wind Farm Expansion",
    projectId: "4",
    type: "Renewable Energy",
    vintage: "2023",
    quantity: 6000,
    pricePerUnit: 11,
    status: "Available",
    seller: "Nordic Wind Ltd",
    certification: "Verified Carbon Standard",
  },
  {
    id: "5",
    projectName: "Methane Capture from Landfill",
    projectId: "5",
    type: "Methane Reduction",
    vintage: "2022",
    quantity: 2500,
    pricePerUnit: 9,
    status: "Available",
    seller: "CleanAir Solutions",
    certification: "American Carbon Registry",
  },
  {
    id: "6",
    projectName: "Sustainable Agroforestry",
    projectId: "6",
    type: "Agroforestry",
    vintage: "2023",
    quantity: 1000,
    pricePerUnit: 14,
    status: "Sold",
    seller: "African Land Trust",
    certification: "Climate, Community & Biodiversity",
  },
];
