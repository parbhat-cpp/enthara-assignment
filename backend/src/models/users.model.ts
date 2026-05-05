import mongoose, { Document } from "mongoose";
import bcrypt from 'bcrypt';

interface IUser extends Document {
    fullname: string;
    email: string;
    password: string;
    isPasswordMatch: (password: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
}, { timestamps: true });

// method to check if entered password is same
userSchema.methods.isPasswordMatch = async function (password: string) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

// Hash the password before saving the user model
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
});

export const User = mongoose.model<IUser>('User', userSchema);
