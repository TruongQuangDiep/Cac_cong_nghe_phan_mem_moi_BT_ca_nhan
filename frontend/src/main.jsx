import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App.jsx'
import RegisterPage from './pages/register.jsx'
import LoginPage from './pages/login.jsx'
import HomePage from './pages/home.jsx' // Bạn nên tách phần bảng sản phẩm ra file này
import { AuthWrapper } from './components/context/auth.context.jsx'

import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App đóng vai trò là Layout (chứa Header)
    children: [
      {
        index: true, // Đây là trang hiện ra mặc định khi vào "/"
        element: <HomePage />, 
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "forgot-password",
        element: <div style={{ padding: "20px" }}>Trang Quên mật khẩu</div>,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </StrictMode>,
)