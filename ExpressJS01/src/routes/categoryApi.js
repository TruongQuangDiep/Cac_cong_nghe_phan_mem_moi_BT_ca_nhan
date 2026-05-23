import express from "express";

import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
}
from "../controllers/categoryController.js";

const routerCategory = express.Router();

routerCategory.get(
    "/categories",
    getCategories
);

routerCategory.post(
    "/categories",
    auth,
    admin,
    createCategory
);

routerCategory.put(
    "/categories/:id",
    auth,
    admin,
    updateCategory
);

routerCategory.delete(
    "/categories/:id",
    auth,
    admin,
    deleteCategory
);

export default routerCategory;