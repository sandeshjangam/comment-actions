const core = require('@actions/core');
const github = require('@actions/github');
const { inspect } = require("util");

async function run() {

	let actionType, body, issueNumber, owner, repo;

	// function create_comment() {
		
	// 	if (inputs.issueNumber) {
	// 		// Create a comment
	// 		if (!inputs.body) {
	// 			core.setFailed("Missing comment 'body'.");
	// 			return;
	// 		}
	// 		const { data: comment } = await octokit.rest.issues.createComment({
	// 			owner: repo[0],
	// 			repo: repo[1],
	// 			issue_number: inputs.issueNumber,
	// 			body: inputs.body,
	// 		});
	// 		core.info(
	// 			`Created comment id '${comment.id}' on issue '${inputs.issueNumber}'.`
	// 		);
	// 		core.setOutput("comment-id", comment.id);
	// 	}
	// }

	try {
		
		const repository = core.getInput('repository');
		
		// Assign variables.
		actionType = core.getInput('type');
		body = core.getInput('body');
		issueNumber = core.getInput('number');
		[owner, repo] = repository ? repository.split('/') : process.env.GITHUB_REPOSITORY.split('/');
		

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