import axios from "axios";
import { FormData } from "../interface";
const API_URL = "http://localhost:3001/api/docs";
const token = localStorage.getItem("token");

export const newDoc = async (data: FormData) => {
  const docData =  await axios.post(`${API_URL}/new-doc`, { data }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return docData;
};