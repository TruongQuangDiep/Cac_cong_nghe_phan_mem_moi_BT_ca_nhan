import "./index.css";
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { ConfigProvider } from "antd";

import { Provider } from 'react-redux';
import { store } from './redux/store.js';

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
import CartPage from './pages/CartPage.jsx'; 
import CheckoutPage from './pages/CheckoutPage.jsx';
import AdminOrderPage from './pages/adminOrderPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';

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
        path: "cart",
        element: <CartPage />
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
        path: "checkout",
        element: <CheckoutPage />
      },
      {
        path: "admin/orders",
        element: <AdminOrderPage />
      },
      {
        path: "order-history",
        element: <OrderHistoryPage />
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
    {/* 🔥 ĐÃ THAY THẾ: Bọc Provider Redux lên đầu hệ thống để đáp ứng đề bài của Thầy */}
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#4f46e5', 
            borderRadius: 8,
            fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
            colorBorder: '#d1d5db', 
            colorText: '#1f2937', 
          },
          components: {
            Input: { controlHeight: 44, activeShadow: '0 0 0 3px rgba(79, 70, 229, 0.15)' },
            InputNumber: { controlHeight: 44, activeShadow: '0 0 0 3px rgba(79, 70, 229, 0.15)' },
            Select: { controlHeight: 44 },
            Button: { controlHeight: 44, fontWeight: 600 }
          }
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
)