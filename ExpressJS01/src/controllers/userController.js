import {
    createUserService,
    loginService,
    getUserService,
    sendOTPtoEmail,
    verifyForgotPasswordOTP,
    resetPassword,
    updateProfileService
}
from '../services/userService.js';

export const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const data = await createUserService(name, email, password);
    return res.status(200).json(data);
}

export const handleLogin = async (req, res) => {
    console.log(">>> Check body login: ", req.body);
    const { email, password } = req.body;
    const data = await loginService(email, password);
    return res.status(200).json(data);
}

export const getUser = async (req, res) => {
    const data = await getUserService();
    return res.status(200).json(data);
}

export const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
}

export const handleForgotPassword = async (req, res) => {

    let email = req.body.email;

    let response = await sendOTPtoEmail(email);

    return res.status(200).json(response);
}

export const handleVerifyForgotPasswordOTP = async (req, res) => {

    let response = await verifyForgotPasswordOTP(req.body);

    return res.status(200).json(response);
}

export const handleResetPassword = async (req, res) => {

    let response = await resetPassword(req.body);

    return res.status(200).json(response);
}

export const handleUpdateProfile = async (req, res) => {

    try {

        let data = req.body;

        if (req.file) {

            data.avatar =
                `/images/avatar/${req.file.filename}`;
        }

        const response =
            await updateProfileService(
                req.user,
                data
            );

        return res.status(200).json(response);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: 'Lỗi server!'
        });
    }
}