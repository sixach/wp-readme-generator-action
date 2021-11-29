import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import {getFileHeaders, detectProjectType, MetaProperty} from '../src/extension-meta'

test('Test if action works normally', () => {
  process.env['INPUT_DIRPATH'] = './__tests__/testPlugin'
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
test('Must not throw an error if a valid header map provided', async () => {
  const headerMap: MetaProperty = { test: 'Just some string' }
  const input: string = ``
  await expect(() => {
    getFileHeaders(input, headerMap)
  }).not.toThrowError('Must provide a valid header map')
})

// Should detect project type as 'plugin'
test('Should correctly detect project type as plugin', async () => {
  const input: string = './__tests__/testPlugin'
  await expect(detectProjectType(input)).resolves.toStrictEqual({
    type: 'plugin',
    file: '__tests__/testPlugin/testPlugin.php'
  })
})

// Should detect project type as 'plugin' and return index.php
test('Should correctly detect project type as plugin and return index.php', async () => {
  const input: string = './__tests__/testPluginIndex'
  await expect(detectProjectType(input)).resolves.toStrictEqual({
    type: 'plugin',
    file: '__tests__/testPluginIndex/index.php'
  })
})

// Should detect project type as 'theme'
test('Should correctly detect project type as theme', async () => {
  const input: string = './__tests__/testTheme'
  await expect(detectProjectType(input)).resolves.toStrictEqual({
    type: 'theme',
    file: '__tests__/testTheme/style.css'
  })
})

// Should throw an error in case when it can't detect project type
test('Should throw an error - not a plugin or theme', async () => {
  const input: string = './__tests__/brokenTheme'
  await expect(detectProjectType(input)).rejects.toThrowError('Not a theme or plugin')
})
