import axios from "axios";

// 1. Tạo instance với URL từ file .env (Điệp đang dùng port 8088)
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

// 2. Request Interceptor: Tự động "dán" Token vào Header trước khi gửi đi
instance.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 3. Response Interceptor: Chỉ lấy phần dữ liệu cần thiết (data), bỏ qua mấy thứ rườm rà của Axios
instance.interceptors.response.use(function (response) {
    if (response && response.data) return response.data;
    return response;
}, function (error) {
    if (
            error?.response?.status === 401
        ) {

            localStorage.removeItem(
                "access_token"
            );

            window.location.href = "/login";
        }

        if (
            error &&
            error.response &&
            error.response.data
        ) {
            return error.response.data;
        }

        return Promise.reject(error);
});

export default instance;