import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import {getFileHeaders, detectProjectType, readProjectMeta, MetaProperty} from '../src/extension-meta'

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

// Should throw an error if directory does not exist
test('Should throw an error if directory does not exist', async () => {
  const input: string = './__tests__/directoryDoesNotExist'
  await expect(detectProjectType(input)).rejects.toThrowError(`Directory ${input} does not exist`)
})

// Should return correct project meta - testPlugin
test('Should return correct project meta - testPlugin', async () => {
  const input: string = './__tests__/testPlugin'
  await expect(readProjectMeta(input)).resolves.toStrictEqual({
    name: "Sixa -  Test Plugin",
    version: "1.1.5",
    description: "This is test description just to be tested in wp-readme-generator-action.",
    license: "GPL-3.0-or-later",
    licenseURI: "https://www.gnu.org/licenses/gpl-3.0.html",
    author: "sixa AG",
    textDomain: "sixa"
  })
})

// Should return correct project meta - testPluginIndex
test('Should return correct project meta - testPluginIndex', async () => {
  const input: string = './__tests__/testPluginIndex'
  await expect(readProjectMeta(input)).resolves.toStrictEqual({
    name: "Sixa -  Test Plugin with Index.php",
    version: "1.1.5",
    description: "This is test description just to be tested in wp-readme-generator-action.",
    license: "GPL-3.0-or-later",
    licenseURI: "https://www.gnu.org/licenses/gpl-3.0.html",
    author: "sixa AG",
    textDomain: "sixa",
  })
})

// Should return correct project meta - testTheme
test('Should return correct project meta - testTheme', async () => {
  const input: string = './__tests__/testTheme'
  await expect(readProjectMeta(input)).resolves.toStrictEqual({
    name: "Sixa Theme",
    themeURI: "https://sixa.ch",
    description: "Official theme for the sixa.ch website.",
    author: "sixa AG",
    authorURI: "https://sixa.ch",
    version: "1.0.0",
    tags: "two-columns, three-columns, four-columns, left-sidebar, right-sidebar, grid-layout, flexible-header, custom-background, custom-colors, custom-header, custom-menu, custom-logo, editor-style, featured-images, footer-widgets, full-width-template, sticky-post, theme-options, threaded-comments, translation-ready, rtl-language-support, blog, e-commerce, block-styles, wide-blocks",
    textDomain: "sixa",
    domainPath: "/languages",
    license: "GNU General Public License v3 or later",
    licenseURI: "http://www.gnu.org/licenses/gpl-3.0.html",
    requires: "WordPress 5.6",
    tested: "5.6"
  })
})
