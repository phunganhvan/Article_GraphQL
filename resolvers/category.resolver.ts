import Article from '../models/article.model';
import Category from '../models/categories.model';
export const categoryResolvers = {
    Query: {
        getListCategories: async () => {
            const categories = await Category.find({
                deleted: false
            });
            return categories;
        },
        getCategory: async (_: any, args: { id: string }) => {
            const category = await Category.findOne({
                _id: args.id,
                deleted: false
            });
            return category;
        }
    },
    Mutation: {
        createCategory: async(_, args) =>{
            const {category} = args
            const record = new Category(category);
            await record.save();
            return record;  
        },
        updateCategory: async(_, args) =>{
            const {id, category} = args;
            await Category.updateOne({
                _id: id
            }, category);
            const record = await Category.findOne({
                _id: id
            });
            return record;
        },
        deleteCategory: async(_, args) =>{
            const {id} = args;
            await Category.updateOne({
                _id: id
            }, {
                deleted: true,
                deletedAt: new Date()
            });
            return "Delete successful";
        }
    },
    Article: {
        category: async (article) =>{
            const categoryId= article.categoryId;
            const category = await Category.findOne({
                _id: categoryId,
                deleted: false
            });
            return category;
        }
    }
};