import * as core from '@actions/core'
import {getReadmeFilePath, readProjectMeta} from './extension-meta'
import {unlinkSync, writeFileSync} from 'fs'
import {templater} from './templater'

async function run(): Promise<void> {
  try {
    const dirPath: string = core.getInput('dir_path')
    const replace: string = core.getInput('replace')
    const vars = await readProjectMeta(dirPath)
    const output = templater(vars)
    // Write the resulting readme.txt
    writeFileSync(core.getInput('output_path'), output, {
      encoding: 'utf8'
    })

    // Replace mode. Delete existing README.md?
    if (replace === 'true') {
      const readmeFile = await getReadmeFilePath(dirPath)
      if (readmeFile) {
        core.info(`❌ Replace mode active. Deleting README.md...`)
        unlinkSync(readmeFile)
      }
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
