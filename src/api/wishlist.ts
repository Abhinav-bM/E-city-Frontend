import axiosInstance from "./httpService";

// Add product to wishlist
export const addToWishlist = async (productId: string) => {
  const response = await axiosInstance.post("/wishlist/add", {
    product_id: productId,
  });
  return response.data;
};

// Remove product from wishlist
export const removeFromWishlist = async (productId: string) => {
  const response = await axiosInstance.delete("/wishlist/remove", {
    data: { product_id: productId },
  });
  return response.data;
};

// Get user wishlist
export const getWishlist = async () => {
  const response = await axiosInstance.get("/wishlist");
  return response.data;
};
