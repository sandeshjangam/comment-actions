const core = require( '@actions/core' );
const github = require( '@actions/github' );
const { inspect } = require( 'util' );

async function run() {
	let owner; let repo;
	let actionType; let body;
	let issueNumber; let commentId;
	let searchTerm;

	const token = core.getInput( 'token' );
	const octokit = github.getOctokit( token );

	async function createComment() {
		const outVars = {
			comment_id: '',
			comment_body: '',
		};

		if ( !issueNumber ) {
			core.setFailed( 'Issue number is missing.' );
			return outVars;
		}

		if ( !body ) {
			core.setFailed( 'Comment body is missing.' );
			return outVars;
		}

		const { data: comment } = await octokit.rest.issues.createComment( {
			owner,
			repo,
			issue_number: issueNumber,
			body,
		} );

		core.info( `Created a comment on issue number: ${issueNumber}` );
		core.info( `Comment ID: ${comment.id}` );

		return {
			comment_id: comment.id,
			comment_body: comment.body,
		};
	}

	async function updateComment() {
		const outVars = {
			comment_id: '',
			comment_body: '',
		};

		if ( !commentId ) {
			core.setFailed( 'Commentd ID is missing.' );
			return outVars;
		}

		if ( !body ) {
			core.setFailed( 'Comment body is missing.' );
			return outVars;
		}

		let newComment = body;

		if ( actionType === 'append' ) {
			// Get an existing comment body.
			const { data: comment } = await octokit.rest.issues.getComment( {
				owner,
				repo,
				comment_id: commentId,
			} );

			newComment = `${comment.body}\n${body}`;
		}

		const { data: comment } = await octokit.rest.issues.updateComment( {
			owner,
			repo,
			comment_id: commentId,
			body: newComment,
		} );

		core.info( `Comment is modified. Comment ID: ${comment.id}` );

		return {
			comment_id: comment.id,
			comment_body: comment.body,
		};
	}

	async function findComment() {
		const outVars = {
			comment_id: '',
			comment_body: '',
		};

		if ( !issueNumber ) {
			core.setFailed( 'Issue number is missing.' );
			return outVars;
		}

		if ( !searchTerm ) {
			core.setFailed( 'Search term is missing.' );
			return outVars;
		}

		let foundComment = false;
		// eslint-disable-next-line no-restricted-syntax
		for await ( const { data: listComments } of
			octokit.paginate.iterator(
				octokit.rest.issues.listComments,
				{
					owner,
					repo,
					issue_number: issueNumber,
				},
			)
		) {
			// Search a comment which included user comment.
			const comment = listComments.find(
				// eslint-disable-next-line no-loop-func
				( listComment ) => listComment.body.includes( searchTerm ),
			);

			// If a comment found, return.
			if ( comment ) {
				foundComment = comment;
				break;
			}
		}

		if ( foundComment ) {
			core.info( `Comment found for a search term: '${searchTerm}'.` );
			core.info( `Comment ID: '${foundComment.id}'.` );

			return {
				comment_id: foundComment.id,
				comment_body: foundComment.body,
			};
		}

		core.info( 'Comment not found.' );

		return {
			comment_id: '',
			comment_body: '',
		};
	}

	async function deleteComment() {
		const outVars = {
			comment_id: '',
			comment_body: '',
		};

		if ( !commentId ) {
			core.setFailed( 'Commentd ID is missing.' );
			return outVars;
		}

		const response = await octokit.rest.issues.deleteComment( {
			owner,
			repo,
			comment_id: commentId,
		} );

		core.debug( `Delete response: ${inspect( response )}` );
		core.info( `Deleted a comment. Comment ID: ${commentId}` );

		return {
			comment_id: commentId,
			comment_body: '',
		};
	}

	try {
		const repository = core.getInput( 'repository' );
		[owner, repo] = repository ? repository.split( '/' ) : process.env.GITHUB_REPOSITORY.split( '/' );

		// Assign variables.
		actionType = core.getInput( 'type' );
		body = core.getInput( 'body' );
		issueNumber = core.getInput( 'number' );
		commentId = core.getInput( 'comment_id' );
		searchTerm = core.getInput( 'search_term' );

		let outVars = { comment_id: '', comment_body: '' };

		switch ( actionType ) {
		case 'create':
			outVars = await createComment();
			break;
		case 'update':
		case 'append':
			outVars = await updateComment();
			break;
		case 'find':
			outVars = await findComment();
			break;
		case 'delete':
			outVars = await deleteComment();
			break;
		default:
			break;
		}

		core.info( `comment_id : ${outVars.comment_id}` );
		core.info( `comment_body : ${outVars.comment_body}` );

		core.setOutput( 'comment_id', outVars.comment_id );
		core.setOutput( 'comment_body', outVars.comment_body );

		// console.log(`Environment : ${inspect(process.env)}`);
		// console.log(`Repository : ${repository}`);
		// console.log(`Owner : ${owner}`);
		// console.log(`Repo : ${repo}`);
	} catch ( error ) {
		core.setFailed( error.message );
	}
}

run();
