const core = require('@actions/core');
const github = require('@actions/github');
const { inspect } = require("util");

async function run() {

	let actionType, body, issueNumber, owner, repo;

	const token = core.getInput( "token" );
	const octokit = github.getOctokit( token );

	async function createComment() {
		
		if ( ! issueNumber ) {
			core.setFailed( "Issue number is missing.");
			return;
		}

		if ( ! body ) {
			core.setFailed("Comment body is missing.");
			return;
		}
		
		const { data: comment } = await octokit.rest.issues.createComment({
			owner: owner,
			repo: repo,
			issue_number: issueNumber,
			body: body,
		});
		
		core.info( `Created a comment on issue number: '${issueNumber}'.` );
		core.info( `Comment ID: '${comment.id}'.`);
		
		core.setOutput("comment-id", comment.id);
	}

	try {
		
		const repository = core.getInput('repository');
		
		// Assign variables.
		actionType = core.getInput('type');
		body = core.getInput('body');
		issueNumber = core.getInput('number');
		[owner, repo] = repository ? repository.split('/') : process.env.GITHUB_REPOSITORY.split('/');
		
		switch ( actionType ) {
			case 'create':
				createComment();
				break;
			default:
				break;
		}
		// console.log('Hello, world!');
		// console.log(`Environment : ${inspect(process.env)}`);
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