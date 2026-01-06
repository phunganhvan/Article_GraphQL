import Article from '../models/article.model';
import Category from '../models/categories.model';

export const articleResolvers = {
    Query: {
        hello: () => {
            return 'Hello world!';
        },
        getListArticles: async (_: any, args) => {
            const {
                sortKey, 
                sortValue, 
                currentPage, 
                limitItem, 
                filterKey, 
                filterValue, 
                keyword
            } = args;
            const sort = {};
            // sort
            if( sortKey && sortValue ){
                sort[sortKey] = sortValue ;

            }
            // end sort


            //pagination
            let skip = 0;
            if( currentPage && limitItem ){
                skip = (currentPage -1) * limitItem;
            }
            // end pagination


            // filter
            const filter = {
                deleted: false
            };
            if( filterKey && filterValue ){
                filter[filterKey] = filterValue;
            }
            // end filter

            // keyword search
            if( keyword ){
                const keywordRegex = new RegExp(keyword, 'i'); // 'i' for case-insensitive
                filter["title"] = keywordRegex;
            }


            const articles = await Article.find(filter).sort(sort).limit(limitItem).skip(skip);
            return articles;
        },
        getArticle: async (_: any, args: { id: string }) => {
            const article = await Article.findOne({
                _id: args.id,
                deleted: false
            });
            return article;
        },
        
    },
    Mutation: {
        createArticle: async(_, args) =>{
            const {article} = args
            const record = new Article(article);
            await record.save();
            return record;
        },
        deleteArticle: async(_, args) =>{
            const {id} = args;
            await Article.updateOne({
                _id: id
            }, {
                deleted: true,
                deletedAt: new Date()
            });
            return "Delete successful";
        },
        updateArticle: async(_, args) =>{
            const {id, article} = args;
            await Article.updateOne({
                _id: id
            }, article);
            const record = await Article.findOne({
                _id: id
            });
            return record;
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