import mongoose,{Schema,model} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const usersSchema = new Schema(
    {
        username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        fullname: { type: String, required: true, trim: true, index: true },
        avatar: { type: String, required: true },
        coverImage: { type: String, required: true },
        watchHistory: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }],
        password: { type: String, required: [true,"password is required"] },
        refreshToken: { type: String },


    }
    , { timestamps: true}
);
export const User = model('User', usersSchema);