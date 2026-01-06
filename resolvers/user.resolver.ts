import { ppid } from "node:process";
import User from "../models/user.model";
import md5 from "md5";
import { generateRandomString } from "../helpers/generate";
import { Query } from "mongoose";
export const userResolvers = {
    Query: {
        getUser: async (_: any, args, context) => {
            // console.log('Context in getUser:', context);
            const infoUser = await User.findOne({
                token: context["info"].token,
                deleted: false
            });
            
            if(!infoUser){
                return {
                    code: 404,
                    message: "User not found",
                    user: null
                }
            }
            else {
                return {
                    code: 200,
                    message: "User found",
                    fullName: infoUser.fullName,
                    email: infoUser.email,
                    token: infoUser.token
                };
            }
        }
    },

    Mutation: {
        registerUser: async (_: any, args) => {
            const { user } = args;
            const emailExist = await User.findOne({ email: user.email });
            if (emailExist) {
                // throw new Error("Email already exists");
                return {
                    code: 400,
                    message: "Email already exists",
                    user: null
                }
            }else{
                const newUser = new User({
                    fullName: user.fullName,
                    email: user.email,
                    password: md5(user.password),
                    token: generateRandomString(24), // You need to implement this function to generate a token
                });
                const savedUser = await newUser.save();

                return {
                    code: 200,
                    success: true,
                    message: "User registered successfully",
                    fullName: user.fullName,
                    email: user.email,
                    token: savedUser.token

                };
            }

        },
        loginUser: async (_: any, args) => {
            const { user } = args;
            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                return {
                    code: 404,
                    message: "User not found",
                    user: null
                }
            }
            const hashedPassword = md5(user.password);
            if (existingUser.password !== hashedPassword) {
                return {
                    code: 401,
                    message: "Invalid password",
                    user: null
                }
            }
            return {
                code: 200,
                message: "Login successful",
                fullName: existingUser.fullName,
                email: existingUser.email,
                token: existingUser.token
            };
        }
    }
}