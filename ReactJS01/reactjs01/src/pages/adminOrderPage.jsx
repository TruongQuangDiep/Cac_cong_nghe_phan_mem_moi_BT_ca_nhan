import { useEffect, useState } from "react";
import { Table, Select, notification, Spin } from "antd";
import { getAdminOrdersApi, updateOrderStatusApi } from "../util/api"; 

const AdminOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        const res = await getAdminOrdersApi();
        if (res && res.errCode === 0) {
            setOrders(res.data || []);
        }
        setLoading(false);
    };

    useEffect(() => { 
        fetchOrders(); 
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        const res = await updateOrderStatusApi(orderId, newStatus);
        if (res && res.errCode === 0) {
            notification.success({ message: "Cập nhật trạng thái đơn hàng thành công!", placement: "topRight" });
            fetchOrders();
        } else {
            notification.error({ message: "Cập nhật trạng thái thất bại!" });
        }
    };

    const columns = [
        { title: "Mã Đơn", dataIndex: "_id", key: "id", render: (id) => <b>...{id?.slice(-6)}</b> },
        { title: "Khách hàng", dataIndex: "userId", key: "user", render: (user) => user?.name || "Khách hàng" },
        { title: "Tổng tiền", dataIndex: "totalPrice", key: "total", render: (price) => <span className="text-red-500 font-semibold">{Number(price).toLocaleString()}đ</span> },
        { title: "Địa chỉ nhận", dataIndex: "shippingAddress", key: "address", render: (ship) => `${ship?.name} (${ship?.phone}) - ${ship?.address}` },
        { 
            title: "Trạng thái", 
            dataIndex: "status", 
            key: "status",
            render: (status, record) => (
                <Select value={status} className="w-45" onChange={(value) => handleStatusChange(record._id, value)}>
                    <Select.Option value="NEW">1. Đơn hàng mới</Select.Option>
                    <Select.Option value="CONFIRMED">2. Đã xác nhận</Select.Option>
                    <Select.Option value="PREPARING">3. Đang chuẩn bị hàng</Select.Option>
                    <Select.Option value="DELIVERING">4. Đang giao hàng</Select.Option>
                    <Select.Option value="DELIVERED">5. Đã giao thành công</Select.Option>
                    <Select.Option value="CANCELLED">6. Hủy đơn hàng</Select.Option>
                    <Select.Option value="REQ_CANCEL">⚠️ Khách đòi hủy</Select.Option>
                </Select>
            )
        }
    ];

    if (loading) return <div className="flex justify-center items-center h-[60vh]"><Spin size="large" /></div>;

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-10 min-h-screen mt-10">
            <h1 className="text-3xl font-bold mb-8">Trang quản trị Đơn Hàng (Admin)</h1>
            <Table dataSource={orders} columns={columns} rowKey={(record) => record._id} />
        </div>
    );
};

export default AdminOrderPage;