import axios from "axios";
import { UserProfile } from "../interface";
const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

export const newUser = async (data: UserProfile) => {
  const userData =  await axios.post(`${API_URL}/new-user`, { data }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return userData;
};

export const getUsers = async (data: UserProfile = {}) => {
  const docData = await axios.get(`${API_URL}/`, {
    params: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return docData;
};

export const getUser = async (id: string = ""): Promise<UserProfile[][]> => {
  const response = await axios.get<UserProfile[][]>(`${API_URL}/user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateUser = async (id: string = "", data: UserProfile) => {
  const res =  await axios.put(`${API_URL}/update/user/${id}`, { data }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export const deleteUser = async (id: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API_URL}/delete/user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};