import {wait} from '../src/wait'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {type} from 'os'
import {Semver} from '../src/semver'
import {Bumps} from '../src/constants'

beforeAll(() => {
  process.env['INPUT_GITHUB_TOKEN'] = 'xxx'
  process.env['GITHUB_REPOSITORY'] = 'decyjphr-actions/semver'
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

test('Semver 1.2.3-beta bump=pre label=beta test', () => {
  const semver = new Semver('1.2.3-alpha', false, Bumps.pre, 'beta')
  expect(semver.getNextVersion()).toBe('1.2.3-beta.1')
})

test('Semver 1.2.3 bump=pre test', () => {
  const semver = new Semver('1.2.3', false, Bumps.pre)
  expect(semver.getNextVersion()).toBe('1.2.3-alpha.1')
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
