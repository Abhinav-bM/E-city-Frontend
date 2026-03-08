export interface ProductCardProduct {
  baseProductId: string;
  variantId: string;
  title: string;
  slug: string;
  brand?: string;
  sellingPrice: number;
  actualPrice?: number;
  stock: number;
  condition?: string; // "New" | "Refurbished" | "Open Box" | "Used"
  conditionGrade?: string; // "Grade A", "Grade B", etc.
  inventoryType?: "Quantity" | "Unique";
  isNewArrival?: boolean;
  images: (string | { url: string })[];
  baseImages?: (string | { url: string })[];
  variants?: { images: (string | { url: string })[] }[];
  variantAttributes?: { name: string; values: string[] }[];
  attributes?: Record<string, string>;
}
