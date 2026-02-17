import httpService from "./httpService";

export function getCart() {
  return httpService.get("/cart");
}

export function addToCart(id: any, variantId: any, quantity: any) {
  return httpService.post("/cart/add", {
    baseProductId: id,
    variantId,
    quantity,
  });
}

export function updateCartItem(variantId: any, quantity: any) {
  return httpService.put("/cart/update", {
    variantId,
    quantity,
  });
}

export function removeFromCart(variantId: any) {
  return httpService.delete("/cart/remove", { data: { variantId } });
}

export function clearCart() {
  return httpService.delete("/cart/clear");
}
