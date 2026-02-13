export interface Variant {
  variantId: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number;
  stock: number;
  condition: "New" | "Used" | "Open Box" | "Refurbished";
  inventoryType?: "Quantity" | "Unique";
  conditionGrade?: string; // e.g., "Grade A"
  conditionDescription?: string;
  images: string[];
  attributes: Record<string, string>;
}

export interface SpecificationItem {
  key: string;
  value: string;
}

export interface SpecificationGroup {
  group: string;
  items: SpecificationItem[];
}

export interface BaseProduct {
  baseProductId: string;
  title: string;
  description: string;
  specifications: SpecificationGroup[];
  variantAttributes: { name: string; values: string[] }[];
}

export interface ProductData {
  baseProduct: BaseProduct;
  currentVariant: Variant;
  availableVariants: Variant[];
  variantMetadata: any;
}
