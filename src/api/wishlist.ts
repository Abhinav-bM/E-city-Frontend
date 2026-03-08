import axiosInstance from "./httpService";

// Add product to wishlist
export const addToWishlist = async (variantId: string) => {
  const response = await axiosInstance.post("/wishlist/add", {
    variant_id: variantId,
  });
  return response.data;
};

// Remove product from wishlist
export const removeFromWishlist = async (variantId: string) => {
  const response = await axiosInstance.delete("/wishlist/remove", {
    data: { variant_id: variantId },
  });
  return response.data;
};

// Get user wishlist
export const getWishlist = async () => {
  const response = await axiosInstance.get("/wishlist");
  return response.data;
};
