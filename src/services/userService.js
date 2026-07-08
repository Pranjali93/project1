import api from "./api";

export const createUser = async (data) => {
  const response = await api.post("/user/createUser", data);
  return response.data;
};


export const getAllUsers = async (
  search = "",
  start = "0",
  limit = "10"
) => {
  const response = await api.post("/user/getAllUsers", {
    search,
    start,
    limit,
  });

  return response.data;
};


export const getUserById = async (id) => {
  const response = await api.get(`/user/getUserById/${id}`);
  return response.data;
};


export const updateUserById = async (id, data) => {
  const response = await api.put(`/user/updateUserById/${id}`, data);
  return response.data;
};


export const deleteUserById = async (id) => {
  const response = await api.delete(`/contactus/deleteContactUsById/${id}`);
  return response.data;
};