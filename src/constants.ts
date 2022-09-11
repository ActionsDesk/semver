export enum Inputs {
  Bump = 'bump',
  Prelabel = 'prelabel',
  InitialVersion = 'initial_version',
  PreRelease = 'prerelease',
  Commitish = 'commitish'
}

export enum Outputs {
  Release = 'release'
}
/*
export enum PreRelease {
  none = 0,
  withBuildNumber,
  withoutBuildNumber
}

*/
export enum PreRelease {
  withBuildNumber = 'withBuildNumber',
  withoutBuildNumber = 'withOutBuildNumber'
}

export enum Bumps {
  major = 'major',
  minor = 'minor',
  patch = 'patch',
  pre = 'pre',
  final = 'final'
}
