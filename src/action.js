const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
	const actionType = core.getInput('type');
	console.log('Hello, world!');
	console.log(`Action type is : ${actionType}!`);
}

run();