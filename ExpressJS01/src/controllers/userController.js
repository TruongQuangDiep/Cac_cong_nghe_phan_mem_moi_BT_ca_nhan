import { validationResult } from 'express-validator';
import fs from 'fs';   
import path from 'path'; 
import {
    createUserService,
    verifyRegisterOTPService,
    loginService,
    getUserService,
    sendOTPtoEmail,
    verifyForgotPasswordOTP,
    resetPassword,
    updateProfileService
} from '../services/userService.js';

export const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errCode: 1, message: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;
    const data = await createUserService(name, email, password);
    return res.status(200).json(data);
}

export const handleVerifyRegisterOTP = async (req, res) => {
    const { email, otp } = req.body;
    const data = await verifyRegisterOTPService(email, otp);
    return res.status(200).json(data);
}

export const handleLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errCode: 1, message: errors.array()[0].msg });
    }
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

// 🔥 ĐÃ NÂNG CẤP: HÀM CẬP NHẬT PROFILE TỰ ĐỘNG QUÉT DỌN ẢNH AVATAR CŨ
export const handleUpdateProfile = async (req, res) => {
    try {
        let data = req.body;
        
        // Kiểm tra xem người dùng có upload ảnh mới lên hay không
        if (req.file) {
 
            const oldAvatarPath = req.user?.avatar;
            
            if (oldAvatarPath && !oldAvatarPath.startsWith("http")) {
                const filePath = path.join(
                    process.cwd(),
                    'src/public', // Đường dẫn tới thư mục public dự án của bạn
                    oldAvatarPath
                );

                // Nếu ảnh cũ thực sự nằm trên ổ cứng -> Tiến hành xóa ngay lập tức
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            // Gán đường dẫn file ảnh mới vào dữ liệu cập nhật
            data.avatar = `/images/avatar/${req.file.filename}`;
        }

        const response = await updateProfileService(
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