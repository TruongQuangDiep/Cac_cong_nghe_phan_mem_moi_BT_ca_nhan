import { addToCartService, getCartService } from "../services/cartService.js";
import User from "../models/user.js"; 

import Cart from "../models/cart.js";

export const addToCart = async (req, res) => {
    try {
        const userEmail = req.user.email; 
        
        const currentUser = await User.findOne({ email: userEmail });
        
        if (!currentUser) {
            return res.status(401).json({ errCode: -1, message: "Không tìm thấy thông tin người dùng!" });
        }

        const userId = currentUser._id; 

        const { productId, quantity } = req.body;
        const qty = parseInt(quantity) || 1;

        const result = await addToCartService(userId, productId, qty);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errCode: -1, message: "Lỗi controller add to cart" });
    }
};

export const getCart = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const currentUser = await User.findOne({ email: userEmail });

        if (!currentUser) {
            return res.status(401).json({ errCode: -1, message: "Không tìm thấy thông tin người dùng!" });
        }

        const userId = currentUser._id;

        const result = await getCartService(userId);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errCode: -1, message: "Lỗi controller get cart" });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const currentUser = await User.findOne({ email: req.user.email });
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ userId: currentUser._id });
        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity = quantity;
                await cart.save();
            }
        }
        return res.status(200).json({ errCode: 0, message: "Đã cập nhật số lượng" });
    } catch (error) {
        return res.status(500).json({ errCode: -1, message: "Lỗi server" });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const currentUser = await User.findOne({ email: req.user.email });
        const { productId } = req.body;

        const cart = await Cart.findOne({ userId: currentUser._id });
        if (cart) {
            // Lọc bỏ sản phẩm có ID trùng khớp
            cart.items = cart.items.filter(item => item.productId.toString() !== productId.toString());
            await cart.save();
        }
        return res.status(200).json({ errCode: 0, message: "Đã xóa sản phẩm" });
    } catch (error) {
        return res.status(500).json({ errCode: -1, message: "Lỗi server" });
    }
};