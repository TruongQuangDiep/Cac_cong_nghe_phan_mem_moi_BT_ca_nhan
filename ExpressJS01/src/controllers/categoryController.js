import {
    getCategoriesService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService
}
from "../services/categoryService.js";

// ================= GET =================
export const getCategories = async (req, res) => {

    const data =
        await getCategoriesService();

    return res.status(200).json(data);
};

// ================= CREATE =================
export const createCategory = async (req, res) => {

    try {

        const response =
            await createCategoryService(req.body);

        return res.status(200).json(response);

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            errCode: -1,
            message: "Server error"
        });
    }
};

// ================= UPDATE =================
export const updateCategory = async (req, res) => {

    try {

        const response =
            await updateCategoryService(
                req.params.id,
                req.body
            );

        return res.status(200).json(response);

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            errCode: -1,
            message: "Server error"
        });
    }
};

// ================= DELETE =================
export const deleteCategory = async (req, res) => {

    try {

        const response =
            await deleteCategoryService(
                req.params.id
            );

        return res.status(200).json(response);

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            errCode: -1,
            message: "Server error"
        });
    }
};