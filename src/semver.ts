import {Bumps, PreRelease} from './constants'
import * as core from '@actions/core'

export class Semver {
  currentVersion: string
  bump?: Bumps
  preRelease?: PreRelease
  isFirstRelease: boolean
  prelabel?: string

  constructor(
    currentVersion: string,
    isFirstRelease: boolean,
    bump?: Bumps,
    preRelease?: PreRelease,
    prelabel?: string
  ) {
    if (
      !isFirstRelease &&
      typeof bump === 'undefined' &&
      typeof preRelease === 'undefined'
    ) {
      throw Error(
        'Invalid Semver Operation: At least one of Bump or PreRelease has to be defined or IsFirstRelease must be true'
      )
    }
    this.currentVersion = currentVersion
    this.bump = bump
    if (this.bump !== Bumps.final) {
      this.preRelease = preRelease
    }
    this.prelabel = prelabel ? prelabel : 'alpha'

    this.isFirstRelease = isFirstRelease
  }
  getNextVersion(): string {
    const regexstr = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm
    const versionparts = this.currentVersion.split(regexstr).filter(s => {
      return s !== null && s !== ''
    })
    core.debug(`Version Parts are ${versionparts}`)
    if (versionparts != null) {
      const parts = versionparts.slice(0, 3).map(s => parseInt(s))
      core.debug(`Parts are ${parts}`)
      if (this.bump === Bumps.final && !versionparts[3]) {
        throw Error(
          'Invalid Semver Operation: Cannot do Bump Final and not have the previous release as a PreRelease'
        )
      }
      const prebuild = versionparts[3]
        ? versionparts[3].split('.')
        : [this.prelabel, '0']
      core.debug(`prebuild is ${prebuild}`)
      switch (this.bump) {
        case Bumps.major:
          if (!this.isFirstRelease) {
            ++parts[0]
            parts[1] = 0
            parts[2] = 0
          }
          //prebuild = []
          break
        case Bumps.minor:
          if (!this.isFirstRelease) {
            ++parts[1]
            parts[2] = 0
          }
          //prebuild = []
          break
        case Bumps.patch:
          if (!this.isFirstRelease) {
            ++parts[2]
          }
          //prebuild = []
          break
        case Bumps.final:
          break
        default:
          if (!this.preRelease && !this.isFirstRelease) {
            throw new Error(`Invalid Bump ${this.bump}`)
          }
      }
      switch (this.preRelease) {
        case PreRelease.withBuildNumber:
          core.debug(`Prebuild is ${prebuild}`)
          if (prebuild.length === 2 && prebuild[0] === this.prelabel) {
            prebuild[1] = (
              parseInt(prebuild[1] ? prebuild[1] : '0') + 1
            ).toString()
          } else {
            prebuild[0] = this.prelabel
            prebuild[1] = '1'
          }
          break
      }
      return this.preRelease
        ? `${parts.join('.')}-${prebuild.join('.')}`
        : `${parts.join('.')}`
    }

    return this.currentVersion
  }
}
