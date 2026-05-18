import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
    name: String,

    price: Number,

    oldPrice: Number,

    description: String,

    category: String,

    stock: Number,

    sold: {
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