const core = require('@actions/core');
const github = require('@actions/github');
const { inspect } = require("util");

async function run() {

	try {
		
		const repository = core.getInput('repository');
		const actionType = core.getInput('type');
		const body = core.getInput('body');
		const issueNumber = core.getInput('number');
		
		const [owner, repo] = repository ? repository.split('/') : process.env.GITHUB_REPOSITORY.split('/');

		console.log('Hello, world!');
		console.log(`Environment : ${inspect(process.env)}`);
		console.log(`Repository : ${repository}`);
		console.log(`Owner : ${owner}`);
		console.log(`Repo : ${repo}`);
		console.log(`Action type is : ${actionType}`);
		console.log(`Issue number : ${issueNumber}`);
		console.log(`Body : ${body}`);
		
		
	} catch (error) {
		
		core.setFailed( error.message );
	}
}

run();