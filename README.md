# semver action

This is a **GitHub Action** for [`Semantic versioning`](https://semver.org)  
This is inspired by [Concourse Semver resource](https://github.com/concourse/semver-resource). 

## Table of Contents

- [semver action](#semver-action)
  - [Table of Contents](#table-of-contents)
  - [How it Works](#how-it-works)
  - [How to use](#how-to-use)
    - [Example connecting GitHub Action Workflow](#example-connecting-github-action-workflow)
  - [Limitations](#limitations)
  - [How to contribute](#how-to-contribute)
    - [License](#license)

## How it Works

The action takes the following inputs:

- **bump**: Bump the version number semantically. 
  - **required**: true
  - **default**: 'minor'
  The value must be one of: 
  - *major*: Create a release after bumping the major version number. e.g. 1.0.0 -> 2.0.0.
  - *minor*: Create a release after bumping the minor version number. e.g. 0.1.0 -> 0.2.0.
  - *patch*: Create a release after bumping the patch version number. e.g. 0.1.0 -> 0.1.2.
  - *pre*: Create a release after as a pre-release. e.g. the version e.g. 0.1.0 > 0.1.0-alpha.1
  - *final*: Promote the version to a final version, e.g. 1.0.0-rc.1 -> 1.0.0.'
  When bumping to a pre-release, if the previous version is already a pre-release, it would bump the `build number`. If it is a new pre-release the `build number` would default at `1`. If the version is a prerelease of another type, (e.g. `label` is alpha vs. beta), the type is switched and the prerelease version is reset to 1. If the version is not already a pre-release, then `label` is added, starting at 1.

- **prelabel**: The value can be any string. This would bump to a pre-release version.
  - ​**required**: false

- **initial_version**: If there is no current version, the bump will be based on initial_version or 0.1.0
  - **required**: false
  - **default**: 0.1.0

## How to use

To use this **GitHub** Action you will need to complete the following:

1. Add the task in your workflow where you see fit. You can use the example below as a reference.
1. Modify the example to pass the correct values for `bump`. Values for `pre`, `initial_version` are optional.

### Example connecting GitHub Action Workflow

In your repository you should have a `.github/workflows` folder with **GitHub** Action similar to below:

- `.github/workflows/test.yml`

This file should look like the following:

```yml
---
name: "sample-workflow"
on:
  pull_request:
  push:
    branches:
      - main
      - 'releases/*'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: decyjphr-actions/semver
      with:
        bump: pre
        prelabel: beta
```

## Limitations

- When creating a pre-release it does not use the `pre-release` setting in GitHub. This would be fixed later.
- It does not create a pre-release without a `build number`. For e.g. `0.1.0` would be bumped to `0.1.0-alpha.1` but not to `0.1.0-alpha`.  

## How to contribute

If you would like to help contribute to this **GitHub** Action, please see [CONTRIBUTING](https://github.com/decyjphr-actions/semver/blob/master/.github/CONTRIBUTING.md)

---

### License

- [MIT License](https://github.com/decyjphr-actions/workflow-dispatch/blob/master/LICENSE)
