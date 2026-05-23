import { useDispatch } from 'react-redux';
import { setAuthData } from '../redux/authSlice';
import React from 'react';
import { Button, Form, Input, notification } from 'antd';
import { loginApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, MailOutlined, LockOutlined, ShoppingOutlined } from '@ant-design/icons';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        const { email, password } = values;
        const res = await loginApi(email, password);

        if (res && res.errCode === 0) {
            localStorage.setItem("access_token", res.access_token);

            notification.success({
                message: "ĐĂNG NHẬP",
                description: res.message || "Đăng nhập thành công!"
            });

            dispatch(setAuthData({
                isAuthenticated: true,
                user: {
                    email: res?.user?.email ?? "",
                    name: res?.user?.name ?? "",
                    role: res?.user?.role ?? "",
                    avatar: res?.user?.avatar ?? ""
                }
            }));

            navigate("/"); 
        } else {
            notification.error({
                message: "ĐĂNG NHẬP THẤT BẠI",
                description: res?.message || "Tài khoản/Mật khẩu không chính xác hoặc chưa kích hoạt OTP!"
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/40">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl shadow-lg mb-4">
                        <ShoppingOutlined />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Login to your account</p>
                </div>

                <Form name="basic" onFinish={onFinish} autoComplete="off" layout='vertical'>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                        <Input size="large" prefix={<MailOutlined />} placeholder="Enter email" className="!rounded-xl !py-2" />
                    </Form.Item>

                    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password size="large" prefix={<LockOutlined />} placeholder="Enter password" className="!rounded-xl !py-2" />
                    </Form.Item>

                    <div className="flex justify-between text-sm mb-6">
                        <Link to="/forgot-password" className="text-blue-500 hover:text-blue-700 font-medium">Forgot Password?</Link>
                        <Link to="/register" className="text-blue-500 hover:text-blue-700 font-medium">Create Account</Link>
                    </div>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" className="!h-12 !rounded-xl !font-semibold !text-lg">
                            Login
                        </Button>
                    </Form.Item>
                </Form>

                <div className="text-center mt-6 text-gray-500">
                    <Link to="/" className="inline-flex items-center gap-2 hover:text-blue-600 transition">
                        <ArrowLeftOutlined /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;