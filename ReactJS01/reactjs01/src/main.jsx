import "./index.css";
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'

import {
  createBrowserRouter,
  RouterProvider,
}
from "react-router-dom";

import RegisterPage
from './pages/register.jsx';

import UserPage
from './pages/user.jsx';

import HomePage
from './pages/home.jsx';

import LoginPage
from './pages/login.jsx';

import {
  AuthWrapper
}
from './components/context/auth.context.jsx';

import ForgotPasswordPage
from './pages/forgotPasswordPage.jsx';

import VerifyOtpPage
from './pages/verifyOtpPage.jsx';

import ResetPasswordPage
from './pages/resetPasswordPage.jsx';

import ProfilePage
from './pages/profilePage.jsx';

import ProductDetailPage
from './pages/productDetail';

import AdminProductPage
from './pages/adminProduct';

import CreateProductPage
from './pages/createProduct';

import EditProductPage
from './pages/editProduct';

import AdminCategoryPage
from "./pages/adminCategoryPage.jsx";

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

      <RouterProvider router={router} />

    </AuthWrapper>

  </React.StrictMode>,
)