import {
    Form,
    Input,
    InputNumber,
    Button,
    notification,
    Upload,
    Select
} from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createProductApi, getCategoriesApi } from "../util/api";

const CreateProductPage = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // ================= LOAD CATEGORY =================
    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getCategoriesApi();
            setCategories(res || []);
        };
        fetchCategories();
    }, []);

    const beforeUpload = (file) => {
        const preview = URL.createObjectURL(file);
        setFileList((prev) => [
            ...prev,
            {
                uid: file.uid,
                name: file.name,
                status: "done",
                originFileObj: file,
                url: preview
            }
        ]);
        return false;
    };

    const handleRemove = (file) => {
        setFileList((prev) => prev.filter(item => item.uid !== file.uid));
    };

    const resetAll = () => {
        form.resetFields();
        setFileList([]);
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const formData = new FormData();

            formData.append("name", values.name);
            formData.append("price", values.price);
            formData.append("category", values.category);
            formData.append("stock", values.stock);

            if (values.oldPrice !== undefined && values.oldPrice !== null) {
                formData.append("oldPrice", values.oldPrice);
            }

            if (values.description !== undefined && values.description !== null) {
                formData.append("description", values.description);
            }

            fileList.forEach((item) => {
                formData.append("images", item.originFileObj);
            });

            const res = await createProductApi(formData);

            if (res?.errCode === 0) {
                notification.success({ message: "Create product success" });
                resetAll();
            } else {
                notification.error({ message: "Create product failed" });
            }
        } catch (err) {
            notification.error({ message: "Server error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* Tiêu đề & Nút Back */}
            <div className="flex items-center gap-4 mb-6">
                <Link to="/admin/products" className="text-gray-500 hover:text-blue-600 transition">
                    <ArrowLeftOutlined className="text-xl" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Create New Product</h1>
            </div>

            {/* Bọc Form trong Card trắng */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false} // Bỏ dấu sao đỏ mặc định nhìn cho thanh lịch
                >
                    <Form.Item
                        label={<span className="font-medium text-gray-700">Product Name</span>}
                        name="name"
                        rules={[{ required: true, message: 'Please enter product name' }]}
                    >
                        <Input size="large" placeholder="Enter product name" className="rounded-lg" />
                    </Form.Item>

                    {/* Chia Grid 3 cột cho Giá và Kho */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                        <Form.Item
                            label={<span className="font-medium text-gray-700">Price (VND)</span>}
                            name="price"
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá!' },

                                { type: 'number', min: 0, message: 'Giá không được là số âm!' }
                            ]}
                        >
                            {/* THÊM min={0} VÀO ĐÂY */}
                            <InputNumber size="large" style={{ width: '100%' }} className="rounded-lg" placeholder="0" />
                        </Form.Item>

                        <Form.Item
                            label={<span className="font-medium text-gray-700">Old Price (Optional)</span>}
                            name="oldPrice"
                            rules={[
                                // Không có required, chỉ có chặn số âm:
                                { type: 'number', min: 0, message: 'Giá cũ không được là số âm!' }
                            ]}
                        >
                            {/* THÊM min={0} VÀO ĐÂY */}
                            <InputNumber size="large" style={{ width: '100%' }} className="rounded-lg" placeholder="0" />
                        </Form.Item>

                    <Form.Item
                        label={<span className="font-medium text-gray-700">Stock</span>}
                        name="stock"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số lượng!' },
                            // Thêm rule chặn số âm báo lỗi đỏ:
                            { type: 'number', min: 0, message: 'Số lượng kho không được âm!' }
                        ]}
                    >

                        <InputNumber size="large" style={{ width: '100%' }} className="rounded-lg" placeholder="0" />
                    </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <Form.Item
                            label={<span className="font-medium text-gray-700">Category</span>}
                            name="category"
                            rules={[{ required: true, message: 'Please select category' }]}
                        >
                            <Select
                                size="large"
                                placeholder="Choose category"
                                className="w-full"
                                getPopupContainer={(triggerNode) => triggerNode.parentNode} 
                            >
                                {categories.map((item) => (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item label={<span className="font-medium text-gray-700">Images</span>}>
                        <Upload
                            listType="picture-card"
                            multiple
                            fileList={fileList}
                            beforeUpload={beforeUpload}
                            onRemove={handleRemove}
                        >
                            <div className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-500 transition">
                                <PlusOutlined className="text-xl mb-2" />
                                <div className="text-sm">Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-medium text-gray-700">Description</span>}
                        name="description"
                    >
                        <Input.TextArea 
                            size="large" 
                            rows={5} 
                            placeholder="Write a detailed product description..."
                            className="rounded-lg"
                        />
                    </Form.Item>

                    {/* Đường phân cách & Nút Submit */}
                    <div className="border-t border-gray-100 pt-6 mt-2 flex justify-end">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            className="px-8 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                        >
                            Create Product
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default CreateProductPage;