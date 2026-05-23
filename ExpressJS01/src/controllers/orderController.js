import { 
    createOrderService, 
    getOrderHistoryService, 
    cancelOrderService 
} from "../services/orderService.js";
import User from "../models/user.js"; 
import Order from "../models/order.js"; 

export const createOrder = async (req, res) => {
    try {
        const currentUser = await User.findOne({ email: req.user.email });
        const userId = currentUser._id;
        const { shippingAddress, items, totalPrice } = req.body;

        if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address) {
            return res.status(400).json({ errCode: 1, message: "Vui lòng điền đầy đủ thông tin giao hàng!" });
        }

        const result = await createOrderService(userId, shippingAddress, items, totalPrice);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ errCode: -1, message: "Lỗi controller order" });
    }
};

export const getAllOrdersAdmin = async (req, res) => {
    try {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        await Order.updateMany(
            { status: "NEW", createdAt: { $lte: thirtyMinutesAgo } },
            { status: "CONFIRMED" }
        );

        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("items.productId")
            .populate("userId", "name email");
            
        return res.status(200).json({ errCode: 0, data: orders });
    } catch (error) {
        return res.status(500).json({ errCode: -1, message: "Lỗi server" });
    }
};

export const updateOrderStatusAdmin = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        return res.status(200).json({ errCode: 0, message: "Cập nhật trạng thái thành công", data: order });
    } catch (error) {
        return res.status(500).json({ errCode: -1, message: "Lỗi server" });
    }
};

export const getUserOrderHistory = async (req, res) => {
    try {
        const currentUser = await User.findOne({ email: req.user.email });
        
        const result = await getOrderHistoryService(currentUser._id);
        
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ errCode: -1, message: "Lỗi server lịch sử đơn hàng" });
    }
};

export const cancelOrderUser = async (req, res) => {
    try {
        const { orderId } = req.body;

        const result = await cancelOrderService(orderId);
        
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errCode: -1, message: "Lỗi server khi hủy đơn" });
    }
};