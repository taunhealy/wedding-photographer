import { WorkItem, WorkCategory } from "@prisma/client";

// Type for portfolio items based on the WorkItem model
export type PortfolioItemType = WorkItem;

// Type for portfolio categories based on the WorkCategory model
export type PortfolioCategoryType = WorkCategory;

// Type for portfolio item with category information
export type PortfolioItemWithCategory = WorkItem & {
  category: WorkCategory;
};

// Function to fetch portfolio items
export async function getPortfolioItems(): Promise<PortfolioItemType[]> {
  // Implement your data fetching logic here
  // This is a placeholder
  return [];
}

// Function to fetch a single portfolio item by ID
export async function getPortfolioItemById(
  id: string
): Promise<PortfolioItemType | null> {
  // Implement your data fetching logic here
  // This is a placeholder
  return null;
}
