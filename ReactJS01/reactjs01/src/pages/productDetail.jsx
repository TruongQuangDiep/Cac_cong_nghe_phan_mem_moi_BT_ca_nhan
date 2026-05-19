import {
    useEffect,
    useState
}
from "react";

import {
    useParams
}
from "react-router-dom";

import {
    ShoppingCartOutlined,
    FireOutlined,
    CheckCircleOutlined
}
from "@ant-design/icons";

import {
    Button,
    Spin
}
from "antd";

import {
    getProductDetailApi
}
from "../util/api";

import ProductSwiper
from "../components/product/ProductSwiper";

const ProductDetailPage = () => {

    const { id } = useParams();

    const [product, setProduct] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const fetchDetail = async () => {

            setLoading(true);

            const res =
                await getProductDetailApi(id);

            setProduct(res);

            setLoading(false);
        };

        fetchDetail();

    }, [id]);

    if (loading) {

        return (

            <div
                className="
                    flex
                    justify-center
                    items-center
                    h-[70vh]
                "
            >
                <Spin size="large" />
            </div>
        );
    }

    return (

        <div
            className="
                max-w-screen-2xl
                mx-auto
                px-4
                py-10
            "
        >

            <div
                className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-10
                    bg-white
                    rounded-3xl
                    shadow-xl
                    p-6
                    lg:p-10
                "
            >

                {/* LEFT */}
                <div>

                    <ProductSwiper
                        images={product.images}
                    />

                </div>

                {/* RIGHT */}
                <div
                    className="
                        flex
                        flex-col
                        justify-center
                    "
                >

                    {/* CATEGORY */}
                    <div
                        className="
                            inline-block
                            bg-blue-100
                            text-blue-700
                            px-4
                            py-1
                            rounded-full
                            text-sm
                            font-semibold
                            mb-4
                            w-fit
                        "
                    >
                        {product.category?.name}
                    </div>

                    {/* NAME */}
                    <h1
                        className="
                            text-4xl
                            font-bold
                            text-gray-900
                            leading-tight
                            mb-6
                        "
                    >
                        {product.name}
                    </h1>

                    {/* PRICE */}
                    <div
                        className="
                            flex
                            items-center
                            gap-4
                            mb-6
                            flex-wrap
                        "
                    >

                        <span
                            className="
                                text-red-500
                                text-5xl
                                font-bold
                            "
                        >
                            {Number(product.price).toLocaleString()}đ
                        </span>

                        {
                            product.oldPrice && (
                                <span
                                    className="
                                        line-through
                                        text-gray-400
                                        text-2xl
                                    "
                                >
                                    {Number(product.oldPrice).toLocaleString()}đ
                                </span>
                            )
                        }

                    </div>

                    {/* INFO */}
                    <div
                        className="
                            space-y-4
                            text-gray-700
                            text-lg
                            mb-8
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <CheckCircleOutlined
                                className="text-green-500"
                            />

                            <span>
                                Stock:
                                {" "}
                                <b>{product.stock}</b>
                            </span>
                        </div>

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <FireOutlined
                                className="text-orange-500"
                            />

                            <span>
                                Sold:
                                {" "}
                                <b>{product.sold || 0}</b>
                            </span>
                        </div>

                    </div>

                    {/* BUTTON */}
                    <div
                        className="
                            flex
                            gap-4
                            flex-wrap
                        "
                    >

                        <Button
                            type="primary"
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            className="
                                !h-14
                                !px-10
                                !rounded-xl
                                !text-lg
                                !font-semibold
                            "
                        >
                            Add To Cart
                        </Button>

                        <Button
                            size="large"
                            className="
                                !h-14
                                !px-10
                                !rounded-xl
                                !text-lg
                                !font-semibold
                            "
                        >
                            Buy Now
                        </Button>

                    </div>

                </div>

            </div>

            {/* DESCRIPTION */}
            <div
                className="
                    bg-white
                    rounded-3xl
                    shadow-lg
                    p-8
                    mt-10
                "
            >

                <h2
                    className="
                        text-3xl
                        font-bold
                        mb-6
                        text-gray-900
                    "
                >
                    Product Description
                </h2>

                <p
                    className="
                        text-gray-600
                        leading-8
                        text-lg
                    "
                >
                    {product.description}
                </p>

            </div>

        </div>
    );
};

export default ProductDetailPage;