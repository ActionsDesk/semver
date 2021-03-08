import {wait} from '../src/wait'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {type} from 'os'
import {Semver} from '../src/semver'
import {Bumps, PreRelease} from '../src/constants'
import * as inputHelper from '../src/input-helper'

beforeAll(() => {
  process.env['INPUT_GITHUB_TOKEN'] = 'abc'
  process.env['GITHUB_REPOSITORY'] = 'decyjphr-actions/semver'
})

beforeEach(() => {
  delete process.env['INPUT_BUMP'] 
  delete process.env['INPUT_INITIAL_VERSION']
  delete process.env['INPUT_PRERELEASE'] 
})

test('throws invalid number', async () => {
  const input = parseInt('foo', 10)
  await expect(wait(input)).rejects.toThrow('milliseconds not a number')
})

test('wait 500 ms', async () => {
  const start = new Date()
  await wait(500)
  const end = new Date()
  var delta = Math.abs(end.getTime() - start.getTime())
  expect(delta).toBeGreaterThan(450)
})

test('Input Helper test', () => {
  process.env['INPUT_BUMP'] = 'major'
  process.env['INPUT_INITIAL_VERSION'] = '0.0.1'
  const semverInputs = inputHelper.getInputs()
  expect(semverInputs.bump).toBe('major')
  expect(semverInputs.initialVersion).toBe('0.0.1')
  expect(semverInputs.preRelease).toBe('')
})

test('Input Helper test prerelease', () => {
  process.env['INPUT_PRERELEASE'] = PreRelease.withBuildNumber
  process.env['INPUT_INITIAL_VERSION'] = '0.0.1'
  const semverInputs = inputHelper.getInputs()
  expect(semverInputs.bump).toBe('')
  expect(semverInputs.initialVersion).toBe('0.0.1')
  expect(semverInputs.preRelease).toBe(PreRelease.withBuildNumber)
})

test('Semver 0.1.0 bump=pre firstRelease test', () => {
  const semver = new Semver(
    '0.1.0',
    true,
    Bumps.patch,
    PreRelease.withBuildNumber
  )
  expect(semver.getNextVersion()).toBe('0.1.0-alpha.1')
})

test('Semver 0.1.0 bump=major firstRelease test', () => {
  const semver = new Semver('0.1.0', true )
  expect(semver.getNextVersion()).toBe('0.1.0')
})

test('Semver 0.1.0 bump=major firstRelease test', () => {
  const semver = new Semver('0.1.0', true, Bumps.major)
  expect(semver.getNextVersion()).toBe('0.1.0')
})

test('Semver 0.1.0 Bumps.major PreRelease.WithBuildNumber test', () => {
  const semver = new Semver(
    '0.1.0',
    false,
    Bumps.major,
    PreRelease.withBuildNumber
  )
  expect(semver.getNextVersion()).toBe('1.0.0-alpha.1')
})

test('Semver 0.1.0 Bumps.minor PreRelease.WithBuildNumber test', () => {
  const semver = new Semver(
    '0.1.0',
    false,
    Bumps.minor,
    PreRelease.withBuildNumber
  )
  expect(semver.getNextVersion()).toBe('0.2.0-alpha.1')
})

test('Semver 0.1.0 Bumps.patch PreRelease.WithBuildNumber test', () => {
  const semver = new Semver(
    '0.1.0',
    false,
    Bumps.patch,
    PreRelease.withBuildNumber
  )
  expect(semver.getNextVersion()).toBe('0.1.1-alpha.1')
})

test('Semver 0.1.0 Bumps.None PreRelease.WithBuildNumber test', () => {
  const semver = new Semver(
    '0.1.0',
    false,
    undefined,
    PreRelease.withBuildNumber
  )
  expect(semver.getNextVersion()).toBe('0.1.0-alpha.1')
})

test('Semver 0.1.0-alpha.1 Bumps.None PreRelease.WithBuildNumber test', () => {
  const semver = new Semver(
    '0.1.0-alpha.1',
    false,
    undefined,
    PreRelease.withBuildNumber
  )
  expect(semver.getNextVersion()).toBe('0.1.0-alpha.2')
})

