const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const octokit = github.getOctokit(GITHUB_TOKEN)

    const COMMENT_BODY = process.env.COMMENT_BODY
    const PR_NUMBER = process.env.PR_NUMBER

    const { context = {} } = github

    if (COMMENT_BODY.startsWith("deploy")) {
        const parts = COMMENT_BODY.split(" ")
        if (parts.length != 2) {
            await octokit.rest.issues.createComment({
                ...context.repo,
                issue_number: PR_NUMBER,
                body: 'Invalid deploy syntax, use "deploy {service-name}" e.g. "deploy activities-api"'
            })

            return
        }

        const service = parts[1]

        await octokit.rest.issues.createComment({
            ...context.repo,
            issue_number: PR_NUMBER,
            body: 'Deploying ${service} to production. Comment "finish deploy" to merge and close this PR, or "cancel deploy" to rollback to master and close this PR.'
        })

        core.setOutput("service", service)
    } else if (COMMENT_BODY.equals("finish deploy")) {
        await octokit.rest.issues.createComment({
            ...context.repo,
            issue_number: PR_NUMBER,
            body: 'Deploy complete.'
        })
    } else if (COMMENT_BODY.equals("cancel deploy")) {
        await octokit.rest.issues.createComment({
            ...context.repo,
            issue_number: PR_NUMBER,
            body: 'Rolling back.'
        })
    }
}

run()