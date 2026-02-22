import axiosInstance from "./httpService";

export const placeOrder = async (orderData: any) => {
  const response = await axiosInstance.post("/order", orderData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await axiosInstance.get("/order/my");
  return response.data;
};

export const getOrderDetails = async (orderId: string) => {
  const response = await axiosInstance.get(`/order/${orderId}`);
  return response.data;
};

export const verifyPayment = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}) => {
  const response = await axiosInstance.post("/payment/verify", data);
  return response.data;
};

export const handlePaymentFailure = async (orderId: string) => {
  const response = await axiosInstance.post("/payment/failure", { orderId });
  return response.data;
};

export const downloadInvoice = async (orderId: string) => {
  const response = await axiosInstance.get(`/order/${orderId}/invoice`, {
    responseType: "blob",
  });
  return response.data;
};
