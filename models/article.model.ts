import mongoose from "mongoose";
import { title } from "node:process";
const articleSchema = new mongoose.Schema({
    title: String,
    avatar: String,
    description: String,
    categoryId: String,
    deleted: { type: Boolean, default: false },
    deletedAt: Date
}, {
    timestamps: true
}); 
const Article =mongoose.model('Article', articleSchema, 'article');
export default Article;