const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const octokit = github.getOctokit(GITHUB_TOKEN)

    const { context = {} } = github
    const { pull_request } = context.payload

    console.log('pr number' + pull_request.number)
    console.log(context)
    console.log(octokit)

    await octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: pull_request.number,
        body: 'Thanks'
    })
}

run()