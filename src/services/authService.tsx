import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email: string, password: string) => {
  const { data } = await axios.post(`${API_URL}/login`, { email, password });
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
};


export const register = async (email: string, password: string) => {
  await axios.post(`${API_URL}/register`, { email, password });
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => localStorage.getItem("token");

export const getUserInfo = () => JSON.parse(localStorage.getItem("user") || "[]");

export const getUserRole = () => JSON.parse(localStorage.getItem("user") || "[]")?.role;
