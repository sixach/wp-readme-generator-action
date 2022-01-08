import * as core from '@actions/core'
import {getReadmeFilePath, readProjectMeta} from './extension-meta'
import {retrieveDirPath, writeOutput} from './utils'
import {templater} from './templater'
import {unlinkSync} from 'fs'

async function run(): Promise<void> {
  try {
    const dirPath: string = core.getInput('dir_path')
    const projectDirPath = retrieveDirPath(dirPath)
    const outputPath: string = core.getInput('output_path')
    const replace: string = core.getInput('replace')

    const vars = await readProjectMeta(projectDirPath)
    const output = templater(vars)
    // Write the resulting readme.txt
    writeOutput(projectDirPath, outputPath, output)

    // Replace mode. Delete existing README.md?
    if (replace === 'true') {
      const readmeFile = await getReadmeFilePath(projectDirPath)
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
