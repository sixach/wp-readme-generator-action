import * as core from '@actions/core'
import fs from 'fs'
import {readProjectMeta} from './extension-meta'
import {templater} from './templater'

async function run(): Promise<void> {
  try {
    const dirPath: string = core.getInput('dir_path')
    const vars = await readProjectMeta(dirPath)
    const output = templater(vars)
    // Write the resulting readme.txt
    fs.writeFileSync(core.getInput('output_path'), output, {
      encoding: 'utf8'
    })
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
