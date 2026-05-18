import 'dotenv/config';
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const white_lists = ["/", "/register", "/login"];
    
    // Kiểm tra nếu route nằm trong danh sách trắng (không cần token)
    if (white_lists.find(item => '/v1/api' + item === req.originalUrl)) {
        next();
    } else {
        // Kiểm tra Token trong Header
        if (req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];

            // Xác thực token
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // Lưu thông tin người dùng vào request để các hàm sau sử dụng
                req.user = decoded;
                
                console.log(">>> check token: ", decoded);
                next();
            } catch (error) {
                return res.status(401).json({
                    message: "Token bị hết hạn/hoặc không hợp lệ"
                });
            }
        } else {
            // Không có token
            return res.status(401).json({
                message: "Bạn chưa truyền Access Token ở Header/Hoặc token bị hết hạn"
            });
        }
    }
}

export default auth;