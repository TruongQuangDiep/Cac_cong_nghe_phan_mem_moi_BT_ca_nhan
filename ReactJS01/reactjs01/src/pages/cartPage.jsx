import { useEffect, useState } from "react";
import { Table, Button, Spin, Empty, InputNumber, notification, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { getCartApi, updateCartApi, removeCartItemApi } from "../util/api";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();
    const fetchCartData = async () => {
        const res = await getCartApi();
        if (res && res.errCode === 0 && res.data) {
            setCartItems(res.data.items || []);
        }
    };

    useEffect(() => {
        const initCart = async () => {
            setLoading(true);
            await fetchCartData();
            setLoading(false);
        };
        initCart();
    }, []);

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (!newQuantity || newQuantity < 1) return;

        const previousItems = cartItems;

        setCartItems(prevItems => 
            prevItems.map(item => 
                item.productId?._id === productId 
                    ? { ...item, quantity: newQuantity } 
                    : item
            )
        );

        try {
            const res = await updateCartApi(productId, newQuantity);
            
            if (!res || res.errCode !== 0) {
                notification.error({ message: "Không thể đồng bộ số lượng, vui lòng thử lại!" });
                setCartItems(previousItems);
                await fetchCartData(); 
            }
        } catch (error) {
            notification.error({ message: "Không thể đồng bộ số lượng, vui lòng thử lại!" });
            setCartItems(previousItems);
            await fetchCartData();
        }
    };

    const handleRemoveItem = async (productId) => {
        const res = await removeCartItemApi(productId);
        if (res && res.errCode === 0) {
            notification.success({ message: "Đã xóa khỏi giỏ hàng", placement: "topRight" });
            fetchCartData(); 
        } else {
            notification.error({ message: "Lỗi xóa sản phẩm" });
        }
    };

    const columns = [
        {
            title: "Sản phẩm",
            dataIndex: "productId",
            key: "product",
            render: (product) => (
                <div className="flex items-center gap-4">
                    <img 
                        src={product?.images?.[0] ? BACKEND_URL + product.images[0] : ""} 
                        alt={product?.name} 
                        className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <span className="font-semibold text-lg">{product?.name}</span>
                </div>
            )
        },
        {
            title: "Đơn giá",
            dataIndex: "productId",
            key: "price",
            render: (product) => (
                <span className="text-gray-600 font-medium">
                    {Number(product?.price).toLocaleString()}đ
                </span>
            )
        },
        {
            title: "Số lượng",
            key: "quantity",
            render: (_, record) => (
                <InputNumber
                    min={1}
                    max={record.productId?.stock}
                    value={record.quantity}
                    onChange={(value) => handleUpdateQuantity(record.productId?._id, value)}
                    size="large"
                    className="w-20 font-bold"
                />
            )
        },
        {
            title: "Thành tiền",
            key: "total",
            render: (_, record) => {
                const total = record.quantity * record.productId?.price;
                return (
                    <span className="text-red-500 font-bold text-lg">
                        {Number(total).toLocaleString()}đ
                    </span>
                );
            }
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <Popconfirm
                    title="Xóa sản phẩm"
                    description="Bạn có chắc muốn xóa sản phẩm này khỏi giỏ?"
                    onConfirm={() => handleRemoveItem(record.productId?._id)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                >
                    <Button danger type="text" icon={<DeleteOutlined className="text-xl" />} />
                </Popconfirm>
            )
        }
    ];

    if (loading) {
        return <div className="flex justify-center items-center h-[60vh]"><Spin size="large" /></div>;
    }

    const cartTotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.productId?.price), 0);

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-10 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

            {cartItems.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                        <Table 
                            dataSource={cartItems} 
                            columns={columns} 
                            rowKey={(record) => record._id}
                            pagination={false}
                        />
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                        <h2 className="text-xl font-bold mb-6 border-b pb-4">Tổng Giỏ Hàng</h2>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-600">Tổng cộng:</span>
                            <span className="text-3xl font-bold text-red-500">
                                {Number(cartTotal).toLocaleString()}đ
                            </span>
                        </div>
                        <Button 
                            type="primary" 
                            size="large" 
                            onClick={() => navigate("/checkout")}
                            className="w-full !h-14 !text-lg !font-bold !rounded-xl bg-blue-600 hover:!bg-blue-700 border-none"
                        >
                            Tiến hành Thanh toán
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="bg-white py-20 rounded-2xl shadow-sm flex flex-col justify-center items-center">
                    <Empty description={<span className="text-gray-400 text-lg">Giỏ hàng trống trơn!</span>} />
                    <Button type="primary" size="large" className="mt-4" href="/">
                        Tiếp tục mua sắm
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CartPage;