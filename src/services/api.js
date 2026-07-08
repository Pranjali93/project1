import axios from "axios";

const api = axios.create({
  baseURL: "https://ioweb3.io/preferme", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;