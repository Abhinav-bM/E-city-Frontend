export  interface ProductList {
  title: string;
  sellingPrice: number;
  actualPrice: number;
  images: any;
  slug: string;
}

export interface ProductsFilter {
  page: number;
  page_size: number;
}
