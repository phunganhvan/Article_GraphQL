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
exports.articleResolvers = void 0;
const article_model_1 = __importDefault(require("../models/article.model"));
const categories_model_1 = __importDefault(require("../models/categories.model"));
exports.articleResolvers = {
    Query: {
        hello: () => {
            return 'Hello world!';
        },
        getListArticles: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { sortKey, sortValue, currentPage, limitItem, filterKey, filterValue, keyword } = args;
            const sort = {};
            if (sortKey && sortValue) {
                sort[sortKey] = sortValue;
            }
            let skip = 0;
            if (currentPage && limitItem) {
                skip = (currentPage - 1) * limitItem;
            }
            const filter = {
                deleted: false
            };
            if (filterKey && filterValue) {
                filter[filterKey] = filterValue;
            }
            if (keyword) {
                const keywordRegex = new RegExp(keyword, 'i');
                filter["title"] = keywordRegex;
            }
            const articles = yield article_model_1.default.find(filter).sort(sort).limit(limitItem).skip(skip);
            return articles;
        }),
        getArticle: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const article = yield article_model_1.default.findOne({
                _id: args.id,
                deleted: false
            });
            return article;
        }),
    },
    Mutation: {
        createArticle: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { article } = args;
            const record = new article_model_1.default(article);
            yield record.save();
            return record;
        }),
        deleteArticle: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = args;
            yield article_model_1.default.updateOne({
                _id: id
            }, {
                deleted: true,
                deletedAt: new Date()
            });
            return "Delete successful";
        }),
        updateArticle: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { id, article } = args;
            yield article_model_1.default.updateOne({
                _id: id
            }, article);
            const record = yield article_model_1.default.findOne({
                _id: id
            });
            return record;
        })
    },
    Article: {
        category: (article) => __awaiter(void 0, void 0, void 0, function* () {
            const categoryId = article.categoryId;
            const category = yield categories_model_1.default.findOne({
                _id: categoryId,
                deleted: false
            });
            return category;
        })
    }
};
