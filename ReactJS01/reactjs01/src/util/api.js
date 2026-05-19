import axios from "./axios.customize";

// Hàm đăng ký người dùng mới
const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = { name, email, password };
    return axios.post(URL_API, data);
}

// Hàm đăng nhập
const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = { email, password };
    return axios.post(URL_API, data);
}

// Hàm lấy thông tin người dùng (Cần Token mới lấy được)
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

export {
    createUserApi,
    loginApi,
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
    deleteCategoryApi
}