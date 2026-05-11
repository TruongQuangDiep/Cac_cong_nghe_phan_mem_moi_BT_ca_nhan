import express from 'express';
import db from '../models/index.js';
import authMiddleware from '../middlewares/authMiddleware.js'; 
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const Product = db.Product;

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'assets/'),
    filename: (req, file, cb) => {
        // Lấy phần mở rộng (jpg, png...)
        const ext = path.extname(file.originalname);
        // Tạo tên file: Thời gian + một chuỗi ngẫu nhiên để không bao giờ trùng
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage: storage });

// 1. GET: Lấy danh sách sản phẩm (Chỉ lấy của tôi)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.user ? (req.user.user._id || req.user.user.id) : (req.user._id || req.user.id);
        const products = await Product.find({ user: userId }).populate('user', 'email fullName');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
});

// 2. POST: Thêm sản phẩm kèm upload ảnh
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const userId = req.user.user ? (req.user.user._id || req.user.user.id) : (req.user._id || req.user.id);
        const newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.file ? req.file.path.replace(/\\/g, "/") : "", // Lưu đường dẫn file
            user: userId
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: "Lỗi thêm sản phẩm", error: error.message });
    }
});

// 3. PUT: Cập nhật (Xóa ảnh cũ nếu upload ảnh mới)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const userId = req.user.user ? (req.user.user._id || req.user.user.id) : (req.user._id || req.user.id);
        const oldProduct = await Product.findOne({ _id: req.params.id, user: userId });

        if (!oldProduct) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

        let updateData = { ...req.body };

        // Nếu có upload file mới -> Xóa file cũ
        if (req.file) {
            updateData.image = req.file.path.replace(/\\/g, "/");
            if (oldProduct.image && fs.existsSync(`./${oldProduct.image}`)) {
                fs.unlinkSync(`./${oldProduct.image}`);
            }
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: req.params.id, user: userId },
            updateData,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 4. DELETE: Xóa sản phẩm & Xóa luôn ảnh trong assets
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.user ? (req.user.user._id || req.user.user.id) : (req.user._id || req.user.id);
        const product = await Product.findOne({ _id: req.params.id, user: userId });

        if (product && product.image && fs.existsSync(`./${product.image}`)) {
            fs.unlinkSync(`./${product.image}`); // Xóa file vật lý cho nhẹ máy
        }

        await Product.deleteOne({ _id: req.params.id, user: userId });
        res.json({ message: "Xóa sản phẩm thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;