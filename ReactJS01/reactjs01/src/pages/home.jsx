import { useEffect, useState } from "react";
import { Pagination } from "antd"; 
import { getProductsApi } from "../util/api";
import ProductCard from "../components/product/ProductCard";
import ProductFilter from "../components/product/ProductFilter";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("");
    
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 12; 

    const [topSold, setTopSold] = useState([]);
    const [topViewed, setTopViewed] = useState([]);
    const [topSale, setTopSale] = useState([]);

    useEffect(() => {
        const fetchTopProducts = async () => {
            const soldRes = await getProductsApi("", "", "", "", "bestseller", 1, 10);
            setTopSold(soldRes?.data || []);

            const viewedRes = await getProductsApi("", "", "", "", "most_viewed", 1, 10);
            setTopViewed(viewedRes?.data || []);
        };
        fetchTopProducts();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await getProductsApi(search, category, minPrice, maxPrice, sort, page, limit);
            const currentProducts = res?.data || [];
            setProducts(currentProducts);
            setTotal(res?.totalItems || 0); 

            if (currentProducts.length > 0) {
                const discountItems = currentProducts.filter(p => p.oldPrice && Number(p.oldPrice) > Number(p.price));
                setTopSale(discountItems);
            }
        };
        fetchProducts();
    }, [search, category, minPrice, maxPrice, sort, page]);

    useEffect(() => { setPage(1); }, [search, category, minPrice, maxPrice, sort]);

    return (
        <div className="min-h-screen bg-gray-50 w-full pb-20">
            {/* HERO SECTION */}
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-black text-white py-16 w-full mb-10">
                <div className="max-w-screen-xl mx-auto px-4 text-center flex flex-col items-center justify-center">
                    <p className="uppercase tracking-[6px] text-xl md:text-2xl font-light mb-4 text-gray-300">Welcome to</p>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                        DShop Store
                    </h1>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                
                {/* ================= 🔥 NEW: SECTION KHUYẾN MÃI (ĐÁP ỨNG ĐỀ BÀI) ================= */}
                {topSale.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-red-600 flex items-center gap-3 animate-pulse">
                                💥 Siêu Ưu Đãi Khuyến Mãi
                            </h2>
                        </div>
                        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar">
                            {topSale.map((item) => (
                                <div key={`sale-${item._id}`} className="min-w-[280px] max-w-[280px] snap-start">
                                    <ProductCard
                                        product={{
                                            ...item,
                                            imageUrl: item.images?.[0] ? BACKEND_URL + item.images[0] : null
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ================= TOP 10 BÁN CHẠY ================= */}
                {topSold.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">🔥 Top Bán Chạy Nhất</h2>
                        </div>
                        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar">
                            {topSold.map((item) => (
                                <div key={`sold-${item._id}`} className="min-w-[280px] max-w-[280px] snap-start">
                                    <ProductCard
                                        product={{
                                            ...item,
                                            imageUrl: item.images?.[0] ? BACKEND_URL + item.images[0] : null
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ================= TOP 10 XEM NHIỀU ================= */}
                {topViewed.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">👁️ Sản Phẩm Xem Nhiều</h2>
                        </div>
                        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar">
                            {topViewed.map((item) => (
                                <div key={`view-${item._id}`} className="min-w-[280px] max-w-[280px] snap-start">
                                    <ProductCard
                                        product={{
                                            ...item,
                                            imageUrl: item.images?.[0] ? BACKEND_URL + item.images[0] : null
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ================= TẤT CẢ SẢN PHẨM & LỌC ================= */}
                <section id="all-products">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                            <h2 className="text-3xl font-bold text-gray-800">Tất Cả Sản Phẩm</h2>
                            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-semibold">
                                Có {total} sản phẩm
                            </div>
                        </div>
                        <ProductFilter
                            search={search} setSearch={setSearch}
                            category={category} setCategory={setCategory}
                            minPrice={minPrice} setMinPrice={setMinPrice}
                            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                            sort={sort} setSort={setSort}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
                        {products.map((item) => (
                            <ProductCard
                                key={item._id}
                                product={{
                                    ...item,
                                    imageUrl: item.images?.[0] ? BACKEND_URL + item.images[0] : null
                                }}
                            />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="bg-white rounded-3xl border border-gray-100 py-20 text-center">
                            <h2 className="text-2xl font-bold text-gray-600 mb-3">Không tìm thấy sản phẩm nào!</h2>
                            <p className="text-gray-400">Hãy thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm.</p>
                        </div>
                    )}

                    {total > 0 && (
                        <div className="flex justify-center mt-10">
                            <Pagination
                                current={page}
                                total={total}
                                pageSize={limit}
                                onChange={(newPage) => setPage(newPage)}
                                showSizeChanger={false}
                                size="large"
                            />
                        </div>
                    )}
                </section>
            </div>
            
            <style jsx="true">{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default HomePage;