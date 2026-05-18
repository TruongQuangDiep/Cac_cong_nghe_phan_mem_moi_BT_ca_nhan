import Category from "../models/category.js";

// ================= GET =================
export const getCategoriesService = async () => {

    try {

        const categories =
            await Category.find()
                .sort({ createdAt: -1 });

        return categories;

    } catch (err) {

        console.log(err);

        return [];
    }
};

// ================= CREATE =================
export const createCategoryService = async (data) => {

    try {

        const exist =
            await Category.findOne({
                name: data.name
            });

        if (exist) {
            return {
                errCode: 1,
                message: "Category already exists"
            };
        }

        const category =
            await Category.create(data);

        return {
            errCode: 0,
            category
        };

    } catch (err) {

        console.log(err);

        return {
            errCode: -1,
            message: "Server error"
        };
    }
};

// ================= UPDATE =================
export const updateCategoryService = async (
    id,
    data
) => {

    try {

        const category =
            await Category.findByIdAndUpdate(
                id,
                data,
                { new: true }
            );

        return {
            errCode: 0,
            category
        };

    } catch (err) {

        console.log(err);

        return {
            errCode: -1,
            message: "Server error"
        };
    }
};

// ================= DELETE =================
export const deleteCategoryService = async (id) => {

    try {

        await Category.findByIdAndDelete(id);

        return {
            errCode: 0,
            message: "Delete success"
        };

    } catch (err) {

        console.log(err);

        return {
            errCode: -1,
            message: "Server error"
        };
    }
};