import Cart from "../models/cart.js";

export const addToCartService = async (userId, productId, quantity) => {
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [{ productId, quantity }]
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId.toString()
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
            await cart.save();
        }

        return {
            errCode: 0,
            message: "Thêm vào giỏ hàng thành công",
            cart
        };
    } catch (error) {
        console.log(error);
        return {
            errCode: -1,
            message: "Lỗi server thêm giỏ hàng"
        };
    }
};

export const getCartService = async (userId) => {
    try {
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        
        return {
            errCode: 0,
            data: cart
        };
    } catch (error) {
        console.log(error);
        return {
            errCode: -1,
            message: "Lỗi server lấy giỏ hàng"
        };
    }
};