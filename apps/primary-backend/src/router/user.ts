import { Router} from 'express';
import {SigninSchema, SignupSchema, VerifySchema} from '../types/index.js';
import prismaClient from '@repo/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authMiddleware } from '../middleware.js';
import { sendEmail } from '../sendEmail.js';

const router = Router();

router.post("/signup", async (req, res) : Promise<any> => {
    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);
    
    if (!parsedData.success) {
        return res.status(411).json({ message: "Incorrect Inputs !" });
    }

    const isUserExist = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.email
        }
    })

    if (isUserExist) {
        return res.status(403).json({
            message: "User already exists"
        })
    }

    const hashedPwd = await bcrypt.hash(parsedData.data.password, 10);

    const user = await prismaClient.user.create({
        data: {
            email: parsedData.data.email,
            name: parsedData.data.username,
            password: hashedPwd,
            otp: Math.floor(1000 + Math.random() * 9000)
        }
    })

    // TODO
    const data = await sendEmail({email: user.email, username: user.name, otp: user.otp});

    if (!data.success) {
      return res.json({
        message: data.message
      });
    }

    return res.json({
        message: "Please verify your account by checking your email"
    });
})

router.post("/verify", async (req, res) : Promise<any> => {
    const body = req.body;

    const parsedData = VerifySchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.email
        }
    })

    if (!user) {
        return res.status(204)
                    .json({message: 'User not found'})
    }

    const isOtpValid = parsedData.data.otp === user.otp

    if (!isOtpValid) {
        return res.status(400)
                    .json({message: 'OTP is not valid, Please check email'})
    }

    await prismaClient.user.update({
        where: {
            email: parsedData.data.email
        },
        data: {
            isVerified: true
        }
    })

    res.status(200).json({message: "Verification successfully"});
})

router.post("/signin", async (req, res) : Promise<any> => {
    const body = req.body;
    const parsedData = SigninSchema.safeParse(body);

    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    
    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.email
        }
    });

    if (!user?.isVerified) {
        return res.status(403).json({message: "Please verify first"})
    }
    
    const isPwdValid = await bcrypt.compare(parsedData.data.password, user?.password as string);

    if (!isPwdValid) {
        return res.status(403).json({message: "Password is incorrect"})
    }

    if (!user) {
        return res.status(403).json({
            message: "Sorry credentials are incorrect"
        })
    }

    // sign the jwt
    const token = jwt.sign({
        id: user.id
    }, "secret");


    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
    })
      .json({ token, message: "Logged in" });
    // res.json({
    //     token: token,
    // });
})

router.get("/", authMiddleware, async (req, res) : Promise<any> => {
    // TODO: Fix the type
    // @ts-ignore
    const id = req.id;
    const user = await prismaClient.user.findFirst({
        where: {
            id
        },
        select: {
            name: true,
            email: true
        }
    });

    return res.json({
        user
    });
})

export const userRouter = router;