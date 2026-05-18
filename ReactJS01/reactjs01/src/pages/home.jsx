import { useEffect, useState } from "react";
import { getProductsApi } from "../util/api";
import ProductCard from "../components/product/ProductCard";
import ProductFilter from "../components/product/ProductFilter";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const HomePage = () => {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {

        const fetchProducts = async () => {

            const res =
                await getProductsApi(
                    search,
                    category
                );

            setProducts(res || []);
        };

        fetchProducts();

    }, [search, category]);

    return (

        <div className="min-h-screen bg-gray-100">

            {/* HERO */}
            <div
                className="
                    bg-gradient-to-r
                    from-indigo-600
                    via-purple-600
                    to-pink-500
                    text-white
                    py-16
                    px-8
                    sm:px-10
                    lg:px-24
                "
            >

                <div className="max-w-screen-2xl mx-auto text-center flex flex-col items-center justify-center">

                    <p className="uppercase tracking-[4px] text-sm mb-3 text-gray-200">
                        Welcome to
                    </p>

                    <h1
                        className="
                            text-5xl
                            md:text-6xl
                            font-extrabold
                            mb-4
                        "
                    >
                        Ecommerce Store
                    </h1>

                    <p
                        className="
                            text-lg
                            text-gray-100
                            max-w-2xl
                        "
                    >
                        Discover trending fashion,
                        gaming gear, electronics,
                        accessories and more with
                        modern UI experience.
                    </p>

                </div>

            </div>

            {/* CONTENT */}
            <div className="max-w-screen-2xl mx-auto px-8 sm:px-10 lg:px-24 py-10">

                {/* FILTER */}
                <div
                    className="
                        bg-white
                        rounded-3xl
                        shadow-lg
                        p-6
                        mb-16
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            mb-6
                            flex-wrap
                            gap-4
                        "
                    >

                        <div className="min-w-0">

                            <h2
                                className="
                                    text-3xl
                                    font-bold
                                    text-gray-800
                                "
                            >
                                Products
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Explore our newest collections
                            </p>

                        </div>

                        <div
                            className="
                                bg-indigo-100
                                text-indigo-700
                                px-4
                                py-2
                                rounded-full
                                font-semibold
                                min-w-0
                            "
                        >
                            {products.length} products
                        </div>

                    </div>

                    <ProductFilter
                        search={search}
                        setSearch={setSearch}
                        category={category}
                        setCategory={setCategory}
                    />

                </div>

                {/* PRODUCT GRID */}
                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-4
                        gap-12
                        pt-6
                    "
                >

                    {products.map((item) => (

                        <ProductCard
                            key={item._id}
                            product={{
                                ...item,
                                imageUrl: item.images?.[0]
                                    ? BACKEND_URL + item.images[0]
                                    : null
                            }}
                        />

                    ))}

                </div>

                {/* EMPTY */}
                {products.length === 0 && (

                    <div
                        className="
                            bg-white
                            rounded-3xl
                            shadow-md
                            py-20
                            mt-10
                            text-center
                        "
                    >

                        <h2
                            className="
                                text-3xl
                                font-bold
                                text-gray-700
                                mb-3
                            "
                        >
                            No Products Found
                        </h2>

                        <p className="text-gray-500">
                            Try another keyword or category.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default HomePage;