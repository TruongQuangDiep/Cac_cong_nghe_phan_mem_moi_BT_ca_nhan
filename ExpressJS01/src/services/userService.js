import 'dotenv/config';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporter from '../config/mailer.js';

const saltRounds = 10;

export const createUserService = async (name, email, password) => {
    try {
        // 1. Kiểm tra xem user đã tồn tại chưa
        const user = await User.findOne({ email: email });
        if (user) {
            console.log(`>>> user exist, chọn 1 email khác: ${email}`);
            return null;
        }

        // 2. Hash (mã hóa) mật khẩu
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // 3. Lưu user vào database
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "User"
        });

        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

export const loginService = async (email1, password) => {
    try {
        // 1. Tìm user theo email
        const user = await User.findOne({ email: email1 });
        if (user) {
            // 2. So sánh mật khẩu
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email/Password không hợp lệ"
                };
            } else {
                // 3. Tạo access token (JWT)
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
                    EC: 0,
                    access_token,
                    user: {
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        avatar: user.avatar
                    }
                };
            }
        } else {
            return {
                EC: 1,
                EM: "Email/Password không hợp lệ"
            };
        }

    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getUserService = async () => {
    try {
        // Lấy tất cả user nhưng loại trừ (select "-") trường password để bảo mật
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

        // Tạo OTP 6 số
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // Lưu OTP
        user.otpCode = otp;

        // Hết hạn sau 5 phút
        user.otpExpires = Date.now() + 300000;

        await user.save();

        // Gửi mail
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

        // Hash password mới
        const hashPassword = await bcrypt.hash(
            data.newPassword,
            saltRounds
        );

        user.password = hashPassword;

        // Xóa OTP
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

        // OTP sai hoặc hết hạn
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

        // update fullName
        if (data.name) {
            user.name = data.name;
        }

        // update avatar
        if (data.avatar) {
            user.avatar = data.avatar;
        }

        await user.save();

        // Tạo token mới
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