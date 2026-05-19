import { Select, Input, InputNumber } from "antd"; // Import thêm InputNumber
import { useEffect, useState } from "react";
import { getCategoriesApi } from "../../util/api";

const ProductFilter = ({
    search,
    setSearch,
    category,
    setCategory,
    // 🔥 NHẬN THÊM CÁC PROPS MỚI TỪ HOMEPAGE TRUYỀN XUỐNG
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sort,
    setSort
}) => {
    const [categories, setCategories] = useState([]);

    // ================= LOAD CATEGORY =================
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategoriesApi();
                if (Array.isArray(res)) {
                    setCategories(res);
                } else if (Array.isArray(res?.data)) {
                    setCategories(res.data);
                } else {
                    setCategories([]);
                }
            } catch (err) {
                console.log(err);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    return (
        // Dùng Grid chia cột để giao diện gọn gàng trên mọi thiết bị
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            
            {/* 1. Ô TÌM KIẾM (Cho nó chiếm 2 cột trên màn hình lớn cho rộng rãi) */}
            <div className="lg:col-span-2 min-w-0">
                <Input
                    size="large"
                    placeholder="Search products by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg"
                    allowClear
                />
            </div>

            {/* 2. Ô LỌC DANH MỤC */}
            <div className="min-w-0">
                <Select
                    size="large"
                    placeholder="All Categories"
                    value={category || undefined} // AntD khuyên dùng undefined cho placeholder nếu ko có value
                    onChange={setCategory}
                    className="w-full"
                    allowClear
                >
                    {categories.map((item) => (
                        <Select.Option
                            key={item._id}
                            value={item._id} // 🔥 ĐÃ FIX LỖI: Chuyển từ item.name sang item._id
                        >
                            {item.name}
                        </Select.Option>
                    ))}
                </Select>
            </div>

            {/* 3. Ô LỌC KHOẢNG GIÁ (Min - Max) */}
            <div className="flex items-center gap-2 min-w-0">
                <InputNumber
                    size="large"
                    placeholder="Min ₫"
                    value={minPrice}
                    onChange={setMinPrice}
                    className="w-full rounded-lg"
                    min={0}
                    // Format có dấu phẩy cho dễ nhìn tiền tỷ
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
                <span className="text-gray-400 font-medium">-</span>
                <InputNumber
                    size="large"
                    placeholder="Max ₫"
                    value={maxPrice}
                    onChange={setMaxPrice}
                    className="w-full rounded-lg"
                    min={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
            </div>

            {/* 4. Ô SẮP XẾP (Sort) */}
            <div className="min-w-0">
                <Select
                    size="large"
                    placeholder="Sort by..."
                    value={sort || undefined}
                    onChange={setSort}
                    className="w-full"
                    allowClear
                >
                    <Select.Option value="createdAt_-1">Newest Arrivals</Select.Option>
                    <Select.Option value="oldest">Oldest Products</Select.Option>
                    <Select.Option value="price_asc">Price: Low to High</Select.Option>
                    <Select.Option value="price_desc">Price: High to Low</Select.Option>
                    <Select.Option value="bestseller">Best Sellers</Select.Option>
                </Select>
            </div>

        </div>
    );
};

export default ProductFilter;  