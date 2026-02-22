import axiosInstance from "./httpService";

// Request a return for an order
export const requestReturn = async (data: {
  orderId: string;
  items: {
    productVariantId: string;
    inventoryUnitId?: string;
    title: string;
    quantity: number;
    priceAtOrder: number;
    reason: string;
    details?: string;
  }[];
}) => {
  const response = await axiosInstance.post("/return/request", data);
  return response.data;
};

// Get user's return requests
export const getMyReturns = async () => {
  const response = await axiosInstance.get("/return/my");
  return response.data;
};
