import httpService from "./httpService";

export function addToCart(id, variantId, quantity) {
  return httpService.post("/cart/add", {
    baseProductId: id,
    variantId,
    quantity,
  });
}

export function removeFromCart(id) {
  return httpService.post("/cart/remove", { id });
}
