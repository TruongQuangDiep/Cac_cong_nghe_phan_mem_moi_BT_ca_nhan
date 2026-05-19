import "./index.css";
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// 1. IMPORT THÊM CONFIGPROVIDER CỦA ANT DESIGN VÀO ĐÂY
import { ConfigProvider } from "antd";

import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import ForgotPasswordPage from './pages/forgotPasswordPage.jsx';
import VerifyOtpPage from './pages/verifyOtpPage.jsx';
import ResetPasswordPage from './pages/resetPasswordPage.jsx';
import ProfilePage from './pages/profilePage.jsx';
import ProductDetailPage from './pages/productDetail';
import AdminProductPage from './pages/adminProduct';
import CreateProductPage from './pages/createProduct';
import EditProductPage from './pages/editProduct';
import AdminCategoryPage from "./pages/adminCategoryPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />
      },
      {
        path: "admin/products",
        element: <AdminProductPage />
      },
      {
        path: "admin/products/create",
        element: <CreateProductPage />
      },
      {
        path: "admin/products/edit/:id",
        element: <EditProductPage />
      },
      {
        path: "admin/categories",
        element: <AdminCategoryPage />
      }
    ],
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />
  },
  {
    path: "/verify-otp",
    element: <VerifyOtpPage />
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />
  },
]);

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <AuthWrapper>
      
      {/* 2. BỌC CONFIG PROVIDER QUANH ROUTER PROVIDER */}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#4f46e5', // Xanh Indigo sang trọng
            borderRadius: 8,
            fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
            
            // 1. CHỈNH VIỀN ĐẬM HƠN MỘT CHÚT (Màu Gray-300)
            colorBorder: '#d1d5db', 
            
            // 2. Chỉnh màu chữ trong ô input đậm hơn để dễ đọc
            colorText: '#1f2937', 
          },
          components: {
            Input: {
              controlHeight: 44, // Tăng thêm chút độ cao cho form bề thế
              // 3. HIỆU ỨNG GLOW XỊN SÒ KHI CLICK VÀO Ô NHẬP LIỆU
              activeShadow: '0 0 0 3px rgba(79, 70, 229, 0.15)', 
            },
            InputNumber: {
              controlHeight: 44,
              activeShadow: '0 0 0 3px rgba(79, 70, 229, 0.15)',
            },
            Select: {
              controlHeight: 44,
            },
            Button: {
              controlHeight: 44,
              fontWeight: 600, // In đậm chữ ở nút bấm
            }
          }
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
      
    </AuthWrapper>
  </React.StrictMode>,
)