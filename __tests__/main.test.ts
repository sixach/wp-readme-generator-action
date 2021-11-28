import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import {getFileHeaders, MetaProperty} from '../src/extension-meta'

// Let's see if test file exists
test('Test if PHP file exists', () => {
  process.env['INPUT_INPUTFILE'] = './__tests__/test.php'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})

// Should provide header map
test('Throws must provide a valid header map', async () => {
  const headerMap: MetaProperty = {}
  const input: string = ``
  await expect(() => {
    getFileHeaders(input, headerMap)
  }).toThrowError('Must provide a valid header map')
})

// Should not throw any errors if header map provided
test('Must not throws an error if a valid header map provided', async () => {
  const headerMap: MetaProperty = { test: 'Just some string' }
  const input: string = ``
  await expect(() => {
    getFileHeaders(input, headerMap)
  }).not.toThrowError('Must provide a valid header map')
})