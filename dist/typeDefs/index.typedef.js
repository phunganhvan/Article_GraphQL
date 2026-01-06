"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const article_typedef_1 = require("./article.typedef");
const category_typedef_1 = require("./category.typedef");
const user_typedef_1 = require("./user.typedef");
exports.typeDefs = [article_typedef_1.typeDefsArticle, category_typedef_1.typeDefsCategory, user_typedef_1.typeDefsUser];