test('Semver 0.1.0-alpha.1 Bumps.None PreRelease.WithBuildNumber label=beta test', () => {
  const semver = new Semver(
    '0.1.0-alpha.1',
    false,
    undefined,
    PreRelease.withBuildNumber,
    'beta'
  )
  expect(semver.getNextVersion()).toBe('0.1.0-beta.1')
})

test('Semver 0.1.0-alpha.1 Bumps.final PreRelease.WithBuildNumber label=beta test', () => {
  const semver = new Semver(
    '0.1.0-alpha.1',
    false,
    Bumps.final,
    PreRelease.withBuildNumber,
    'beta'
  )
  expect(semver.getNextVersion()).toBe('0.1.0')
})

test('Semver 0.1.0-alpha.1 Bumps.Final', () => {
  const semver = new Semver(
    '0.1.0-alpha.1',
    false,
    Bumps.final
  )
  expect(semver.getNextVersion()).toBe('0.1.0')
})

test('Semver 1.0.0 bump=major test', () => {
  const semver = new Semver('1.0.0', false, Bumps.major)
  expect(semver.getNextVersion()).toBe('2.0.0')
})

test('Semver 1.0.0 bump=minor test', () => {
  const semver = new Semver('1.0.0', false, Bumps.minor)
  expect(semver.getNextVersion()).toBe('1.1.0')
})

test('Semver 1.0.0 bump=patch test', () => {
  const semver = new Semver('1.0.0', false, Bumps.patch)
  expect(semver.getNextVersion()).toBe('1.0.1')
})

test('Semver Invalid Semver Error test', () => {
  try {
    const semver = new Semver('1.0.0', false)
    semver.getNextVersion()
  } catch (err) {
    expect(err.toString()).toEqual(
      'Error: Invalid Semver Operation: At least one of Bump or PreRelease has to be defined or IsFirstRelease must be true'
    )
  }
})

test('Semver Invalid Bumps.final Error test', () => {
  try {
    const semver = new Semver('1.0.0', false, Bumps.final)
    semver.getNextVersion()
  } catch (err) {
    expect(err.toString()).toEqual(
      'Error: Invalid Semver Operation: Cannot do Bump Final and not have the previous release as a PreRelease'
    )
  }
})

/*
// shows how the runner will run a javascript action with env / stdout protocol
test('test bump major', () => {
  process.env['INPUT_BUMP'] = 'major'
  process.env['INPUT_INITIAL_VERSION'] = '0.0.1'

  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  try {
    const options: cp.ExecFileSyncOptions = {
      env: process.env
    }
    console.log(cp.execFileSync(np, [ip], options).toString())
  } catch (err) {
    expect(err).toBeInstanceOf(Error)
  }
})


test('test bump minor', () => {
  process.env['INPUT_BUMP'] = 'minor'
  process.env['INPUT_INITIAL_VERSION'] = '0.1.1'

  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  try {
    const options: cp.ExecFileSyncOptions = {
      env: process.env
    }
    console.log(cp.execFileSync(np, [ip], options).toString())
  } catch (err) {
    expect(err).toBeInstanceOf(Error)
  }
})

test('test bump patch', () => {
  process.env['INPUT_BUMP'] = 'patch'
  process.env['INPUT_INITIAL_VERSION'] = '0.1.1'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  try {
    const options: cp.ExecFileSyncOptions = {
      env: process.env
    }
    console.log(cp.execFileSync(np, [ip], options).toString())
  } catch (err) {
    expect(err).toBeInstanceOf(Error)
  }
})

test('test bump invalid', () => {
  process.env['INPUT_BUMP'] = 'ssss'
  process.env['INPUT_INITIAL_VERSION'] = '0.1.1'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  try {
    const options: cp.ExecFileSyncOptions = {
      env: process.env
    }
    console.log(cp.execFileSync(np, [ip], options).toString())
  } catch (err) {
    console.log(err)
    expect(err).toBeDefined
  }
})
*/
