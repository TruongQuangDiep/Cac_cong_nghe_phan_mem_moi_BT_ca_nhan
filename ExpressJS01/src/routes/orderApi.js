import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import { 
    createOrder, 
    getAllOrdersAdmin, 
    updateOrderStatusAdmin, 
    getUserOrderHistory, 
    cancelOrderUser 
} from "../controllers/orderController.js";

const routerOrder = express.Router();

routerOrder.post("/order/create", auth, createOrder);
routerOrder.get("/order/history", auth, getUserOrderHistory);
routerOrder.post("/order/cancel", auth, cancelOrderUser);
routerOrder.get("/admin/orders", auth, admin, getAllOrdersAdmin);
routerOrder.put("/admin/order/update-status", auth, admin, updateOrderStatusAdmin);

export default routerOrder;