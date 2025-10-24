import httpService from "./httpService";

export const addToWishlist = (productId: any) => {
  return httpService.post("/wishlist/add", { product_id: productId });
};

export const removeFromWishlist = (productId: any) => {
  return httpService.delete("/wishlist/remove", productId);
};
