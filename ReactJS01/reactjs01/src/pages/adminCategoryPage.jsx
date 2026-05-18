import {
    useEffect,
    useState
}
from "react";

import {
    Table,
    Button,
    Input,
    Modal,
    Form,
    notification,
    Popconfirm
}
from "antd";

import {
    getCategoriesApi,
    createCategoryApi,
    updateCategoryApi,
    deleteCategoryApi
}
from "../util/api";

const AdminCategoryPage = () => {

    const [categories, setCategories] =
        useState([]);

    const [open, setOpen] =
        useState(false);

    const [editingCategory, setEditingCategory] =
        useState(null);

    const [form] = Form.useForm();

    // ================= FETCH =================
    const fetchCategories = async () => {

        const res =
            await getCategoriesApi();

        setCategories(res || []);
    };

    useEffect(() => {

        fetchCategories();

    }, []);

    // ================= OPEN CREATE =================
    const handleOpenCreate = () => {

        setEditingCategory(null);

        form.resetFields();

        setOpen(true);
    };

    // ================= OPEN EDIT =================
    const handleEdit = (record) => {

        setEditingCategory(record);

        form.setFieldsValue({
            name: record.name
        });

        setOpen(true);
    };

    // ================= SUBMIT =================
    const onFinish = async (values) => {

        let res;

        if (editingCategory) {

            res =
                await updateCategoryApi(
                    editingCategory._id,
                    values
                );

        } else {

            res =
                await createCategoryApi(
                    values
                );
        }

        if (res?.errCode === 0) {

            notification.success({
                message: "Success"
            });

            setOpen(false);

            fetchCategories();

        } else {

            notification.error({
                message:
                    res?.message || "Failed"
            });
        }
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {

        const res =
            await deleteCategoryApi(id);

        if (res?.errCode === 0) {

            notification.success({
                message:
                    "Delete success"
            });

            fetchCategories();

        } else {

            notification.error({
                message:
                    "Delete failed"
            });
        }
    };

    const columns = [

        {
            title: "Category Name",
            dataIndex: "name"
        },

        {
            title: "Action",

            render: (_, record) => (
                <>

                    <Button
                        type="primary"
                        onClick={() =>
                            handleEdit(record)
                        }
                    >
                        Edit
                    </Button>

                    <Popconfirm
                        title="Delete category?"
                        onConfirm={() =>
                            handleDelete(
                                record._id
                            )
                        }
                    >

                        <Button
                            danger
                            className="ml-2"
                        >
                            Delete
                        </Button>

                    </Popconfirm>

                </>
            )
        }
    ];

    return (

        <div className="max-w-screen-2xl mx-auto px-8 sm:px-10 lg:px-24 py-10">

            <div className="mb-5 flex items-center justify-between">

                <h1 className="text-2xl font-bold">
                    Admin Categories
                </h1>

                <Button
                    type="primary"
                    onClick={
                        handleOpenCreate
                    }
                >
                    Create Category
                </Button>

            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <Table
                    dataSource={categories}
                    columns={columns}
                    rowKey="_id"
                    pagination={false}
                />
            </div>

            <Modal
                open={open}
                onCancel={() =>
                    setOpen(false)
                }
                footer={null}
                title={
                    editingCategory
                        ? "Edit Category"
                        : "Create Category"
                }
            >

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >

                    <Form.Item
                        label="Category Name"
                        name="name"
                        rules={[
                            {
                                required: true
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                    >
                        Save
                    </Button>

                </Form>

            </Modal>

        </div>
    );
};

export default AdminCategoryPage;