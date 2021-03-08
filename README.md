# Semver action

This is a **GitHub Action** for creating releases using [**Semantic versioning**](https://semver.org).

It automatically increments the version number from the latest release using the [bumping semantics shown below](#how-it-works).

This action modelled after [Concourse Semver resource](https://github.com/concourse/semver-resource) which is used in [Concourse pipelines](https://concourse-ci.org/).

## Table of Contents

- [Semver action](#semver-action)
  - [Table of Contents](#table-of-contents)
  - [How it works](#how-it-works)
  - [How to use](#how-to-use)
    - [Example connecting GitHub Action Workflow](#example-connecting-github-action-workflow)
  - [Limitations](#limitations)
  - [How to contribute](#how-to-contribute)
    - [License](#license)

## How it works

The action takes the following inputs:

- **bump**: Create the next release after bumping the version number semantically.
  
  **required**: false  

  The value must be one of:
  - *major*: Create a release after bumping the major version. e.g. 1.0.0 -> 2.0.0.
  - *minor*: Create a release after bumping the minor version. e.g. 0.1.0 -> 0.2.0.
  - *patch*: Create a release after bumping the patch version. e.g. 0.1.0 -> 0.1.2.
  - *final*: Promote a pre-release release to a final version, e.g. 1.0.0-rc.1 -> 1.0.0.
  
- **prerelease**: Denotes a pre-release. When this option is given the **prelabel** value value will be added by appending a hyphen and a `dot` separated **build number** immediately following the patch version. When bumping to a **prerelease**, if the previous version is already a **prerelease**, it would bump the **build number**.  
If it is a new **prerelease** the **build number** would default at `1`. If the version is a **prerelease** of another type, (e.g. **prelabel** is `alpha` vs. `beta`), the type is switched and the **prerelease** **build number** is reset to 1. If the version is not already a **prerelease**, then **bump** is required because it is assumed that the current release is a **final release**.
  
  **required**: false  

  The value must be one of:
  - *withBuildNumber*: Create a pre-release release with a `dot` separated **build number** immediately following **prelable** e.g. With `minor` bumping  e.g. 1.0.0 -> 1.1.0-alpha.1
  - *withOutBuildNumber*: Create a pre-release release without the **build number**. e.g. 1.0.0 -> 1.1.0-alpha

- **prelabel**: Label to be used for **prerelease** tags. The value can be any string. Good examples are `alpha`, `beta`, `rc`, etc.
  
  ​**required**: false  
  **default**: 'alpha'

- **initial_version**: If there is no current version, the bump will be based on initial_version or 0.1.0
  
  **required**: false  
  **default**: 0.1.0

## How to use

To use this **GitHub** Action you will need to complete the following:

1. Add the task in your workflow where you see fit. You can use the example below as a reference.
1. Modify the example to pass the correct values for `bump`. Values for `prelabel`, `initial_version` are optional.

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
    - uses: actionsdesk/semver
      with:
        bump: patch
        prerelease: withBuildNumber
        prelabel: rc
        initial_version: '1.0.1'
```

## Limitations

- When creating a pre-release it does not use the `pre-release` setting in GitHub. This would be fixed later.
- `withoutBuildNumber` is not implemented yet.

## How to contribute

If you would like to help contribute to this **GitHub** Action, please see [CONTRIBUTING](https://github.com/actionsdesk/semver/blob/master/.github/CONTRIBUTING.md)

---

### License

- [MIT License](https://github.com/actionsdesk/workflow-dispatch/blob/master/LICENSE)
