import express from 'express';
import { body } from 'express-validator'; 
import rateLimit from 'express-rate-limit'; 

import {
    createUser,
    handleVerifyRegisterOTP,
    handleLogin,
    getUser,
    getAccount,
    handleForgotPassword,
    handleVerifyForgotPasswordOTP,
    handleResetPassword,
    handleUpdateProfile
}
from '../controllers/userController.js';

import auth from '../middleware/auth.js';
import delay from '../middleware/delay.js';
import upload from '../middleware/upload.js';

const routerAPI = express.Router();
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { errCode: -2, message: "Bạn đã thử quá nhiều lần, vui lòng đợi 15 phút sau thử lại!" }
});

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
});

routerAPI.post("/register", 
    authLimiter,
    [
        body('email').isEmail().withMessage('Định dạng Email không hợp lệ!'),
        body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải chứa ít nhất 6 ký tự!'),
        body('name').notEmpty().withMessage('Tên người dùng không được bỏ trống!')
    ], 
    createUser
);

routerAPI.post("/verify-register-otp", authLimiter, handleVerifyRegisterOTP);

routerAPI.post("/login", 
    authLimiter,
    [
        body('email').isEmail().withMessage('Email không đúng định dạng!'),
        body('password').notEmpty().withMessage('Mật khẩu không được bỏ trống!')
    ], 
    handleLogin
);

routerAPI.post("/forgot-password", authLimiter, handleForgotPassword);
routerAPI.post("/verify-forgot-password-otp", authLimiter, handleVerifyForgotPasswordOTP);
routerAPI.post("/reset-password", handleResetPassword);
routerAPI.use(auth);

routerAPI.get("/user", getUser);
routerAPI.get("/account", getAccount);
routerAPI.put("/edit-profile", upload.single("avatar"), handleUpdateProfile);

export default routerAPI;