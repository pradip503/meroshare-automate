import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "https://webbackend.cdsc.com.np/api/meroShare/",
    timeout: 2000,
    headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://meroshare.cdsc.com.np'
    }
});

export const setAuthorization = async (token: string) => {
    axiosInstance.interceptors.request.use(
        config => {
            config.headers.Authorization = token;
            return config;
        },
        error => Promise.reject(error)
    )
}