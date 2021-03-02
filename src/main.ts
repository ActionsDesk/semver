import * as core from '@actions/core'
import * as github from '@actions/github'
import * as inputHelper from './input-helper'

async function run(): Promise<void> {
  try {
    const semverInputs = inputHelper.getInputs()
    core.debug(`Bump ${semverInputs.bump}`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    core.debug(`Pre ${semverInputs.pre}`)
    core.debug(`InitialVersion ${semverInputs.initialVersion}`)
    const token = core.getInput('github_token', {required: true})
    const octokit = github.getOctokit(token)
    let release = {
      data: {
        tag_name: semverInputs.initialVersion
      }
    }
    try {
      release = await octokit.repos.getLatestRelease({
        repo: github.context.repo.repo,
        owner: github.context.repo.owner
      })
      core.debug(release.data.tag_name)
    } catch (e) {
      if (e.status === 404) {
        core.debug(
          `No releases found for  {org: ${github.context.repo.repo}, repo: ${github.context.repo.repo}`
        )
        release = {
          data: {
            tag_name: 'v1.0.0'
          }
        }
      }
    }

    core.setOutput('release', release.data.tag_name)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error.message)
    core.setFailed(error.message)
  }
}

run()
