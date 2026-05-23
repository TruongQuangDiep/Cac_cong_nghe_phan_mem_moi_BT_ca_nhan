import Product from "../models/product.js";

export const getProductsService = async (query) => {
    try {
        let filter = {};

        if (query.search) filter.name = { $regex: query.search, $options: "i" };
        if (query.category) filter.category = query.category;

        if (query.minPrice || query.maxPrice) {
            filter.price = {};

            if (query.minPrice && query.minPrice !== "null" && query.minPrice !== "undefined" && query.minPrice !== "") {
                const min = Number(query.minPrice);
                if (!isNaN(min)) filter.price.$gte = min;
            }
            
            if (query.maxPrice && query.maxPrice !== "null" && query.maxPrice !== "undefined" && query.maxPrice !== "") {
                const max = Number(query.maxPrice);
                if (!isNaN(max)) filter.price.$lte = max;
            }

            if (Object.keys(filter.price).length === 0) {
                delete filter.price;
            }
        }

        let sortBy = { createdAt: -1 }; 
        if (query.sort === 'price_asc') sortBy = { price: 1 };
        if (query.sort === 'price_desc') sortBy = { price: -1 };
        if (query.sort === 'oldest') sortBy = { createdAt: 1 };
        if (query.sort === 'bestseller') sortBy = { sold: -1 };
        if (query.sort === 'most_viewed') sortBy = { views: -1 }; 

        const limit = query.limit ? parseInt(query.limit) : 12; 
        const page = query.page ? parseInt(query.page) : 1;
        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
            .populate("category")
            .sort(sortBy)
            .skip(skip)  
            .limit(limit);

        const total = await Product.countDocuments(filter);

        return {
            data: products,
            totalItems: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        };

    } catch (error) {
        console.log(error);
        return { data: [], totalItems: 0, currentPage: 1, totalPages: 1 };
    }
};

export const getProductDetailService = async (id) => {
    try {

        const product = await Product.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } }, 
            { new: true } 
        ).populate("category");

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
            { 
                returnDocument: 'after', 
                runValidators: true      
            }
        ).populate("category");

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