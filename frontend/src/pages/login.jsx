import React, { useContext } from 'react';
import { Button, Form, Input, notification, Card } from 'antd';
import { loginApi } from '../util/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const onFinish = async (values) => {
        const { email, password } = values;
        const res = await loginApi(email, password);

        if (res && res.token) { // Nếu Backend trả về login success kèm token
            // 1. Lưu Token vào LocalStorage (Đúng theo hướng dẫn của thầy)
            localStorage.setItem("access_token", res.token);

            // 2. Cập nhật trạng thái AuthContext
            setAuth({
                isAuthenticated: true,
                user: { 
                    email: res.user?.email ?? "", 
                    name: res.user?.fullName ?? "" 
                }
            });

            notification.success({
                message: "Đăng nhập",
                description: "Bạn đã đăng nhập thành công!"
            });
            navigate("/");
        } else {
            notification.error({
                message: "Lỗi đăng nhập",
                description: res.message || "Email hoặc mật khẩu không chính xác."
            });
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <Card title="Đăng Nhập" style={{ width: 400 }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="password" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>Đăng nhập</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;