import axios from "./axios.customize";

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = { name, email, password };
    return axios.post(URL_API, data);
}

const verifyRegisterOtpApi = (email, otp) => {
    return axios.post("/v1/api/verify-register-otp", { email, otp });
};

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = { email, password };
    return axios.post(URL_API, data);
}

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API);
}

const forgotPasswordApi = (email) => {
    return axios.post("/v1/api/forgot-password", {
        email
    });
};

const verifyOtpApi = (email, otp) => {
    return axios.post(
        "/v1/api/verify-forgot-password-otp",
        {
            email,
            otp
        }
    );
};

const resetPasswordApi = (
    email,
    newPassword
) => {
    return axios.post(
        "/v1/api/reset-password",
        {
            email,
            newPassword
        }
    );
};

const getProfileApi = () => {
    return axios.get("/v1/api/account");
};

const updateProfileApi = (
    name,
    avatarFile
) => {

    const formData = new FormData();

    formData.append(
        "name",
        name
    );

    if (avatarFile) {
        formData.append(
            "avatar",
            avatarFile
        );
    }

    return axios.put(
        "/v1/api/edit-profile",
        formData,
        {
            headers: {
                "Content-Type":
                "multipart/form-data",
            }
        }
    );
};

// 🔥 ĐÃ NÂNG CẤP: Thêm minPrice, maxPrice, sort vào URL API
const getProductsApi = (
    search = "",
    category = "",
    minPrice = "",
    maxPrice = "",
    sort = "",
    page = 1,
    limit = 12
) => {
    return axios.get(
        `/v1/api/products?search=${search}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`
    );
};

const getProductDetailApi = (id) => {

    return axios.get(
        `/v1/api/products/${id}`
    );
};

const createProductApi = (formData) => {
    return axios.post("/v1/api/products", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

const deleteProductApi = (id) => {
    return axios.delete(`/v1/api/products/${id}`);
};

const updateProductApi = (id, formData) => {
    return axios.put(`/v1/api/products/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

const getCategoriesApi = () => {
    return axios.get("/v1/api/categories");
};

const createCategoryApi = (data) => {
    return axios.post("/v1/api/categories", data);
};

const updateCategoryApi = (id, data) => {
    return axios.put(`/v1/api/categories/${id}`, data);
};

const deleteCategoryApi = (id) => {
    return axios.delete(`/v1/api/categories/${id}`);
};

const addToCartApi = (productId, quantity) => {
    return axios.post("/v1/api/cart/add", { productId, quantity });
};

const getCartApi = () => {
    return axios.get("/v1/api/cart");
};

const updateCartApi = (productId, quantity) => {
    return axios.put("/v1/api/cart/update", { productId, quantity });
};

const removeCartItemApi = (productId) => {
    return axios.post("/v1/api/cart/remove", { productId });
};

const createOrderApi = (orderData) => {
    return axios.post("/v1/api/order/create", orderData);
};

const getOrderHistoryApi = () => {
    return axios.get("/v1/api/order/history");
};
const cancelOrderApi = (orderId) => {
    return axios.post("/v1/api/order/cancel", { orderId });
};
const getAdminOrdersApi = () => {
    return axios.get("/v1/api/admin/orders");
};
const updateOrderStatusApi = (orderId, status) => {
    return axios.put("/v1/api/admin/order/update-status", { orderId, status });
};

export {
    createUserApi,
    loginApi,
    verifyRegisterOtpApi,
    getUserApi,
    deleteProductApi,
    updateProductApi,
    forgotPasswordApi,
    verifyOtpApi,
    resetPasswordApi,
    getProfileApi,
    updateProfileApi,
    getProductsApi,
    getProductDetailApi,
    createProductApi,
    getCategoriesApi,
    createCategoryApi,
    updateCategoryApi,
    deleteCategoryApi,
    addToCartApi,
    getCartApi,
    updateCartApi,
    removeCartItemApi,
    createOrderApi,
    getOrderHistoryApi,
    cancelOrderApi,
    getAdminOrdersApi,
    updateOrderStatusApi
} 