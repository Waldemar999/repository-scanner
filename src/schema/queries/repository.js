import {
	GraphQLBoolean,
	GraphQLFloat,
	GraphQLInt,
	GraphQLNonNull,
	GraphQLString,
	GraphQLList,
	GraphQLObjectType
} from 'graphql';

const repositoryType = new GraphQLObjectType({
	name: 'Repository',
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
		private: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'Repository availability',
			resolve: (obj) => obj.private,
		},
		fileCount: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Number of files in the repository',
			resolve: ({ fileCount }) => fileCount,
		},
		yml: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'Content of a yml file',
			resolve: ({ yml }) => yml,
		},
		activeWebhooks: {
			type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
			description: 'List of active repository webhooks',
			resolve: ({ activeWebhooks }) => activeWebhooks,
		},
	}),
});

export default {
	type: repositoryType,
	args: {
		name: {
			type: new GraphQLNonNull(GraphQLString),
		},
		ymlPath: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	resolve: async (_, { name: repoName, ymlPath }, context) => {
		const [
			{
				name,
				size,
				owner: { login },
				private: isPrivate,
			},
			fileCount,
			ymlContent,
			activeWebhooks,
		] = await Promise.all([
			context.services.github.getRepository(repoName),
			context.services.github.getRepositoryFileCount(repoName),
			context.services.github.getFileContent(repoName, ymlPath),
			context.services.github.getRepositoryWebhooks(repoName, false),
		]);

		return {
			name,
			size,
			owner: login,
			private: isPrivate,
			fileCount,
			yml: ymlContent,
			activeWebhooks,
		};
	},
};
