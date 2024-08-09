import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLFloat,
	GraphQLString,
	GraphQLList
} from 'graphql';

const repositoryListType = new GraphQLObjectType({
	name: 'RepositoryList',
	fields: () => ({
		// TODO: implement pagination and sorting
		list: {
			type: new GraphQLNonNull(new GraphQLList(new GraphQLObjectType({
				name: 'RepositoryListData',
				fields: () => ({
					name: {
						type: new GraphQLNonNull(GraphQLString),
						description: 'Repository name',
						resolve: ({ name }) => name,
					},
					size: {
						type: new GraphQLNonNull(GraphQLFloat),
						description: 'Repository size',
						resolve: ({ size }) => size,
					},
					owner: {
						type: new GraphQLNonNull(GraphQLString),
						description: 'Repository owner',
						resolve: ({ owner }) => owner,
					},
				}),
			}))),
			description: 'A list of repositories',
			resolve: ({ list }) => list,
		}
	})
});

export default {
	type: repositoryListType,
	resolve: async (_, args, context) => {
		const repos = await context.services.github.getRepositories();

		return {
			list: repos.map(({ name, owner, size }) => ({ name, owner: owner.login, size })),
		};
	},
};
