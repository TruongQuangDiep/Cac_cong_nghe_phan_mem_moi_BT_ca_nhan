import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
    name: { type: String, required: true },
    price: { 
        type: Number, 
        required: true,
        min: [0, 'Giá sản phẩm không được là số âm!'] 
    },
    oldPrice: { 
        type: Number, 
        min: [0, 'Giá cũ không được là số âm!']
    },
    stock: { 
        type: Number, 
        required: true,
        min: [0, 'Số lượng kho không được âm!'] 
    },

    description: String,

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },

    sold: {
        type: Number,
        default: 0
    },

    views: {
        type: Number,
        default: 0
    },

    images: [String],

    isFeatured: Boolean,

    isNew: Boolean
},
{
    timestamps: true
}
);

const Product = mongoose.model(
    "Product",
    productSchema
);

export default Product;