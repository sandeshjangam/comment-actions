const core = require('@actions/core');
const github = require('@actions/github');
const { inspect } = require("util");

async function run() {

	let owner, repo, actionType, body, issueNumber, commentId;

	const token = core.getInput( "token" );
	const octokit = github.getOctokit( token );

	async function updateComment() {
		
		if ( ! commentId ) {
			core.setFailed( "Commentd ID is missing.");
			return;
		}

		if ( ! body ) {
			core.setFailed("Comment body is missing.");
			return;
		}
		
		let newComment = body;

		if ( "append" === actionType ) {
			// Get an existing comment body.
			const { data: comment } = await octokit.rest.issues.getComment({
				owner: owner,
				repo: repo,
				comment_id: commentId,
			});
			
			newComment = comment.body + "\n" + body;
		  }

		await octokit.rest.issues.updateComment({
			owner: owner,
			repo: repo,
			comment_id: commentId,
			body: newComment,
		});
		
		core.info( `Comment is modified. Comment ID: '${commentId}'.`);
		
		core.setOutput( "comment_id", commentId );
	}

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
		
		core.setOutput( "comment_id", comment.id );
	}

	async function findComment() {
		
		if ( ! issueNumber ) {
			core.setFailed( "Issue number is missing.");
			return;
		}

		if ( ! body ) {
			core.setFailed("Comment body is missing.");
			return;
		}
		
		// const { data: comment } = 
		let found_comment = false;
		for await ( const { data: comments } of
			octokit.paginate.iterator(
				octokit.rest.issues.listComments,
				{
					owner: owner,
					repo: repo,
					issue_number: issueNumber,
				}
			)
		) {
			// Search a comment which included user comment.
			const comment = comments.find(
				comment => comment.body.includes( body )
			)

			// If a comment found, return.
			if ( comment ) {
				found_comment = comment;
				break;
			}
		}

		if ( found_comment ) {
			core.info( `Comment found for a body: '${body}'.` );
			core.info( `Comment ID: '${comment.id}'.`);
			
			core.setOutput('comment_id', comment.id );
      		core.setOutput( 'comment_body', comment.body );
		}else{
			core.info( `Comment not found.`);
		}
	}

	try {
		
		const repository = core.getInput('repository');
		[owner, repo] = repository ? repository.split('/') : process.env.GITHUB_REPOSITORY.split('/');
		
		// Assign variables.
		actionType = core.getInput('type');
		body = core.getInput('body');
		issueNumber = core.getInput('number');
		commentId = core.getInput('comment_id');
		
		switch ( actionType ) {
			case 'create':
				createComment();
				break;
			case 'update':
			case 'append':
				updateComment();
				break;
			case 'find':
				findComment();
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