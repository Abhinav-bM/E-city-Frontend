import { API_ENDPOINT } from "./config";

/**
 * Fetches a single product by its slug using native fetch.
 * Optimized for Server Components with ISR.
 */
export const fetchProduct = async (slug: string) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/product/${slug}`, {
      next: { revalidate: 180 },
    });
    if (!response.ok) return null;
    const resData = await response.json();
    return resData.data;
  } catch (error) {
    console.error(`Error fetching product [${slug}]:`, error);
    return null;
  }
};

/**
 * Fetches popular products with a given limit.
 * Optimized for Server Components with ISR.
 */
export const fetchPopularProducts = async (limit: number) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/product?limit=${limit}`, {
      next: { revalidate: 180 },
    });
    if (!response.ok) return [];
    const resData = await response.json();
    return resData.data?.products || [];
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return [];
  }
};
