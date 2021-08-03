# Smart Comment Actions

[![CI](https://github.com/sandeshjangam/comment-actions/workflows/CI/badge.svg)](https://github.com/sandeshjangam/comment-actions/actions?query=workflow%3ACI)

A GitHub action to create, update, append, prepend, delete or find a comment on pull request or issue.

## Inputs

### Create Comment

|     NAME      |                          DESCRIPTION                                         | REQUIRED |          DEFAULT           |
| ------------- | ---------------------------------------------------------------------------- | -------- | -------------------------- |
| `token`       | A GitHub token.                                                              | `false`  | `${{ github.token }}`      |
| `repository`  | Owner and repository name. e.g. `sandeshjangam/comment-actions`              | `false`  | `${{ github.repository }}` |
| `type`        | `create`                                                                     | `true`   | `N/A`                      |
| `body`        | Comment body. Required with `create` type.                                   | `true`   | `N/A`                      |
| `number`      | Number of the pull request or issue. Required with `create` and `find` type. | `true`   | `N/A`                      |
| `reactions`   | Add comma separated list of reactions to react on the comment. `+1`, `-1`, `laugh`, `hooray`, `confused`, `heart`, `rocket`, `eyes` | `false` | `N/A` |

### Update Comment

|     NAME      |                          DESCRIPTION                                         | REQUIRED |          DEFAULT           |
| ------------- | ---------------------------------------------------------------------------- | -------- | -------------------------- |
| `token`       | A GitHub token.                                                              | `false`  | `${{ github.token }}`      |
| `repository`  | Owner and repository name. e.g. `sandeshjangam/comment-actions`              | `false`  | `${{ github.repository }}` |
| `type`        | `update`, `append` or `prepend`                                              | `true`   | `N/A`                      |
| `body`        | Comment body. Required with `update`, `append` or `prepend`                  | `true`   | `N/A`                      |
| `comment_id`  | Comment id. Required with `update`, `append` or `prepend`                    | `true`   | `N/A`                      |
| `reactions`   | Add comma separated list of reactions to react on the comment. `+1`, `-1`, `laugh`, `hooray`, `confused`, `heart`, `rocket`, `eyes` | `false` | `N/A` |

### Delete Comment

|     NAME      |                          DESCRIPTION                                         | REQUIRED |          DEFAULT           |
| ------------- | ---------------------------------------------------------------------------- | -------- | -------------------------- |
| `token`       | A GitHub token.                                                              | `false`  | `${{ github.token }}`      |
| `repository`  | Owner and repository name. e.g. `sandeshjangam/comment-actions`              | `false`  | `${{ github.repository }}` |
| `type`        | `delete`                                                                     | `true`   | `N/A`                      |
| `comment_id`  | Comment id. Required `delete` type.                                          | `true`   | `N/A`                      |


### Find Comment

|     NAME      |                          DESCRIPTION                                         | REQUIRED |          DEFAULT           |
| ------------- | ---------------------------------------------------------------------------- | -------- | -------------------------- |
| `token`       | A GitHub token.                                                              | `false`  | `${{ github.token }}`      |
| `repository`  | Owner and repository name. e.g. `sandeshjangam/comment-actions`              | `false`  | `${{ github.repository }}` |
| `type`        | `find`                                                                       | `true`   | `N/A`                      |
| `number`      | Number of the pull request or issue. Required with `find` type.              | `true`   | `N/A`                      |
| `search_term` | Search in body. Can use with conjunction of `author` arg.                    | `true`   | `N/A`                      |
| `author`      | GitHub user name of the comment author.                                      | `false`  | `N/A`                      |

Note - To find a comment you can use either search_term or author and search_term both.

## Outputs

- `comment_id`: Comment ID. It will return comment id to all types. Empty for `find` if not found.
- `comment_body`: Comment body. Empty string for `delete` & `find` if not found.

## Notes
- `number` - Use `${{ github.event.issue.number }}` or `${{ github.event.pull_request.number }}` to get a pull request or issue number.

## Simple Examples

### Create Comment

```yml
name: Create a comment
on:
  pull_request:
    types: [opened,synchronize]

jobs:
  build:
    name: Smart Comment Actions
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Create a comment
        uses: sandeshjangam/comment-actions@v1
        with:
          type: "create"
          body: "Test comment on PR"
          number: ${{ github.event.pull_request.number }}
          reactions: +1, hooray, heart, rocket
```

### Update Comment (It will replace a comment)

```yml
      - name: Update a comment
        uses: sandeshjangam/comment-actions@v1
        id: update_comment
        with:
          type: "update"
          body: "Edit: The test comment is modified"
          comment_id: 856978218
          reactions: hooray, rocket
```

### Delete Comment

```yml
      - name: Delete a comment.
        uses: sandeshjangam/comment-actions@v1
        with:
          type: "delete"
          comment_id: 856978218
```

## Complex Examples
### Create, Update and Append Comment

```yml
name: Create, Update and Append Comment
on:
  pull_request:
    types: [opened,synchronize]

jobs:
  build:
    name: Smart Comment Actions
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Create a comment
        uses: sandeshjangam/comment-actions@v1
        id: new_comment
        with:
          type: "create"
          body: "Test comment on PR"
          number: ${{ github.event.pull_request.number }}

      - name: Update a comment
        uses: sandeshjangam/comment-actions@v1
        id: update_comment
        with:
          type: "update"
          body: "Edit: The test comment is modified"
          comment_id: ${{ steps.new_comment.outputs.comment_id }}

      - name: Append to comment 
        uses: sandeshjangam/comment-actions@v1
        with:
          type: "append"
          body: "Append: Add new body at the end of the comment."
          comment_id: ${{ steps.new_comment.outputs.comment_id }}
```
### Delete Comment

```yml
name: Create and Delete Comment
on:
  pull_request:
    types: [opened,synchronize]

jobs:
  build:
    name: Smart Comment Actions
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Create a comment 
        uses: sandeshjangam/comment-actions@v1
        id: create_delete_comment
        with:
          type: "create"
          body: "To check the delete action"
          number: ${{ github.event.pull_request.number }}

      - name: Find a comment using a search term.
        uses: sandeshjangam/comment-actions@v1
        id: find_comment
        with:
          type: "find"
          search_term: "To check the delete action"
          number: ${{ github.event.pull_request.number }}

      - name: Delete a comment.
        uses: sandeshjangam/comment-actions@v1
        id: delete_comment
        if: ${{ steps.find_comment.outputs.comment_id != '' }}
        with:
          type: "delete"
          comment_id: ${{ steps.find_comment.outputs.comment_id }}
```

## License

[MIT](LICENSE)