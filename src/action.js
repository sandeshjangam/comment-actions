const core = require('@actions/core');
const github = require('@actions/github');

async function run() {

	try {
		const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
		
		const actionType = core.getInput('type');
		const body = core.getInput('body');

		console.log('Hello, world!');
		console.log(`Environment : ${process.env}`);
		console.log(`Owner : ${owner}`);
		console.log(`Repo : ${repo}`);
		console.log(`Action type is : ${actionType}`);
		
	} catch (error) {
		
		core.setFailed( error.message );
	}
}

run();