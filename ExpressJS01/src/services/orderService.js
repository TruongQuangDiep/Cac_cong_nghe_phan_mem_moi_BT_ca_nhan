import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

export const createOrderService = async (userId, shippingAddress, items, totalPrice) => {
    try {
        const newOrder = await Order.create({
            userId,
            shippingAddress,
            items,
            totalPrice,
            paymentMethod: 'COD',
            status: 'NEW'
        });

        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { 
                    stock: -item.quantity, 
                    sold: item.quantity    
                }
            });
        }

        await Cart.findOneAndDelete({ userId });

        return {
            errCode: 0,
            message: "Đặt hàng thành công!",
            order: newOrder
        };
    } catch (error) {
        console.log(error);
        return {
            errCode: -1,
            message: "Lỗi server khi tạo đơn hàng"
        };
    }
};

export const getOrderHistoryService = async (userId) => {
    try {
        const orders = await Order.find({ userId }).sort({ createdAt: -1 }).populate("items.productId");
        const now = Date.now();

        for (let order of orders) {
            if (order.status === "NEW") {
                const timeDiffInMinutes = (now - new Date(order.createdAt).getTime()) / (1000 * 60);
                if (timeDiffInMinutes > 30) {
                    order.status = "CONFIRMED";
                    await order.save(); 
                }
            }
        }
        return { errCode: 0, data: orders };
    } catch (error) {
        console.log(error);
        return { errCode: -1, message: "Lỗi lấy lịch sử đơn hàng" };
    }
};

export const cancelOrderService = async (orderId) => {
    try {
        const order = await Order.findById(orderId);
        if (!order) return { errCode: 1, message: "Không tìm thấy đơn hàng!" };

        if (["DELIVERED", "DELIVERING", "CANCELLED", "REQ_CANCEL"].includes(order.status)) {
            return { errCode: 1, message: "Trạng thái đơn hàng không cho phép hủy!" };
        }

        const timeDiffInMinutes = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60);

        if (timeDiffInMinutes <= 30) {
            order.status = "CANCELLED";
            await order.save();

            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: {
                        stock: item.quantity, 
                        sold: -item.quantity  
                    }
                });
            }
            return { errCode: 0, message: "Hệ thống đã hủy đơn trực tiếp và hoàn hàng vào kho thành công!" };
        }

        if (order.status === "NEW" || order.status === "PREPARING" || order.status === "CONFIRMED") {
            order.status = "REQ_CANCEL";
            await order.save();
            return { errCode: 0, message: "Đã gửi yêu cầu hủy đơn hàng thành công! Vui lòng chờ Shop xét duyệt." };
        }

        return { errCode: 1, message: "Đơn hàng đã quá hạn thời gian cho phép hủy!" };
    } catch (error) {
        console.log(error);
        return { errCode: -1, message: "Lỗi server xử lý hủy đơn" };
    }
};