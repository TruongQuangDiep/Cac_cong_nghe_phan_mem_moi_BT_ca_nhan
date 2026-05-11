import React from 'react';
import { Button, Form, Input, notification, Card } from 'antd';
import { registerUserApi } from '../util/api';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { fullName, email, password } = values;
        const res = await registerUserApi(fullName, email, password);

        if (res && res._id) { // Kiểm tra nếu Backend trả về Object User
            notification.success({
                message: "Đăng ký người dùng",
                description: "Chúc mừng bạn đã đăng ký thành công!"
            });
            navigate("/login");
        } else {
            notification.error({
                message: "Lỗi đăng ký",
                description: res.message || "Đã có lỗi xảy ra, vui lòng thử lại."
            });
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <Card title="Đăng Ký Tài Khoản" style={{ width: 400 }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Họ tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, min: 6, message: 'Mật khẩu ít nhất 6 ký tự!' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>Đăng ký</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default RegisterPage;