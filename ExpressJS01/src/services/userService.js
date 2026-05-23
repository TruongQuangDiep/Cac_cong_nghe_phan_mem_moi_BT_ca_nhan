import 'dotenv/config';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporter from '../config/mailer.js';

const saltRounds = 10;

export const createUserService = async (name, email, password) => {
    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return { errCode: 1, message: "Email này đã tồn tại trên hệ thống!" };
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);
        // Sinh ngẫu nhiên mã OTP kích hoạt tài khoản
        const registerOtp = Math.floor(100000 + Math.random() * 900000).toString();

        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "User",
            otpCode: registerOtp,
            otpExpires: Date.now() + 300000, // Mã hết hạn sau 5 phút
            isActivated: false 
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Kích hoạt tài khoản DShop mới',
            html: `<h2>Chào mừng bạn đến với DShop!</h2>
                   <p>Mã OTP kích hoạt tài khoản của bạn là:</p>
                   <h1>${registerOtp}</h1>
                   <p>Mã có hiệu lực trong vòng 5 phút.</p>`
        });

        return { errCode: 0, message: "Đăng ký thành công! Hãy kiểm tra hòm thư email để nhận mã OTP kích hoạt." };
    } catch (error) {
        console.log("🔥 LỖI GỬI MAIL THỰC SỰ LÀ: ", error);
        return { errCode: -1, message: "Lỗi hệ thống không thể gửi email OTP!" };
    }
}

export const verifyRegisterOTPService = async (email, otp) => {
    try {
        const user = await User.findOne({
            email,
            otpCode: otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return { errCode: 1, message: "Mã kích hoạt OTP không hợp lệ hoặc đã hết hạn!" };
        }

        user.isActivated = true; // Mở khóa tài khoản thành công!
        user.otpCode = null;
        user.otpExpires = null;
        await user.save();

        return { errCode: 0, message: "Kích hoạt tài khoản thành công! Bây giờ bạn đã có thể đăng nhập." };
    } catch (error) {
        return { errCode: -1, message: "Lỗi server!" };
    }
}

export const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return { errCode: 1, message: "Tài khoản hoặc mật khẩu không chính xác!" };
        }

        if (user.isActivated === false) {
            return { errCode: 3, message: "Tài khoản của bạn chưa được kích hoạt bằng mã OTP gửi qua email!" };
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) {
            return { errCode: 1, message: "Tài khoản hoặc mật khẩu không chính xác!" };
        }

        const payload = {
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar
        };

        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });

        const redirectUrl = user.role === "Admin" ? "/admin/profile" : "/user/profile";

        return {
            errCode: 0,
            access_token,
            redirectUrl, 
            user: payload
        };
    } catch (error) {
        return { errCode: -1, message: "Lỗi xử lý server!" };
    }
}

export const getUserService = async () => {
    try {
        let result = await User.find({}).select("-password");
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const sendOTPtoEmail = async (email) => {

    try {

        let user = await User.findOne({ email });

        if (!user) {
            return {
                errCode: 1,
                message: 'Email không tồn tại!'
            };
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.otpCode = otp;

        user.otpExpires = Date.now() + 300000;

        await user.save();

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: email,

            subject: 'Mã OTP khôi phục mật khẩu',

            html: `
                <h2>Mã OTP của bạn:</h2>
                <h1>${otp}</h1>
                <p>Mã có hiệu lực trong 5 phút.</p>
            `
        });

        return {
            errCode: 0,
            message: 'Đã gửi OTP về email!'
        };

    } catch (error) {

        console.log(error);

        return {
            errCode: -1,
            message: 'Lỗi server!'
        };
    }
}

export const resetPassword = async (data) => {

    try {

        let user = await User.findOne({
            email: data.email
        });

        if (!user) {

            return {
                errCode: 1,
                message: 'Email không tồn tại!'
            };
        }

        const hashPassword = await bcrypt.hash(
            data.newPassword,
            saltRounds
        );

        user.password = hashPassword;

        user.otpCode = null;
        user.otpExpires = null;

        await user.save();

        const payload = {
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar
        };

        const access_token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE
            }
        );

        return {
            errCode: 0,
            message: 'Update profile thành công!',
            user,
            access_token
        }

    } catch (error) {

        return {
            errCode: -1,
            message: 'Lỗi server!'
        };
    }
}

export const verifyForgotPasswordOTP = async (data) => {

    try {

        let user = await User.findOne({
            email: data.email,
            otpCode: data.otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {

            return {
                errCode: 1,
                message: 'OTP sai hoặc đã hết hạn!'
            };
        }

        return {
            errCode: 0,
            message: 'OTP hợp lệ!'
        };

    } catch (error) {

        console.log(error);

        return {
            errCode: -1,
            message: 'Lỗi server!'
        };
    }
}

export const updateProfileService = async (
    currentUser,
    data
) => {

    try {

        let user = await User.findOne({
            email: currentUser.email
        });

        if (!user) {

            return {
                errCode: 1,
                message: 'User không tồn tại!'
            };
        }

        if (data.name) {
            user.name = data.name;
        }

        if (data.avatar) {
            user.avatar = data.avatar;
        }

        await user.save();

        const payload = {
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar
        };

        const access_token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE
            }
        );

        return {
            errCode: 0,
            message: 'Update profile thành công!',
            user,
            access_token
        }

    } catch (error) {

        console.log(error);

        return {
            errCode: -1,
            message: 'Lỗi server!'
        };
    }
}