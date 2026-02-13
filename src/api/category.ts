import httpService from "./httpService";

export function getCategories() {
  return httpService.get("/category");
}
