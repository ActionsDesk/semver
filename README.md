# semver action

This is a **GitHub Action**  for managing a version numbers using the Github release tag_name as a store for the version number.  
This is inspired by [Concourse Semver resource](https://github.com/concourse/semver-resource)

## Table of Contents

- [semver action](#semver-action)
  - [Table of Contents](#table-of-contents)
  - [How it Works](#how-it-works)
  - [How to use](#how-to-use)
    - [Example connecting GitHub Action Workflow](#example-connecting-github-action-workflow)
  - [Limitations](#limitations)
  - [How to contribute](#how-to-contribute)
    - [License](#license)
- [Create a JavaScript Action using TypeScript](#create-a-javascript-action-using-typescript)
  - [Create an action from this template](#create-an-action-from-this-template)
  - [Code in Main](#code-in-main)
  - [Change action.yml](#change-actionyml)
  - [Change the Code](#change-the-code)
  - [Publish to a distribution branch](#publish-to-a-distribution-branch)
  - [Validate](#validate)
  - [Usage:](#usage)

## How it Works

The action takes the following inputs:

- **bump**: Bump the version number semantically. 
  - **required**: true
  - **default**: 'minor'
  The value must be one of: 
  - *major*: Bump the major version number, e.g. 1.0.0 -> 2.0.0.
  - *minor*: Bump the minor version number, e.g. 0.1.0 -> 0.2.0.
  - *patch*: Bump the patch version number, e.g. 0.0.1 -> 0.0.2.
  - *final*: Promote the version to a final version, e.g. 1.0.0-rc.1 -> 1.0.0.'

- **pre**: Value can be any string. Indicates this is a pre-release. When bumping, bump to a prerelease (e.g. `rc` or `alpha`), or bump an existing prerelease.
  - ​**required**: false

- **initial_version**: If there is no current version, the bump will be based on initial_version or 0.0.1
  - **required**: false
  - **default**: 0.0.1

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
    - uses: decyjphr-actions/repository-dispatch
      with:
        workflow: dispatch-test.yml
        token: ${{secrets.pat}}
        ref: main
        inputs: '{"status":"passed"}'
```


## Limitations


## How to contribute

If you would like to help contribute to this **GitHub** Action, please see [CONTRIBUTING](https://github.com/decyjphr-actions/workflow-dispatch/blob/master/.github/CONTRIBUTING.md)

---

### License

- [MIT License](https://github.com/decyjphr-actions/workflow-dispatch/blob/master/LICENSE)


<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Create a JavaScript Action using TypeScript

Use this template to bootstrap the creation of a TypeScript action.:rocket:

This template includes compilation support, tests, a validation workflow, publishing, and versioning guidance.  

If you are new, there's also a simpler introduction.  See the [Hello World JavaScript Action](https://github.com/actions/hello-world-javascript-action)

## Create an action from this template

Click the `Use this Template` and provide the new repo details for your action

## Code in Main

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:  
```bash
$ npm test

 PASS  __tests__/main.test.ts
  ✓ throws invalid number (7 ms)
  ✓ wait 500 ms (505 ms)
  ✓ test runs (97 ms)

...
```

## Change action.yml

The action.yml contains defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
import * as core from '@actions/core';
...

async function run() {
  try { 
      ...
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder. 

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
