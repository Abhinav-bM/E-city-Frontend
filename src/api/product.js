import httpService from "./httpService";

export function getProducts(filter) {
  return httpService.get("/product/products",{params : filter});
}

export function getProduct(id) {
  return httpService.get(`/product/${id}`);
}
