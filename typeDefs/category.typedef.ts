import { gql } from 'apollo-server-express';
export const typeDefsCategory = gql`
    
    type Category {
        id: ID,
        title: String,
        description: String,
        avatar: String,
    }
    type Query {
        
        getListCategories: [Category],
        getCategory(id: ID): Category
    }
    
    input CategoryInput{
        title: String,
        description: String,
        avatar: String,
    }
    # Add update delete
    type Mutation {     
        createCategory(
            category: CategoryInput
        ): Category

        updateCategory(
            id: ID, 
            category: CategoryInput
        ): Category

        deleteCategory(id: ID): String
    }
`;