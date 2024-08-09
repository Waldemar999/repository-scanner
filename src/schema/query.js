import { GraphQLObjectType } from 'graphql';
import { repositoryQuery, repositoryListQuery } from './queries/index.js';

export default new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        repository: repositoryQuery,
        repositoryList: repositoryListQuery,
    }),
});
