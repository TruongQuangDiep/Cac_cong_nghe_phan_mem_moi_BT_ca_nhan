import userService from "../services/userService.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const handleForgotPassword = async (req, res) => {
    let email = req.body.email;
    if (!email) return res.status(200).json({ errCode: 1, message: 'Nhập Email!' });
    
    let response = await userService.sendOTPtoEmail(email);
    return res.status(200).json(response);
}

const handleResetPassword = async (req, res) => {
    let response = await userService.resetPassword(req.body);
    return res.status(200).json(response);
}

const handleEditProfile = async (req, res) => {
    try {
        let message = await userService.handleUpdateProfile(req.body);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(200).json({ errCode: -1, message: 'Lỗi server...' });
    }
};

export default {
    handleForgotPassword,
    handleResetPassword,
    handleEditProfile
};