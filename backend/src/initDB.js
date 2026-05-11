import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/user.js'; // Đã chỉnh đường dẫn vì file này nằm trong src/

const resetData = async () => {
  try {
    console.log(">>> Đang kết nối Database...");
    // 1. Kết nối Database (Dùng MONGO_URI từ .env)
    await mongoose.connect(process.env.MONGO_URI);
    console.log(">>> Kết nối thành công!");
    
    // 2. Xóa sạch dữ liệu cũ trong bảng users
    await User.deleteMany({});
    console.log(">>> Đã dọn sạch dữ liệu cũ trong bảng users.");

    // 3. Mã hóa mật khẩu "123456"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    // 4. Tạo dữ liệu mẫu Admin
    await User.create({
      email: "23110205@student.hcmute.edu.vn",
      password: hashedPassword,
      role: "admin", 
      isActivated: true,
      otpCode: "123456",
      otpExpires: new Date(Date.now() + 10 * 60000), 
      fullName: "Trương Quang Điệp",
      avatar: "https://i.pravatar.cc/300" 
    });

    console.log("--------------------------------------------------");
    console.log("✅ KHỞI TẠO TÀI KHOẢN ADMIN THÀNH CÔNG!");
    console.log("📧 Email: 23110205@student.hcmute.edu.vn");
    console.log("🔑 Password: 123456");
    console.log("--------------------------------------------------");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khởi tạo DB:", error);
    process.exit(1);
  }
};

resetData();