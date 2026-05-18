import Product from "../models/product.js";

export const getProductsService = async (query) => {

    try {

        let filter = {};

        // SEARCH
        if (query.search) {

            filter.name = {
                $regex: query.search,
                $options: "i"
            };
        }

        // CATEGORY
        if (query.category) {

            filter.category = query.category;
        }

        const products = await Product.find(filter);

        return products;

    } catch (error) {

        console.log(error);

        return [];
    }
};

export const getProductDetailService = async (id) => {

    try {

        const product = await Product.findById(id);

        return product;

    } catch (error) {

        console.log(error);

        return null;
    }
};

export const createProductService = async (data) => {

    try {

        const product = await Product.create(data);

        return {
            errCode: 0,
            product
        };

    } catch (error) {

        console.log(error);

        return {
            errCode: -1,
            message: "Lỗi server"
        };
    }
};

export const updateProductService = async (id, data) => {

    try {

        const product = await Product.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        return {
            errCode: 0,
            product
        };

    } catch (err) {

        console.log(err);

        return {
            errCode: -1,
            message: "Lỗi update"
        };
    }
};

export const deleteProductService = async (id) => {

    try {

        await Product.findByIdAndDelete(id);

        return {
            errCode: 0,
            message: "Deleted"
        };

    } catch (err) {

        console.log(err);

        return {
            errCode: -1,
            message: "Lỗi delete"
        };
    }
};