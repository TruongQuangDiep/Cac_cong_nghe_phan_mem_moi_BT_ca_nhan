import Product from "../models/product.js";

export const getProductsService = async (query) => {
    try {
        let filter = {};

        // 1. SEARCH & CATEGORY
        if (query.search) filter.name = { $regex: query.search, $options: "i" };
        if (query.category) filter.category = query.category;

        // 2. LỌC KHOẢNG GIÁ
        if (query.minPrice || query.maxPrice) {
            filter.price = {};
            if (query.minPrice) filter.price.$gte = Number(query.minPrice);
            if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
        }

        // 3. SẮP XẾP (Thêm Most Viewed)
        let sortBy = { createdAt: -1 }; 
        if (query.sort === 'price_asc') sortBy = { price: 1 };
        if (query.sort === 'price_desc') sortBy = { price: -1 };
        if (query.sort === 'oldest') sortBy = { createdAt: 1 };
        if (query.sort === 'bestseller') sortBy = { sold: -1 };
        if (query.sort === 'most_viewed') sortBy = { views: -1 }; // 🔥 Thêm sắp xếp theo views

        // 4. PHÂN TRANG & GIỚI HẠN (PAGINATION & LIMIT)
        // Nếu API có truyền limit thì lấy đúng số limit đó (dùng cho Top 10), nếu không thì mặc định 12 sản phẩm/trang
        const limit = query.limit ? parseInt(query.limit) : 12; 
        const page = query.page ? parseInt(query.page) : 1;
        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
            .populate("category")
            .sort(sortBy)
            .skip(skip)   // Bỏ qua các sản phẩm của trang trước
            .limit(limit); // Lấy đúng số lượng của trang hiện tại

        // Đếm tổng số sản phẩm thỏa mãn điều kiện để Frontend biết đường vẽ mấy cái nút trang 1, 2, 3...
        const total = await Product.countDocuments(filter);

        // 🔥 TRẢ VỀ DẠNG OBJECT CÓ CHỨA THÔNG TIN PHÂN TRANG
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

// ================= GET DETAIL =================
export const getProductDetailService = async (id) => {
    try {
        // 🔥 ĐÃ SỬA: Thêm .populate("category") vào cuối lệnh findById
        const product = await Product.findById(id).populate("category");

        return product;
    } catch (error) {
        console.log(error);
        return null;
    }
};

// ================= CREATE =================
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

// ================= UPDATE =================
export const updateProductService = async (id, data) => {
    try {
        // 🔥 ĐÃ SỬA: Thêm .populate("category") vào sau hàm findByIdAndUpdate để khi update xong nó trả về data kèm danh mục mới luôn
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

// ================= DELETE =================
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