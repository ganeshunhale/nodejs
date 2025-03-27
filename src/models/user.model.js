import mongoose, { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const usersSchema = new Schema(
    {
        username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        fullName: { type: String, required: true, trim: true, index: true },
        avatar: { type: String, required: true },
        coverImage: { type: String},
        watchHistory: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }],
        password: { type: String, required: [true, "password is required"] },
        refreshToken: { type: String },


    }
    , { timestamps: true }
);
usersSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
})
usersSchema.methods.isPasswordMatch = async function (password) {
    if (!this.password) return false;

    return await bcrypt.compare(password, this.password);
}
usersSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });

}
usersSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

}
export const User = model('User', usersSchema);