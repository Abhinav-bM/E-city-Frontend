import httpService from "./httpService";

export function getProducts(filter: any) {
  return httpService.get("/product/all", { params: filter });
}

export function getProduct(slug: string) {
  return httpService.get(`/product/${slug}`);
}
