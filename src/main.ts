import * as core from '@actions/core'
import * as github from '@actions/github'
import * as inputHelper from './input-helper'
import {Semver} from './semver'

async function run(): Promise<void> {
  try {
    let isFirstRelease = false
    const semverInputs = inputHelper.getInputs()
    core.debug(`Bump ${semverInputs.bump}`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    core.debug(`PreRelease ${semverInputs.preRelease}`)
    core.debug(`Prelabel ${semverInputs.prelabel}`)
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
        isFirstRelease = true
        core.debug(
          `No releases found for org: ${github.context.repo.owner}, repo: ${github.context.repo.repo}; using default version ${semverInputs.initialVersion}`
        )
        release = {
          data: {
            tag_name: semverInputs.initialVersion
          }
        }
      }
    }

    const semver = new Semver(
      release.data.tag_name,
      isFirstRelease,
      semverInputs.bump,
      semverInputs.preRelease,
      semverInputs.prelabel
    )
    core.debug(`Semver is ${semver}`)
    const newTag = semver.getNextVersion()
    core.debug(`new tag = ${newTag}`)
    release = await octokit.repos.createRelease({
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      tag_name: newTag
    })
    core.debug(release.data.tag_name)
    core.setOutput('release', release.data.tag_name)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
