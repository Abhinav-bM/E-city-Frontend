import axiosInstance from "./httpService";

export const getProfile = async () => {
  const response = await axiosInstance.get("/profile");
  return response.data;
};

export const updateProfile = async (data: { name: string; email: string }) => {
  const response = await axiosInstance.put("/profile", data);
  return response.data;
};

export const addAddress = async (data: any) => {
  const response = await axiosInstance.post("/profile/address", data);
  return response.data;
};

export const updateAddress = async (addressId: string, data: any) => {
  const response = await axiosInstance.put(
    `/profile/address/${addressId}`,
    data,
  );
  return response.data;
};

export const removeAddress = async (addressId: string) => {
  const response = await axiosInstance.delete(`/profile/address/${addressId}`);
  return response.data;
};
