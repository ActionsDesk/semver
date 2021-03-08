import * as core from '@actions/core'
import {Inputs, Bumps, PreRelease} from './constants'
import {SemverInputs} from './version-inputs'

/**
 * Helper to get all the inputs for the action
 */
export function getInputs(): SemverInputs {
  const bump: Bumps = core.getInput(Inputs.Bump) as Bumps
  const preRelease = core.getInput(Inputs.PreRelease) as PreRelease
  //const preReleaseStr = core.getInput(Inputs.PreRelease)
  //const preRelease: PreRelease = parseInt(preReleaseStr) as PreRelease
  const prelabel = core.getInput(Inputs.Prelabel)
  const initialVersion = core.getInput(Inputs.InitialVersion)
  core.debug(`Initial version ${initialVersion}`)

  const inputs = {
    bump,
    preRelease,
    prelabel,
    initialVersion: initialVersion ? initialVersion : '0.1.0'
  } as SemverInputs

  /**
     if (bump == null) {
    core.setFailed(
      `Testing ${
        Inputs.Prelabel
      } input. Provided: ${pre}. Available options: ${Object.keys(Bumps)}`
    )
  }
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
