const admin = (req, res, next) => {

    if (req.user.role !== "Admin") {
        return res.status(403).json({
            message: "Bạn không có quyền!"
        });
    }

    next();
};

export default admin;
