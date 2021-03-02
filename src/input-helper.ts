import * as core from '@actions/core'
import {Inputs, Bumps} from './constants'
import {SemverInputs} from './version-inputs'

/**
 * Helper to get all the inputs for the action
 */
export function getInputs(): SemverInputs {
  const bump = core.getInput(Inputs.Bump, {required: true})
  const pre = core.getInput(Inputs.Pre)
  const initialVersion = core.getInput(Inputs.InitialVersion)

  if (pre == null) {
    core.setFailed(
      `Testing ${
        Inputs.Pre
      } input. Provided: ${pre}. Available options: ${Object.keys(Bumps)}`
    )
  }

  const inputs = {
    bump,
    pre,
    initialVersion: initialVersion ? initialVersion : 'v1.0.0'
  } as SemverInputs

  /**
   * const retentionDaysStr = core.getInput(Inputs.RetentionDays)
    if (retentionDaysStr) {
       inputs.retentionDays = parseInt(retentionDaysStr)
    if (isNaN(inputs.retentionDays)) {
      core.setFailed('Invalid retention-days')
    }
  }
 */

  return inputs
}
