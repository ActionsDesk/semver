import * as core from '@actions/core'
import * as inputHelper from './input-helper'

async function run(): Promise<void> {
  try {
    core.debug(new Date().toTimeString())
    const semverInputs = inputHelper.getInputs()
    core.debug(`Bump ${semverInputs.bump}  ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    core.debug(semverInputs.pre)
    core.debug(semverInputs.initialVersion)
    core.setOutput('release', '1.0.0')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error.message)
    core.setFailed(error.message)
  }
}

run()
