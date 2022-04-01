const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const octokit = github.getOctokit(GITHUB_TOKEN)

    const COMMENT_BODY = process.env.COMMENT_BODY
    const PR_NUMBER = process.env.PR_NUMBER

    const { context = {} } = github

    await octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: PR_NUMBER,
        body: 'Thanks you entered ' + COMMENT_BODY
    })
}

run()