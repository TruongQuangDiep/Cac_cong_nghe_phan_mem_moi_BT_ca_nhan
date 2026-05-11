import axios from './axios.customize';

export const registerUserApi = (fullName, email, password) => {
    const URL_API = "/api/auth/register";
    const data = { fullName, email, password };
    return axios.post(URL_API, data);
}

export const loginApi = (email, password) => {
    const URL_API = "/api/auth/login";
    const data = { email, password };
    return axios.post(URL_API, data);
}

export const getUserApi = () => {
    const URL_API = "/api/auth/user/profile";
    return axios.get(URL_API);
}

export const createProductApi = (formData) => {
    return axios.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export const updateProductApi = (id, formData) => {
    return axios.put(`/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export const deleteProductApi = (id) => {
    return axios.delete(`/api/products/${id}`);
}