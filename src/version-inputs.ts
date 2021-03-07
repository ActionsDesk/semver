import {Bumps} from './constants'

export interface SemverInputs {
  /**
   * Bump the version number semantically. The value must be one of: \n
   * major: Bump the major version number, e.g. 1.0.0 -> 2.0.0.\n
   * minor: Bump the minor version number, e.g. 0.1.0 -> 0.2.0.\n
   * patch: Bump the patch version number, e.g. 0.0.1 -> 0.0.2.\n
   * final: Promote the version to a final version, e.g. 1.0.0-rc.1 -> 1.0.0.
   */
  bump: Bumps

  /**
   * Optional. When bumping, bump to a prerelease (e.g. rc or alpha), or bump an existing prerelease.
   * If present, and the version is already a prerelease matching this value, its number is bumped.
   * If the version is already a prerelease of another type, (e.g. alpha vs. beta), the type is switched
   * and the prerelease version is reset to 1. If the version is not already a pre-release,
   * then pre is added, starting at 1.
   *
   * The value of pre can be anything you like; the value will be pre-pended (hah) to a numeric value.
   * For example,
   * pre: build will result in a semver of x.y.z-build.<number>,
   * pre: alpha becomes x.y.z-alpha.<number>,
   * and pre: my-preferred-naming-convention becomes x.y.z-my-preferred-naming-convention.<number>
   */
  prelabel: string

  /**
   * The version number to use when , i.e. when there are no existing releases
   * present in the repository.
   */
  initialVersion: string
}
