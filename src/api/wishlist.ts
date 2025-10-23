import httpService from "./httpService";

export const addToWishlist = (productId) => {
  console.log("aproduct id : ", productId)
  return httpService.post("/wishlist/add", { product_id: productId });
};

export const removeFromWishlist = (productId) => {
  return httpService.delete("/wishlist/remove", { product_id: productId });
};
