import { useEffect, useState } from "react";
import { Form, Input, Button, Card, Table, notification, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { getCartApi, createOrderApi } from "../util/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchCart = async () => {
            const res = await getCartApi();
            if (res && res.errCode === 0 && res.data) {
                setCartItems(res.data.items || []);
                if ((res.data.items || []).length === 0) {
                    notification.warning({ message: "Giỏ hàng trống, không thể thanh toán!" });
                    navigate("/cart");
                }
            }
            setLoading(false);
        };
        fetchCart();
    }, [navigate]);

    const cartTotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.productId?.price), 0);

    const onFinish = async (values) => {
        try {
            setSubmitting(true);

            const orderItems = cartItems.map(item => ({
                productId: item.productId?._id,
                quantity: item.quantity,
                price: item.productId?.price
            }));

            const orderData = {
                shippingAddress: {
                    name: values.name,
                    phone: values.phone,
                    address: values.address
                },
                items: orderItems,
                totalPrice: cartTotal
            };

            const res = await createOrderApi(orderData);

            if (res && res.errCode === 0) {
                notification.success({
                    message: "Đặt hàng thành công!",
                    description: "Đơn hàng của bạn đang được xử lý.",
                    placement: "topRight"
                });

                navigate("/"); 
            } else {
                notification.error({ message: res?.message || "Đặt hàng thất bại!" });
            }
        } catch (error) {
            notification.error({ message: "Có lỗi xảy ra, vui lòng thử lại!" });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-[60vh]"><Spin size="large" /></div>;
    }

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-10 min-h-screen mt-10">
            <h1 className="text-3xl font-bold mb-8">Thanh toán đơn hàng</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CỘT TRÁI: FORM NHẬP THÔNG TIN ĐỊA CHỈ */}
                <div className="lg:col-span-2">
                    <Card title={<span className="text-xl font-bold">Thông tin giao hàng</span>} className="shadow-sm rounded-2xl">
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Form.Item
                                label={<span className="font-semibold text-gray-700">Tên người nhận</span>}
                                name="name"
                                rules={[{ required: true, message: "Vui lòng nhập tên người nhận!" }]}
                            >
                                <Input placeholder="Nguyễn Văn A" size="large" className="!rounded-xl" />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-semibold text-gray-700">Số điện thoại</span>}
                                name="phone"
                                rules={[
                                    { required: true, message: "Vui lòng nhập số điện thoại!" },

                                    { pattern: new RegExp("^[0-9]{10}$"), message: "Số điện thoại phải có 10 chữ số!" }
                                ]}
                            >
                                <Input placeholder="0912345678" size="large" className="!rounded-xl" />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-semibold text-gray-700">Địa chỉ nhận hàng</span>}
                                name="address"
                                rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể!" }]}
                            >
                                <Input.TextArea rows={4} placeholder="Số nhà, tên đường, phường/xã, quận/huyện, thành phố..." className="!rounded-xl" />
                            </Form.Item>

                            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <span className="font-medium text-gray-700">Phương thức thanh toán bắt buộc:</span>
                                <b className="ml-2 text-blue-600 text-lg">Thanh toán khi nhận hàng (COD)</b>
                            </div>
                        </Form>
                    </Card>
                </div>

                {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG & NÚT ĐẶT HÀNG */}
                <div>
                    <Card title={<span className="text-xl font-bold">Tóm tắt đơn hàng</span>} className="shadow-sm rounded-2xl h-fit">
                        <div className="space-y-4 max-h-60 overflow-y-auto mb-4 pr-2">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex justify-between items-center border-b pb-2">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-800 line-clamp-1">{item.productId?.name}</span>
                                        <span className="text-sm text-gray-500">Số lượng: {item.quantity}</span>
                                    </div>
                                    <span className="font-medium text-gray-700">
                                        {Number(item.quantity * item.productId?.price).toLocaleString()}đ
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
                            <span className="text-lg font-medium text-gray-600">Tổng tiền đơn hàng:</span>
                            <span className="text-2xl font-bold text-red-500">
                                {Number(cartTotal).toLocaleString()}đ
                            </span>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            loading={submitting}
                            onClick={() => form.submit()}
                            className="w-full !h-14 !text-lg !font-bold !rounded-xl bg-red-500 hover:!bg-red-600 border-none shadow-md"
                        >
                            Xác nhận Đặt hàng (COD)
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;