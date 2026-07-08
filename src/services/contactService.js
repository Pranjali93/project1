import api from "./api";

export const createContact = async (data) => {
  const response = await api.post("/contactus/createContactUs", data);
  return response.data;
};


export const getAllContacts = async () => {
  const response = await api.post("/contactus/getAllContactUs", {
    search: "",
    start: "0",
    limit: "10",
  });

  return response.data;
};


export const getContactById = async (id) => {
  const response = await api.get(`/contactus/getContactUsById/${id}`);
  return response.data;
};

