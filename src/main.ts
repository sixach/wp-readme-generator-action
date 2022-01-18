import * as core from '@actions/core'
import {
  detectProjectType,
  getReadmeContent,
  getReadmeFilePath,
  readProjectMeta
} from './extension-meta'
import {retrieveDirPath, writeOutput} from './utils'
import {templater} from './templater'
import {unlinkSync} from 'fs'

async function run(): Promise<void> {
  try {
    const inputPath: string = core.getInput('input_path')
    const projectType: string = core.getInput('project_type')
    const outputPath: string = core.getInput('output_path')
    const replace: string = core.getInput('replace')
    const dirPath = retrieveDirPath()

    const project = await detectProjectType(dirPath)
    const vars = await readProjectMeta(
      inputPath || project.file,
      projectType || project.type
    )
    // Read readme file content
    const readmeFile = await getReadmeFilePath(dirPath)
    const readme = await getReadmeContent(readmeFile)
    if (readme) vars.readme = readme

    const output = templater(vars)
    // Write the resulting readme.txt
    writeOutput(dirPath, outputPath, output)

    // Replace mode. Delete existing README.md?
    if (replace === 'true' && readmeFile) {
      core.info(`❌ Replace mode active. Deleting README.md...`)
      unlinkSync(readmeFile)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
