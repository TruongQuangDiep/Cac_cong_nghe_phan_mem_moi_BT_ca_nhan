import { useEffect, useState } from "react";
import { Table, Button, notification, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import { getProductsApi, deleteProductApi } from "../util/api";

const AdminProductPage = () => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        const res = await getProductsApi();
        setProducts(res?.data || []);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        const res = await deleteProductApi(id);
        if (res?.errCode === 0) {
            notification.success({ message: "Deleted" });
            fetchProducts();
        } else {
            notification.error({ message: "Delete failed" });
        }
    };

    const columns = [
        { title: "Name", dataIndex: "name" },
        { 
            title: "Price", 
            dataIndex: "price",

            render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
        },
        { 
            title: "Category", 
            dataIndex: "category",

            render: (category) => category?.name || <span className="text-gray-400 italic">Trống</span>
        },
        {
            title: "Action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Link to={`/admin/products/edit/${record._id}`}>
                        <Button type="primary">Edit</Button>
                    </Link>
                    <Popconfirm
                        title="Delete?"
                        onConfirm={() => handleDelete(record._id)}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-5 min-w-0">
                <h1 className="text-2xl font-bold">Admin Products</h1>
                <Link to="/admin/products/create">
                    <Button type="primary">Create</Button>
                </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <Table
                    dataSource={products}
                    columns={columns}
                    rowKey="_id"
                    pagination={false}
                    scroll={{ x: 'max-content' }} 
                />
            </div>
        </div>
    );
};

export default AdminProductPage;