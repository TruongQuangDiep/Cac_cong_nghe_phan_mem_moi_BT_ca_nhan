import React, { useContext } from 'react';
import { Menu } from 'antd';
import { HomeOutlined, UserAddOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const Header = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setAuth({ isAuthenticated: false, user: { email: "", name: "" } });
        navigate("/login");
    };

    const items = [
        { label: <Link to="/">Trang chủ</Link>, key: 'home', icon: <HomeOutlined /> },
        ...(!auth.isAuthenticated ? [
            { label: <Link to="/login">Đăng nhập</Link>, key: 'login', icon: <LoginOutlined /> },
            { label: <Link to="/register">Đăng ký</Link>, key: 'register', icon: <UserAddOutlined /> },
        ] : [
            { label: `Chào, ${auth.user.name}`, key: 'user', icon: <UserOutlined />, children: [
                { label: 'Đăng xuất', key: 'logout', onClick: handleLogout }
            ]},
        ])
    ];

    return <Menu mode="horizontal" items={items} />;
};

export default Header;