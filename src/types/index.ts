export interface Image {
  url: string;
  _id?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  parent?: string;
  description?: string;
}

export interface BaseProduct {
  _id: string;
  baseProductId: string;
  title: string;
  slug: string;
  description: string;
  images: Image[];
  brand: string;
  category: string | Category;
  condition: string;
  isNewArrival?: boolean;
}

export interface Variant {
  _id: string;
  variantId: string;
  baseProductId: string | BaseProduct;
  attributes: Record<string, string>;
  price: number;
  sellingPrice: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  images: Image[];
  inventoryType: "Quantity" | "Unique";
  condition: string;
}

export interface CartItem {
  _id: string;
  productVariantId: Variant & {
    baseProductId: BaseProduct;
  };
  quantity: number;
  priceAtAdd: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}
