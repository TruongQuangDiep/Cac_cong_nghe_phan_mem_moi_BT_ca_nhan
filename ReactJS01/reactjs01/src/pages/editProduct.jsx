import {
    useEffect,
    useState
}
from "react";

import {
    Form,
    Input,
    InputNumber,
    Button,
    Upload,
    notification,
    Select
}
from "antd";

import {
    PlusOutlined
}
from "@ant-design/icons";

import {
    useParams
}
from "react-router-dom";

import {
    getProductDetailApi,
    updateProductApi,
    getCategoriesApi
}
from "../util/api";

const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL;

const EditProductPage = () => {

    const { id } = useParams();

    const [form] = Form.useForm();

    const [fileList, setFileList] = useState([]);

    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);

    // ================= LOAD =================
    useEffect(() => {

        const fetchData = async () => {

            // load product
            const product =
                await getProductDetailApi(id);

            if (product) {

                form.setFieldsValue({
                    ...product,
                    category: product.category
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

            // load categories
            const categoryRes =
                await getCategoriesApi();

            if (Array.isArray(categoryRes)) {
                setCategories(categoryRes);
            }
        };

        fetchData();

    }, [id]);

    // ================= UPLOAD =================
    const beforeUpload = (file) => {

        const preview =
            URL.createObjectURL(file);

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

    // ================= REMOVE =================
    const handleRemove = (file) => {

        setFileList((prev) =>
            prev.filter(item => item.uid !== file.uid)
        );
    };

    // ================= SUBMIT =================
    const onFinish = async (values) => {

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("name", values.name);

            formData.append(
                "price",
                values.price
            );

            formData.append(
                "oldPrice",
                values.oldPrice
            );

            formData.append(
                "category",
                values.category
            );

            formData.append(
                "stock",
                values.stock
            );

            formData.append(
                "description",
                values.description
            );

            // giữ ảnh cũ
            const oldImages =
                fileList
                    .filter(item => item.oldImage)
                    .map(item => item.oldImage);

            formData.append(
                "oldImages",
                JSON.stringify(oldImages)
            );

            // thêm ảnh mới
            fileList.forEach((item) => {

                if (item.originFileObj) {

                    formData.append(
                        "images",
                        item.originFileObj
                    );
                }
            });

            const res =
                await updateProductApi(
                    id,
                    formData
                );

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

        <div className="p-6">

            <h1 className="mb-5 text-2xl font-bold">Edit Product</h1>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >

                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Please input product name"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                        {
                            required: true,
                            message: "Please input price"
                        }
                    ]}
                >
                    <InputNumber
                        className="w-full"
                    />
                </Form.Item>

                <Form.Item
                    label="Old Price"
                    name="oldPrice"
                >
                    <InputNumber
                        className="w-full"
                    />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category"
                    rules={[
                        {
                            required: true,
                            message: "Please choose category"
                        }
                    ]}
                >

                    <Select
                        showSearch
                        placeholder="Choose category"
                        className="w-full"
                        optionFilterProp="children"
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

                </Form.Item>

                <Form.Item
                    label="Stock"
                    name="stock"
                    rules={[
                        {
                            required: true,
                            message: "Please input stock"
                        }
                    ]}
                >
                    <InputNumber
                        className="w-full"
                    />
                </Form.Item>

                <Form.Item label="Images">

                    <Upload
                        listType="picture-card"
                        multiple
                        fileList={fileList}
                        beforeUpload={beforeUpload}
                        onRemove={handleRemove}
                    >
                        <div>
                            <PlusOutlined />
                            <div>Add</div>
                        </div>
                    </Upload>

                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input.TextArea rows={5} />
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                >
                    Update
                </Button>

            </Form>

        </div>
    );
};

export default EditProductPage;