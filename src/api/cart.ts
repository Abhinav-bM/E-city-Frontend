import httpService from "./httpService";

export function addToCart(id: any, variantId: any, quantity: any) {
  return httpService.post("/cart/add", {
    baseProductId: id,
    variantId,
    quantity,
  });
}

export function removeFromCart(id: any) {
  return httpService.post("/cart/remove", { id });
}
