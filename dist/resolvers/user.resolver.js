"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolvers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const md5_1 = __importDefault(require("md5"));
const generate_1 = require("../helpers/generate");
exports.userResolvers = {
    Query: {
        getUser: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const infoUser = yield user_model_1.default.findOne({
                token: context["info"].token,
                deleted: false
            });
            if (!infoUser) {
                return {
                    code: 404,
                    message: "User not found",
                    user: null
                };
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
        })
    },
    Mutation: {
        registerUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { user } = args;
            const emailExist = yield user_model_1.default.findOne({ email: user.email });
            if (emailExist) {
                return {
                    code: 400,
                    message: "Email already exists",
                    user: null
                };
            }
            else {
                const newUser = new user_model_1.default({
                    fullName: user.fullName,
                    email: user.email,
                    password: (0, md5_1.default)(user.password),
                    token: (0, generate_1.generateRandomString)(24),
                });
                const savedUser = yield newUser.save();
                return {
                    code: 200,
                    success: true,
                    message: "User registered successfully",
                    fullName: user.fullName,
                    email: user.email,
                    token: savedUser.token
                };
            }
        }),
        loginUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { user } = args;
            const existingUser = yield user_model_1.default.findOne({ email: user.email });
            if (!existingUser) {
                return {
                    code: 404,
                    message: "User not found",
                    user: null
                };
            }
            const hashedPassword = (0, md5_1.default)(user.password);
            if (existingUser.password !== hashedPassword) {
                return {
                    code: 401,
                    message: "Invalid password",
                    user: null
                };
            }
            return {
                code: 200,
                message: "Login successful",
                fullName: existingUser.fullName,
                email: existingUser.email,
                token: existingUser.token
            };
        })
    }
};
