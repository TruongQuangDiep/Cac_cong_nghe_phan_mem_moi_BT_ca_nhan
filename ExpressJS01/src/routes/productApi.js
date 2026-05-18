import express from "express";

import admin from "../middleware/admin.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

import {
    getProducts,
    getProductDetail,
    createProduct,
    deleteProduct,
    updateProduct
}
from "../controllers/productController.js";

const routerProduct = express.Router();

// PUBLIC APIs
routerProduct.get("/products", getProducts);

routerProduct.get("/products/:id", getProductDetail);

// ADMIN APIs
routerProduct.post(
    "/products",
    auth,
    admin,
    upload.array("images", 10),
    createProduct
);

routerProduct.put(
    "/products/:id",
    auth,
    admin,
    upload.array("images", 10),
    updateProduct
);

routerProduct.delete(
    "/products/:id",
    auth,
    admin,
    deleteProduct
);

export default routerProduct;