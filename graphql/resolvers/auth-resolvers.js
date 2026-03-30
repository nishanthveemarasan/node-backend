import UserModel from "../../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GraphQLError } from "graphql";
class AuthResolvers {

    static login = async (_, args, context) => {
        try{
            const { username, password } = args;    
            const user = await UserModel.findByEmail(username);
            if (!user) {
                throw new GraphQLError("Invalid username or password", {
                    extensions: {
                        code: 500,
                    },
                });
            }
            const isMatch = await bcrypt.compare(password, user.password);
    
            if (!isMatch) {
                throw new GraphQLError("Invalid username or password", {
                    extensions: {
                        code: 500,
                    },
                });
            }
             const token = jwt.sign({userId: user.id, email:user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
            return { token, message: "Login successful" };
        }catch(err){
            throw new GraphQLError(err.message, {
                extensions: {
                    code: err.extensions?.code || 500,
                },
            });
        }
    }

    static signUp = async (obj,args, context) => {
        try{
            const { name, email, password, password_confirmation } = args;
            const errors = [];
            if (validator.isEmpty(name)) {
                errors.push("Name is required");
            }
            if(!validator.isEmail(email)){
                errors.push("Invalid email");
            }
            if(!validator.isLength(password, { min: 6 })){
                errors.push("Password must be at least 6 characters long");
            }
            if(password !== password_confirmation){
                errors.push("Password confirmation does not match password");
            }
            const userExists = await UserModal.findByEmail(email);
            if (userExists) {
                errors.push("User already exists");
            }
            if(errors.length > 0){
                throw new GraphQLError("Validation failed", {
                    extensions: {
                        code:422,
                        data: errors,
                    },
                });
               }
            if (password !== password_confirmation) {
                throw new Error("Password confirmation does not match password");
            }
            const hashPassword = await bcrypt.hash(password, 12 );
            const newUser = new UserModal(null, name, email, hashPassword);
            const user = await newUser.save();
            return user;

        }catch(err){
            throw new GraphQLError(err.message, {
                extensions: {
                    code: err.extensions?.code || 500,
                },
            });
        }
    }
}

export default AuthResolvers;