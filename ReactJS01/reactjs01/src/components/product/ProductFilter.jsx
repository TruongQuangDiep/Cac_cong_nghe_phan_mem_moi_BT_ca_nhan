import {
    Select,
    Input
}
from "antd";

import {
    useEffect,
    useState
}
from "react";

import {
    getCategoriesApi
}
from "../../util/api";

const ProductFilter = ({
    search,
    setSearch,
    category,
    setCategory
}) => {

    const [categories, setCategories] =
        useState([]);

    // ================= LOAD CATEGORY =================
    useEffect(() => {

        const fetchCategories = async () => {

            try {

                const res =
                    await getCategoriesApi();

                // fix lỗi map
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

        <div className="mb-12 flex gap-2.5 items-center">

            <div className="flex-1 min-w-0">
                <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="w-full"
                />
            </div>

            <div className="min-w-0">
                <Select
                    placeholder="Category"
                    value={category}
                    onChange={setCategory}
                    className="w-[220px] min-w-0"
                    allowClear
                >

                {categories.map((item) => (

                    <Select.Option
                        key={item._id}
                        value={item.name}
                    >
                        {item.name}
                    </Select.Option>

                ))}

                </Select>
            </div>

        </div>
    );
};

export default ProductFilter;