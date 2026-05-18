import express from 'express';

import {
    createUser,
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

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
});

// Public APIs
routerAPI.post("/register", createUser);

routerAPI.post("/login", handleLogin);

routerAPI.post(
    "/forgot-password",
    handleForgotPassword
);

routerAPI.post(
    "/verify-forgot-password-otp",
    handleVerifyForgotPasswordOTP
);

routerAPI.post(
    "/reset-password",
    handleResetPassword
);

// Các API phía dưới mới cần token
routerAPI.use(auth);

routerAPI.get("/user", getUser);

routerAPI.get("/account", getAccount);

routerAPI.put(
    "/edit-profile",
    upload.single("avatar"),
    handleUpdateProfile
);

export default routerAPI;