import express from 'express';
import userController from '../controller/userController.js';
import * as authController from '../controller/authController.js';
import { login } from '../controller/authController.js';
import { registerLimiter } from '../middlewares/rateLimit.js';
import { validateRegister } from '../middlewares/validation.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeRole from '../middlewares/roleMiddleware.js';
import loginLimiter from '../middlewares/rateLimitMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Định nghĩa trực tiếp các route trên router (KHÔNG bọc trong hàm)
router.post('/register', registerLimiter, validateRegister, authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', loginLimiter, body('email').isEmail(), body('password').isLength({ min: 6 }), login);

// Profile bảo mật
router.get('/user/profile', authMiddleware, authorizeRole('user'), (req, res) => {
    res.json({ message: 'Welcome user', user: req.user });
});
router.get('/admin/profile', authMiddleware, authorizeRole('admin'), (req, res) => {
    res.json({ message: 'Welcome admin', user: req.user });
});

router.post('/forgot-password', userController.handleForgotPassword);
router.post('/reset-password', userController.handleResetPassword);
router.put('/edit-profile', userController.handleEditProfile);

// Export router này ra để server.js sử dụng
export default router;