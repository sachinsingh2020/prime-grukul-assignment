import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import { User } from "../models/userModel.js";



export const register = catchAsyncError(async (req, res, next) => {
    // console.log("in the register")
    const { fullName, email, dateOfBirth, phoneNumber, password } = req.body;

    if (!fullName || !email || !dateOfBirth || !phoneNumber || !password) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    let user = await User.findOne({ email });

    if (user) {
        return next(new ErrorHandler("User already exists", 409));
    }

    user = await User.create({
        fullName,
        email,
        dateOfBirth,
        phoneNumber,
        password,
    });

    sendToken(res, user, "Registered Successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401));

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
        return next(new ErrorHandler("Incorrect Email or Password", 401));

    sendToken(res, user, `Welcome back, ${user.firstName}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
    res
        .status(200)
        .cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        .json({
            success: true,
            message: "Logged Out Successfully",
            isAuthenticated: false,
        });
});

export const getMe = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user,
    });
});


