import { useEffect, useState } from "react";
import {
    Form,
    Input,
    InputNumber,
    Button,
    Upload,
    notification,
    Select
} from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, Link } from "react-router-dom";
import {
    getProductDetailApi,
    updateProductApi,
    getCategoriesApi
} from "../util/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EditProductPage = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {

            const product = await getProductDetailApi(id);
            if (product) {
                form.setFieldsValue({
                    ...product,
                    category: product.category?._id
                });

                const oldImages =
                    product.images?.map((item, index) => ({
                        uid: `old-${index}`,
                        name: item,
                        status: "done",
                        url: `${BACKEND_URL}${item}`,
                        oldImage: item
                    })) || [];

                setFileList(oldImages);
            }

            const categoryRes = await getCategoriesApi();
            if (Array.isArray(categoryRes)) {
                setCategories(categoryRes);
            }
        };

        fetchData();
    }, [id, form]);

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

            const oldImages = fileList
                .filter(item => item.oldImage)
                .map(item => item.oldImage);

            formData.append("oldImages", JSON.stringify(oldImages));

            fileList.forEach((item) => {
                if (item.originFileObj) {
                    formData.append("images", item.originFileObj);
                }
            });

            const res = await updateProductApi(id, formData);

            if (res?.errCode === 0) {
                notification.success({
                    message: "Update success"
                });
            } else {
                notification.error({
                    message: "Update failed"
                });
            }
        } catch (err) {
            console.log(err);
            notification.error({
                message: "Server error"
            });
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
                <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
            </div>

            {/* Bọc Form trong Card trắng */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                >
                    <Form.Item
                        label={<span className="font-medium text-gray-700">Product Name</span>}
                        name="name"
                        rules={[{ required: true, message: "Please input product name" }]}
                    >
                        <Input size="large" className="rounded-lg" placeholder="Enter product name" />
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

                                    { type: 'number', min: 0, message: 'Số lượng kho không được âm!' }
                                ]}
                            >
                            {/* THÊM min={0} VÀO ĐÂY */}
                            <InputNumber size="large" style={{ width: '100%' }} className="rounded-lg" placeholder="0" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <Form.Item
                            label={<span className="font-medium text-gray-700">Category</span>}
                            name="category"
                            rules={[{ required: true, message: "Please choose category" }]}
                        >
                            <Select
                                size="large"
                                showSearch
                                placeholder="Choose category"
                                className="w-full"
                                optionFilterProp="children"
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
                            Update Product
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default EditProductPage;