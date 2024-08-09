import { Octokit } from 'octokit';

const PREFIX_NAME = 'scanner-repo';

const handleError = (error, message) => {
	const err = error?.response?.data ? error.response.data : error;
	console.error(message, err);
	throw err;
}

export default class {
	constructor() {
		this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
	}

	async getRepositories() {
		try {
			const { data } = await this.octokit.request('GET /user/repos', {
				headers: { 'X-GitHub-Api-Version': '2022-11-28' }
			});

			const filteredRepos = data.filter(({ name }) => name.substring(0, 12) === PREFIX_NAME);

			return filteredRepos;
		} catch (error) {
			handleError(error, 'Get repositories error');
		}
	}

	async getRepository(name) {
		try {
			const { data } = await this.octokit.request(`GET /repos/${process.env.GITHUB_USER}/${name}`, {
				headers: { 'X-GitHub-Api-Version': '2022-11-28' }
			});

			return data;
		} catch (error) {
			handleError(error, 'Get repository error');
		}
	}

	async getMasterCommitSha(repoName) {
		try {
			const { data } = await this.octokit.request(`GET /repos/${process.env.GITHUB_USER}/${repoName}/branches/master`, {
				headers: { 'X-GitHub-Api-Version': '2022-11-28' }
			});

			return data;
		} catch (error) {
			handleError(error, 'Get repository tree SHA error');

		}
	}

	async getRepositoryTree(repoName) {
		try {
			const { commit: { sha } } = await this.getMasterCommitSha(repoName);

			const { data } = await this.octokit.request(`GET /repos/${process.env.GITHUB_USER}/${repoName}/git/trees/${sha}`, {
				headers: { 'X-GitHub-Api-Version': '2022-11-28' },
				recursive: true,
			});

			return data;
		} catch (error) {
			handleError(error, 'Get repository tree error');
		}
	}

	async getRepositoryFileCount(repoName) {
		try {
			const { tree } = await this.getRepositoryTree(repoName);

			return tree.length;
		} catch (error) {
			handleError(error, 'Get repository file count error');
		}
	}

	async getFileContent(repoName, filePath) {
		try {
			const { data: { content, encoding } } = await this.octokit.request(`GET /repos/${process.env.GITHUB_USER}/${repoName}/contents/${filePath}`, {
				headers: { 'X-GitHub-Api-Version': '2022-11-28' }
			});

			const convertedContent = Buffer.from(content, encoding).toString('utf-8');

			return convertedContent;
		} catch (error) {
			handleError(error, 'Get file content error');
		}
	}

	async getRepositoryWebhooks(repoName, isActive) {
		try {
			const { data } = await this.octokit.request(`GET /repos/${process.env.GITHUB_USER}/${repoName}/hooks`, {
				headers: { 'X-GitHub-Api-Version': '2022-11-28' }
			});

			const activeOrInactiveWebhooks = data.filter(({ active }) => active === isActive);

			return activeOrInactiveWebhooks.map(({ name }) => name);
		} catch (error) {
			handleError(error, 'Get repository webhooks error');
		}
	}
}
