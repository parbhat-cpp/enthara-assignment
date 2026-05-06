import { Request, Response } from "express";
import HttpStatus from "http-status";
import * as zod from "zod";
import jwt from "jsonwebtoken";

import { SignUpInput, LoginInput, LoginSchema, SignUpSchema } from "../types/auth.types";
import { User } from "../models/users.model";
import { VerifiedRequest } from "../types/req.types";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = await zod.parseAsync(LoginSchema, req.body);

        const user = await User.findOne({ email });

        // check if user does not exists
        if (!user) {
            res.status(HttpStatus.NOT_FOUND).send({
                success: false,
                message: "User not found",
            });
            return;
        }

        const isMatch = await user.isPasswordMatch(password);

        // password match check
        if (!isMatch) {
            res.status(HttpStatus.UNAUTHORIZED).send({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }

        const userData = {
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
        }

        const token = jwt.sign(userData, process.env.JWT_SECRET as string, { expiresIn: '30d' });

        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Only sends over HTTPS in production
            maxAge: 30 * 24 * 60 * 60 * 1000, // Expiration time in milliseconds (30 days)
            sameSite: 'lax', // Allows cookies to be sent with cross-site requests
            path: '/' // Ensure cookie is available for all paths
        });

        res.status(HttpStatus.OK).send({
            success: true,
            message: "Login successful",
            data: userData,
        });
    } catch (error) {
        if (error instanceof zod.ZodError) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Validation error",
                errors: error.issues,
            });
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            error,
        });
    }
};

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password, fullname } = await zod.parseAsync(SignUpSchema, req.body);

        const userExists = await User.findOne({ email });

        // check if user exists
        if (userExists) {
            res.status(HttpStatus.CONFLICT).send({
                success: false,
                message: "User already exists",
            });
            return;
        }

        // create a new user
        const user = new User({
            fullname, email, password
        });

        // save new user
        await user.save();

        const userData = {
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
        }

        const token = jwt.sign(userData, process.env.JWT_SECRET as string, { expiresIn: '30d' });

        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Only sends over HTTPS in production
            maxAge: 30 * 24 * 60 * 60 * 1000, // Expiration time in milliseconds (30 days)
            sameSite: 'lax', // Allows cookies to be sent with cross-site requests
            path: '/' // Ensure cookie is available for all paths
        });

        res.status(HttpStatus.CREATED).send({
            success: true,
            message: "User created successfully",
            data: userData,
        });
    } catch (error) {
        if (error instanceof zod.ZodError) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Validation error",
                errors: error.issues,
            });
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            error,
        });
    }
};

export const getUser = async (req: VerifiedRequest, res: Response) => {
    try {
        const req_user = req.user;
        const email = req.query.email as string;

        if (!email) {
            return res.status(HttpStatus.OK).json({ success: true, data: [] });
        }

        const users = await User.find({ email }).select('-password');
        
        res.status(HttpStatus.OK).json({ success: true, data: users });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch user", error });
    }
};
