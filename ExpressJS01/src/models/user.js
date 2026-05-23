import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    name: String,
    avatar: String,

    email: {
        type: String,
        unique: true
    },

    password: String,

    role: {
        type: String,
        default: "User"
    },

    otpCode: String,

    otpExpires: Date,

    isActivated: {
        type: Boolean,
        default: true
    }

});

const User = mongoose.model('User', userSchema);

export default User;