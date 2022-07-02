import axios, { AxiosInstance } from "axios";

export let axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://webbackend.cdsc.com.np/api/meroShare/",
  timeout: 2000,
  headers: {
    "Content-Type": "application/json",
    Origin: "https://meroshare.cdsc.com.np",
  },
});

export const createAuthAxiosInstance = (token: string) => {
  return axios.create({
    baseURL: "https://webbackend.cdsc.com.np/api/meroShare/",
    timeout: 2000,
    headers: {
      "Content-Type": "application/json",
      Origin: "https://meroshare.cdsc.com.np",
      Authorization: token,
    },
  });
};
