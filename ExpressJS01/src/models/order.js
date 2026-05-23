import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shippingAddress: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true } 
        }
    ],
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, default: 'COD' },
    status: {
        type: String,
        enum: ['NEW', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'],
        default: 'NEW'
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;