import fs from "fs";
import path from "path";

import {
    createProductService,
    getProductDetailService,
    getProductsService,
    updateProductService,
    deleteProductService
}
from "../services/productService.js";

// ================= GET PRODUCTS =================
export const getProducts = async (req, res) => {

    const data = await getProductsService(req.query);

    return res.status(200).json(data);
};

// ================= GET DETAIL =================
export const getProductDetail = async (req, res) => {

    const data = await getProductDetailService(req.params.id);

    return res.status(200).json(data);
};

// ================= CREATE =================
export const createProduct = async (req, res) => {

    try {

        const data = req.body;

        if (req.files?.length > 0) {

            data.images = req.files.map(
                item => `/images/product/${item.filename}`
            );
        }

        const response =
            await createProductService(data);

        return res.status(200).json(response);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            errCode: -1,
            message: "Lỗi server"
        });
    }
};

// ================= UPDATE =================
export const updateProduct = async (req, res) => {

    try {

        const oldProduct =
            await getProductDetailService(req.params.id);

        let oldImages = [];

        if (req.body.oldImages) {

            oldImages =
                JSON.parse(req.body.oldImages);
        }

        let newImages = [];

        if (req.files?.length > 0) {

            newImages = req.files.map(
                item => `/images/product/${item.filename}`
            );
        }

        const finalImages = [
            ...oldImages,
            ...newImages
        ];

        // DELETE REMOVED IMAGE
        oldProduct.images?.forEach((img) => {

            if (!finalImages.includes(img)) {

                const filePath = path.join(
                    process.cwd(),
                    "src/public",
                    img
                );

                if (fs.existsSync(filePath)) {

                    fs.unlinkSync(filePath);
                }
            }
        });

        const data = {
            ...req.body,
            images: finalImages
        };

        delete data.oldImages;

        const response =
            await updateProductService(
                req.params.id,
                data
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
export const deleteProduct = async (req, res) => {

    try {

        const product =
            await getProductDetailService(req.params.id);

        // DELETE IMAGE FILE
        product.images?.forEach((img) => {

            const filePath = path.join(
                process.cwd(),
                "src/public",
                img
            );

            if (fs.existsSync(filePath)) {

                fs.unlinkSync(filePath);
            }
        });

        const response =
            await deleteProductService(req.params.id);

        return res.status(200).json(response);

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            errCode: -1,
            message: "Server error"
        });
    }
};