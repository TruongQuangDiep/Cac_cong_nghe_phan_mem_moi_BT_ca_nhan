import { useEffect, useState, useMemo } from "react";
import { Table, Tag, Button, Spin, Empty, Popconfirm, notification } from "antd";
import { CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { getOrderHistoryApi, cancelOrderApi } from "../util/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrderHistory = async () => {
        const res = await getOrderHistoryApi();
        if (res && res.errCode === 0) {
            setOrders(res.data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    const handleCancelOrder = async (orderId) => {
        const res = await cancelOrderApi(orderId);
        if (res && res.errCode === 0) {
            notification.success({ message: res.message || "Xử lý đơn hàng thành công!", placement: "topRight" });
            fetchOrderHistory();
        } else {
            notification.error({ message: res?.message || "Hủy đơn hàng thất bại!" });
        }
    };

    const renderStatusTag = (status) => {
        switch (status) {
            case "NEW": return <Tag color="blue" className="text-sm px-2.5 py-0.5">Đơn hàng mới</Tag>;
            case "CONFIRMED": return <Tag color="cyan" className="text-sm px-2.5 py-0.5">Đã xác nhận</Tag>;
            case "PREPARING": return <Tag color="orange" className="text-sm px-2.5 py-0.5">Shop đang chuẩn bị hàng</Tag>;
            case "DELIVERING": return <Tag color="purple" className="text-sm px-2.5 py-0.5">Đang giao hàng</Tag>;
            case "DELIVERED": return <Tag color="green" className="text-sm px-2.5 py-0.5">Đã giao thành công</Tag>;
            case "CANCELLED": return <Tag color="red" className="text-sm px-2.5 py-0.5">Đã hủy đơn</Tag>;
            case "REQ_CANCEL": return <Tag color="volcano" className="text-sm px-2.5 py-0.5">Chờ Shop duyệt hủy</Tag>;
            default: return <Tag color="default">{status}</Tag>;
        }
    };

    const expandedRowRender = (record) => {
        const itemColumns = [
            {
                title: "Hình ảnh",
                dataIndex: "productId",
                key: "image",
                render: (prod) => (
                    <img 
                        src={prod?.images?.[0] ? BACKEND_URL + prod.images[0] : ""} 
                        alt={prod?.name} 
                        className="w-12 h-12 object-cover rounded-lg border"
                    />
                )
            },
            {
                title: "Sản phẩm",
                dataIndex: "productId",
                key: "name",
                render: (prod) => <span className="font-semibold text-gray-700">{prod?.name || "Sản phẩm không khả dụng"}</span>
            },
            {
                title: "Số lượng",
                dataIndex: "quantity",
                key: "quantity",
                render: (qty) => <b>x{qty}</b>
            },
            {
                title: "Đơn giá",
                dataIndex: "price",
                key: "price",
                render: (price) => <span>{Number(price).toLocaleString()}đ</span>
            }
        ];
        return (
            <div className="bg-gray-50 p-4 rounded-xl border">
                <Table columns={itemColumns} dataSource={record.items || []} rowKey={(item) => item._id} pagination={false} />
            </div>
        );
    };

    const columns = useMemo(() => [
        { title: "Mã đơn hàng", dataIndex: "_id", key: "id", render: (id) => <b>...{id?.slice(-6)}</b> },
        {
            title: "Ngày đặt đơn",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => new Date(date).toLocaleString("vi-VN")
        },
        {
            title: "Tổng số tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price) => <span className="text-red-500 font-bold text-base">{Number(price).toLocaleString()}đ</span>
        },
        {
            title: "Trạng thái vận chuyển",
            dataIndex: "status",
            key: "status",
            render: (status) => renderStatusTag(status)
        },
        {
            title: "Thao tác hủy",
            key: "action",
            render: (_, record) => {

                const timeDiff = (Date.now() - new Date(record.createdAt).getTime()) / (1000 * 60);

                if (["CANCELLED", "DELIVERED", "DELIVERING", "REQ_CANCEL"].includes(record.status)) return null;

                if (timeDiff <= 30) {
                    return (
                        <Popconfirm
                            title="Xác nhận hủy đơn hàng?"
                            description="Hệ thống sẽ hủy trực tiếp đơn hàng này của bạn."
                            onConfirm={() => handleCancelOrder(record._id)}
                            okText="Hủy đơn"
                            cancelText="Đóng"
                            okButtonProps={{ danger: true }}
                        >
                            <Button danger type="primary" icon={<CloseCircleOutlined />}>
                                Hủy đơn hàng (Còn hạn)
                            </Button>
                        </Popconfirm>
                    );
                }

                if (record.status === "PREPARING") {
                    return (
                        <Popconfirm
                            title="Gửi yêu cầu hủy đơn?"
                            description="Đơn hàng đặt quá 30 phút, cần Shop xét duyệt chấp thuận hủy."
                            onConfirm={() => handleCancelOrder(record._id)}
                            okText="Gửi yêu cầu"
                            cancelText="Đóng"
                            okButtonProps={{ className: "bg-orange-500 text-white hover:bg-orange-600" }}
                        >
                            <Button type="default" className="border-orange-500 text-orange-500 hover:text-orange-600 hover:border-orange-600" icon={<ClockCircleOutlined />}>
                                Gửi yêu cầu hủy đơn
                            </Button>
                        </Popconfirm>
                    );
                }

                return <span className="text-gray-400 text-sm italic">Hết hạn hủy đơn (Quá 30 phút)</span>;
            }
        }
    ], [orders]);

    if (loading) return <div className="flex justify-center items-center h-[60vh]"><Spin size="large" /></div>;

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-10 min-h-screen mt-10">
            <h1 className="text-3xl font-bold mb-8">Lịch sử đặt hàng của bạn</h1>
            {orders.length > 0 ? (
                <Table 
                    dataSource={orders} 
                    columns={columns} 
                    rowKey={(record) => record._id} 
                    expandable={{ expandedRowRender }}
                />
            ) : (
                <div className="bg-white py-20 rounded-2xl shadow-sm flex flex-col justify-center items-center">
                    <Empty description={<span className="text-gray-400 text-lg">Bạn chưa từng đặt mua sản phẩm nào!</span>} />
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;