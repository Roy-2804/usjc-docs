import axios from "axios";
import { FormData, FilterData } from "../interface";
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

export const getDocs = async (data: FilterData = {}) => {
  const docData = await axios.get(`${API_URL}/`, {
    params: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return docData;
};

export const getDoc = async (id: string = ""): Promise<FormData[][]> => {
  const response = await axios.get<FormData[][]>(`${API_URL}/node/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateDoc = async (id: string = "", data: FormData) => {
  const res =  await axios.put(`${API_URL}/update/node/${id}`, { data }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};