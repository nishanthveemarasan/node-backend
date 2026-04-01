import UserModal from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../util/mailer.js';
import { generateResetToken } from '../util/auth-helper.js';
import prisma from '../util/prismaClient.js';
import RefreshTokenModel from '../models/refresh-token.js';


class AuthController{
    static login = async (req, res, next) => {
        try{
            const {token, refreshToken} = await prisma.$transaction(async (prisma) => {
                const {username, password} = req.body;
                const user = await UserModal.findByEmail(username);
                if(!user){
                    return res.status(400).json({message: "Invalid username or password"});
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if(!isMatch){
                    return res.status(400).json({message: "Invalid username or password"});
                }
                const token = jwt.sign({userId: user.id, email:user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
                const refreshToken = await generateResetToken(user.id);
                return {token, refreshToken};
            });
            res.status(200).json({message: "Login successful", token, refreshToken});
        }catch(err){
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    static signUp = async(req, res, next) =>{
        try{
            const {name, email, password, password_confirmation} = req.body;
            const hashPassword = await bcrypt.hash(password, 12 );
            const newUser = new UserModal(null, name, email, hashPassword);
            await newUser.save();
            await transporter.sendMail({
                from: '"Node Backend" <node@backend.com>',
                to: email,
                subject: "Welcome to Node Backend",
                html: `<p>Hello ${name},</p><p>Thank you for signing up to our service! We're excited to have you on board.</p><p>Best regards,<br>The Node Backend Team</p>`
            });
            res.status(200).json({message: "Sign Up successful"});
        }catch(err){
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    static refreshAccessToken = async(req, res, next) =>{
        try{
            const {refreshToken} = req.body;
            const getRefreshToken = await RefreshTokenModel.findByToken(refreshToken);
            const user = await UserModal.findById(getRefreshToken.userId);
            const nreRefreshToken = await generateResetToken(user.id); 
            const token = jwt.sign({userId: user.id, email:user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
            res.status(200).json({message: "Access token refreshed successfully", token, refreshToken: nreRefreshToken});
        }catch(err){
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    }
}

export default AuthController;