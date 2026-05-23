import express from "express";

import auth from "../middleware/auth.js";

import { addToCart, getCart, updateCartItem, removeCartItem } from "../controllers/cartController.js";

const routerCart = express.Router();

routerCart.post("/cart/add", auth, addToCart);
routerCart.get("/cart", auth, getCart);
routerCart.put("/cart/update", auth, updateCartItem);
routerCart.post("/cart/remove", auth, removeCartItem);

export default routerCart;