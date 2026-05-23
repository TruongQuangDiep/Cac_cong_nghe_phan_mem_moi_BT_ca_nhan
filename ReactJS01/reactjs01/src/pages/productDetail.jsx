import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCartOutlined, FireOutlined, CheckCircleOutlined, AppstoreOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Spin, notification, InputNumber } from "antd";
import { getProductDetailApi, addToCartApi, getProductsApi } from "../util/api";
import ProductSwiper from "../components/product/ProductSwiper";
import ProductCard from "../components/product/ProductCard";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const fetchedId = useRef(null);

    useEffect(() => {
        if (fetchedId.current === id) return;
        fetchedId.current = id;

        const fetchDetail = async () => {
            setLoading(true);
            const res = await getProductDetailApi(id);
            setProduct(res);

            if (res && res.category?._id) {
                const relatedRes = await getProductsApi("", res.category._id, "", "", "", 1, 4);
                const filtered = (relatedRes?.data || []).filter(item => item._id !== res._id);
                setRelatedProducts(filtered);
            }
            setLoading(false);
        };
        fetchDetail();
        setQuantity(1); 
    }, [id]);

    const handleAddToCart = async () => {
        try {
            const res = await addToCartApi(product?._id, quantity);
            if (res && res.errCode === 0) {
                notification.success({
                    message: "Thành công!",
                    description: `Đã thêm ${quantity} sản phẩm vào giỏ hàng.`,
                    placement: "topRight"
                });
            } else {
                notification.error({
                    message: "Thất bại",
                    description: res?.message || "Vui lòng đăng nhập để mua hàng!",
                    placement: "topRight"
                });
            }
        } catch (error) {
            notification.error({ message: "Lỗi", description: "Vui lòng đăng nhập để mua hàng!" });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto px-4 py-10 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl shadow-xl p-6 lg:p-10">
                {/* LEFT */}
                <div>
                    <ProductSwiper images={product.images} />
                </div>

                {/* RIGHT */}
                <div className="flex flex-col justify-center">
                    <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold mb-4 w-fit">
                        {product.category?.name}
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-4 mb-6 flex-wrap">
                        <span className="text-red-500 text-5xl font-bold">
                            {Number(product.price).toLocaleString()}đ
                        </span>
                        {product.oldPrice && (
                            <span className="line-through text-gray-400 text-2xl">
                                {Number(product.oldPrice).toLocaleString()}đ
                            </span>
                        )}
                    </div>

                    <div className="space-y-4 text-gray-700 text-lg mb-8">
                        <div className="flex items-center gap-3">
                            <CheckCircleOutlined className="text-green-500" />
                            <span>Stock: <b>{product.stock}</b></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FireOutlined className="text-orange-500" />
                            <span>Sold: <b>{product.sold || 0}</b></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <EyeOutlined className="text-blue-500" />
                            <span>Views: <b>{product.views || 0}</b></span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-lg font-semibold text-gray-700">Số lượng:</span>
                        <InputNumber
                            min={1}
                            max={product.stock}
                            value={quantity}
                            onChange={(value) => setQuantity(value)}
                            size="large"
                            className="w-24 text-lg font-bold"
                        />
                        <span className="text-gray-500">{product.stock} sản phẩm có sẵn</span>
                    </div>

                    <div className="flex gap-4 flex-wrap">
                        <Button
                            type="primary"
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            onClick={handleAddToCart}
                            className="!h-14 !px-10 !rounded-xl !text-lg !font-semibold"
                        >
                            Add To Cart
                        </Button>
                        <Button size="large" className="!h-14 !px-10 !rounded-xl !text-lg !font-semibold">
                            Buy Now
                        </Button>
                    </div>
                </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Product Description</h2>
                <p className="text-gray-600 leading-8 text-lg">{product.description}</p>
            </div>

            {/* ================= 🔥 NEW: SECTION SẢN PHẨM TƯƠNG TỰ (ĐÁP ỨNG ĐỀ BÀI) ================= */}
            {relatedProducts.length > 0 && (
                <div className="bg-white rounded-3xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                        <AppstoreOutlined className="text-blue-500" /> Sản Phẩm Tương Tự
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((item) => (
                            <ProductCard
                                key={`related-${item._id}`}
                                product={{
                                    ...item,
                                    imageUrl: item.images?.[0] ? BACKEND_URL + item.images[0] : null
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailPage;