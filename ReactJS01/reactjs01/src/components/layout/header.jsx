import { Link } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProductCard = ({ product }) => {
    const image = product?.images?.[0]
        ? `${BACKEND_URL}${product.images[0]}`
        : "https://via.placeholder.com/300";

    return (
        <Link
            to={`/product/${product._id}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 flex flex-col"
        >
            <div className="relative overflow-hidden">

                <img
                    alt={product.name}
                    src={image}
                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {
                    product.oldPrice > product.price && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            SALE
                        </div>
                    )
                }

            </div>
            
            <div className="p-4 flex flex-col flex-1">

                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[56px] group-hover:text-blue-600 transition">
                    {product.name}
                </h2>

                <div className="flex items-center gap-3 mt-3">

                    <span className="text-red-500 text-2xl font-bold">
                        {Number(product.price).toLocaleString()}đ
                    </span>

                    {
                        product.oldPrice && (
                            <span className="line-through text-gray-400 text-sm">
                                {Number(product.oldPrice).toLocaleString()}đ
                            </span>
                        )
                    }

                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-gray-500">

                    <span>
                        Sold: {product.sold || 0}
                    </span>

                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                        <ShoppingCartOutlined />
                    </div>

                </div>

            </div>

        </Link>
    );
};

export default ProductCard;