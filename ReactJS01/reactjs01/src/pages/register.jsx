import React from 'react';
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    notification,
    Row
} from 'antd';

import { createUserApi } from '../util/api';

import {
    Link,
    useNavigate
} from 'react-router-dom';

import {
    ArrowLeftOutlined
} from '@ant-design/icons';

const RegisterPage = () => {

    const navigate = useNavigate();

    const onFinish = async (values) => {

        const {
            name,
            email,
            password
        } = values;

        const res =
            await createUserApi(
                name,
                email,
                password
            );

        if (res && res._id) {

            notification.success({
                message: "CREATE USER",
                description:
                    "Tạo tài khoản thành công!"
            });

            navigate("/login");

        } else {

            notification.error({
                message: "CREATE USER",
                description:
                    res?.message ||
                    "Có lỗi xảy ra"
            });
        }
    };

    return (

        <div
            className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gray-100
                px-4
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    bg-white
                    rounded-2xl
                    shadow-xl
                    p-8
                "
            >

                <h1
                    className="
                        text-3xl
                        font-bold
                        text-center
                        mb-8
                    "
                >
                    Đăng Ký
                </h1>

                <Form
                    layout="vertical"
                    onFinish={onFinish}
                >

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please input your email!"
                            }
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter email"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please input your password!"
                            }
                        ]}
                    >
                        <Input.Password
                            size="large"
                            placeholder="Enter password"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please input your name!"
                            }
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter full name"
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        className="!h-11"
                    >
                        Register
                    </Button>

                </Form>

                <Divider />

                <div
                    className="
                        text-center
                        space-y-3
                    "
                >

                    <div>
                        Đã có tài khoản?{" "}

                        <Link
                            to="/login"
                            className="
                                text-blue-500
                                font-medium
                            "
                        >
                            Đăng nhập
                        </Link>
                    </div>

                    <Link
                        to="/"
                        className="
                            inline-flex
                            items-center
                            gap-1
                            text-gray-500
                            hover:text-black
                        "
                    >
                        <ArrowLeftOutlined />
                        Quay lại trang chủ
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default RegisterPage;