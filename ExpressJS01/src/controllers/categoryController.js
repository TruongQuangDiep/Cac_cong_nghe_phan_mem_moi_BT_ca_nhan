import {
    getCategoriesService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService
}
from "../services/categoryService.js";

export const getCategories = async (req, res) => {

    const data =
        await getCategoriesService();

    return res.status(200).json(data);
};

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