const core = require('@actions/core');
const github = require('@actions/github');

async function run() {

	try {
		const [owner, repo] = process.env.GITHUB_WORKSPACE.split('/');
		
		const actionType = core.getInput('type');
		const body = core.getInput('body');

		console.log('Hello, world!');
		console.log(`Action type is : ${owner}`);
		console.log(`Action type is : ${repo}`);
		console.log(`Action type is : ${actionType}`);
		
	} catch (error) {
		
		core.setFailed( error.message );
	}
}

run();