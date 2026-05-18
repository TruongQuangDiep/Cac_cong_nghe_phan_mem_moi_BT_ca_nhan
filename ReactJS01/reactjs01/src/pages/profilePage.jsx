import React, {
    useEffect,
    useState,
    useContext
} from 'react';

import {
    Button,
    Col,
    Form,
    Input,
    notification,
    Row,
    Divider,
    Upload,
    Avatar
} from 'antd';

import {
    ArrowLeftOutlined,
    UserOutlined
} from '@ant-design/icons';

import { Link } from 'react-router-dom';

import {
    getProfileApi,
    updateProfileApi
} from '../util/api';

import { AuthContext }
from '../components/context/auth.context';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProfilePage = () => {

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);

    const [fileObject, setFileObject] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const { auth, setAuth } = useContext(AuthContext);

    // ================= GET PROFILE =================
    useEffect(() => {

        const fetchProfile = async () => {

            const res = await getProfileApi();

            if (res) {

                const user = res;

                form.setFieldsValue({
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    avatar: user.avatar
                });

                if (user.avatar) {
                    setImageUrl(user.avatar);
                }
            }
        };

        fetchProfile();

    }, []);

    // ================= UPLOAD (FIXED BEFOREUPLOAD) =================
    const beforeUpload = (file) => {

        setFileObject(file); // lưu file thật

        // preview ảnh
        const reader = new FileReader();

        reader.onload = (e) => {
            setImageUrl(e.target.result);
        };

        reader.readAsDataURL(file);

        return false; // chặn auto upload
    };

    // ================= SUBMIT =================
    const onFinish = async (values) => {

        setLoading(true);

        let avatarToSend = fileObject;

        if (
            !fileObject &&
            typeof imageUrl === "string" &&
            !imageUrl.startsWith("data:")
        ) {
            avatarToSend = imageUrl;
        }

        const res = await updateProfileApi(
            values.name,
            avatarToSend
        );

        setLoading(false);

        if (res && res.errCode === 0) {

            notification.success({
                message: "UPDATE PROFILE",
                description: "Cập nhật hồ sơ thành công!"
            });

            if (res.user) {

                // update form
                form.setFieldsValue({
                    name: res.user.name,
                    avatar: res.user.avatar,
                });

                // update avatar
                setImageUrl(res.user.avatar);

                // reset file
                setFileObject(null);

                // lưu token mới
                localStorage.setItem(
                    "access_token",
                    res.access_token
                );

                // update auth context
                setAuth({
                    isAuthenticated: true,
                    user: {
                        email: res.user.email,
                        name: res.user.name,
                        role: res.user.role,
                        avatar: res.user.avatar
                    }
                });
            }

        } else {

            notification.error({
                message: "UPDATE PROFILE",
                description: res?.message ?? "Cập nhật hồ sơ thất bại!"
            });
        }
    };

    return (

        <Row justify={"center"} className="mt-8">

            <Col xs={24} md={16} lg={8}>

                <fieldset className="m-1 rounded-lg border border-gray-300 p-4">

                    <legend className="mx-auto mb-5 text-center text-2xl font-semibold">
                        Profile
                    </legend>

                    <Form
                        form={form}
                        layout='vertical'
                        onFinish={onFinish}
                    >

                        <Form.Item label="Email" name="email">
                            <Input disabled />
                        </Form.Item>

                        <Form.Item label="Role" name="role">
                            <Input disabled />
                        </Form.Item>

                        <Form.Item label="Full Name" name="name">
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>

                        {/* ================= AVATAR (FIXED BEFOREUPLOAD) ================= */}
                        <Form.Item label="Avatar" name="avatar">

                            <Upload
                                listType="picture-card"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                            >

                                <Avatar
                                    size={100}
                                    src={
                                        imageUrl
                                            ? (imageUrl.startsWith("data:")
                                                ? imageUrl
                                                : `${BACKEND_URL}${imageUrl}`)
                                            : null
                                    }
                                    icon={<UserOutlined />}
                                />

                            </Upload>

                        </Form.Item>

                        <Form.Item>
                            <Button
                                type='primary'
                                htmlType='submit'
                                loading={loading}
                                block
                            >
                                Update Profile
                            </Button>
                        </Form.Item>

                    </Form>

                    <Link
                        to={
                            auth?.user?.role === "Admin"
                                ? "/user"
                                : "/"
                        }
                    >
                        <ArrowLeftOutlined /> Back
                    </Link>

                    <Divider />

                    <div className="text-center">
                        Update your personal information
                    </div>

                </fieldset>

            </Col>

        </Row>
    );
};

export default ProfilePage;