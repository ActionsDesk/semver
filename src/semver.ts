import {Bumps} from './constants'
import * as core from '@actions/core'

export class Semver {
  currentVersion: string
  bump: Bumps
  isFirstRelease: boolean
  prelabel: string

  constructor(
    currentVersion: string,
    isFirstRelease: boolean,
    bump: Bumps,
    prelabel?: string
  ) {
    this.prelabel = 'alpha'
    this.currentVersion = currentVersion
    this.bump = bump
    if (prelabel) {
      this.prelabel = prelabel
    }
    this.isFirstRelease = isFirstRelease
  }
  getNextVersion(): string {
    if (!this.isFirstRelease) {
      const regexstr = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm
      const versionparts = this.currentVersion.split(regexstr).filter(s => {
        return s !== null && s !== ''
      })
      core.debug(`Version Parts are ${versionparts}`)
      if (versionparts != null) {
        const parts = versionparts.slice(0, 3).map(s => parseInt(s))
        let prebuild = versionparts[3]
          ? versionparts[3].split('.')
          : [this.prelabel, '0']
        core.debug(`Parts are ${parts}`)
        switch (this.bump) {
          case Bumps.major:
            ++parts[0]
            parts[1] = 0
            parts[2] = 0
            prebuild = []
            break
          case Bumps.minor:
            ++parts[1]
            parts[2] = 0
            prebuild = []
            break
          case Bumps.patch:
            ++parts[2]
            prebuild = []
            break
          case Bumps.pre:
            core.debug(`Prebuild is ${prebuild}`)
            if (prebuild.length === 2 && prebuild[0] === this.prelabel) {
              prebuild[1] = (parseInt(prebuild[1]) + 1).toString()
            } else {
              prebuild[0] = this.prelabel
              prebuild[1] = '1'
            }
            break
          default:
            throw new Error(`Invalid Bump ${this.bump}`)
        }
        return this.bump === Bumps.pre
          ? `${parts.join('.')}-${prebuild.join('.')}`
          : `${parts.join('.')}`
      }
    }
    return this.currentVersion
  }
}
