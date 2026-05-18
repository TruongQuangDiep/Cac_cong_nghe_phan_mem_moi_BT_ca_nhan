import {
    Form,
    Input,
    InputNumber,
    Button,
    notification,
    Upload,
    Select
}
from "antd";

import {
    PlusOutlined
}
from "@ant-design/icons";

import {
    useEffect,
    useState
}
from "react";

import {
    createProductApi,
    getCategoriesApi
}
from "../util/api";

const CreateProductPage = () => {

    const [form] = Form.useForm();

    const [fileList, setFileList] = useState([]);

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] = useState(false);

    // ================= LOAD CATEGORY =================
    useEffect(() => {

        const fetchCategories = async () => {

            const res =
                await getCategoriesApi();

            setCategories(res || []);
        };

        fetchCategories();

    }, []);

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
            prev.filter(item =>
                item.uid !== file.uid
            )
        );
    };

    // ================= RESET =================
    const resetAll = () => {

        form.resetFields();

        setFileList([]);
    };

    // ================= SUBMIT =================
    const onFinish = async (values) => {

        try {

            setLoading(true);

            const formData =
                new FormData();

            formData.append(
                "name",
                values.name
            );

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

            fileList.forEach((item) => {

                formData.append(
                    "images",
                    item.originFileObj
                );
            });

            const res =
                await createProductApi(
                    formData
                );

            if (res?.errCode === 0) {

                notification.success({
                    message:
                        "Create product success"
                });

                resetAll();

            } else {

                notification.error({
                    message:
                        "Create product failed"
                });
            }

        } catch (err) {

            notification.error({
                message: "Server error"
            });

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="p-6">

            <h1 className="mb-5 text-2xl font-bold">Create Product</h1>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >

                <Form.Item
                    label="Name"
                    name="name"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
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
                >

                    <Select
                        placeholder="Choose category"
                        className="w-full"
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
                    <Input.TextArea />
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                >
                    Create
                </Button>

            </Form>

        </div>
    );
};

export default CreateProductPage;