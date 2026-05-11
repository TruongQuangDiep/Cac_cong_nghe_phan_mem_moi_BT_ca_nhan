import bcrypt from 'bcryptjs'; 
import db from '../models/index'; 

const salt = bcrypt.genSaltSync(10); 

// Hàm mã hóa mật khẩu
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => { 
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

// Hàm Thêm mới User (Create)
let createNewUser = async (data) => { 
    return new Promise(async (resolve, reject) => { 
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId
            });
            resolve('OK create a new user successfully');
        } catch (e) {
            reject(e);
        }
    })
}

// Hàm Lấy danh sách tất cả User (Read All)
let getAllUser = () => {
    return new Promise(async (resolve, reject) => { 
        try {
            let users = await db.User.findAll({
                raw: true, 
            });
            resolve(users); 
        } catch (e) {
            reject(e);
        }
    })
}

// Hàm Lấy thông tin 1 User theo ID (Read One)
let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => { 
        try {
            let user = await db.User.findOne({
                where: { id: userId }, 
                raw: true
            });
            if (user) {
                resolve(user); 
            } else {
                resolve([]); 
            }
        } catch (e) {
            reject(e);
        }
    })
}

// Hàm Cập nhật thông tin User (Update)
let updateUser = (data) => {
    return new Promise(async (resolve, reject) => { 
        try {
            let user = await db.User.findOne({
                where: { id: data.id } 
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();

                let allusers = await db.User.findAll();
                resolve(allusers);
            } else {
                resolve(); 
            }
        } catch (e) {
            reject(e);
        }
    })
}

// Hàm Xóa User (Delete)
let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => { 
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            });
            if (user) {
                await user.destroy();
            }
            resolve(); 
        } catch (e) {
            reject(e);
        }
    })
}

// Xuất các hàm ra ngoài để Controller có thể gọi được
module.exports = { 
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUser: updateUser,
    deleteUserById: deleteUserById
}