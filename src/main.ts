import * as core from '@actions/core'
//import fs from 'fs'
import {detectProjectType} from './extension-meta'
//import {headerMap} from './common/configuration'

async function run(): Promise<void> {
  try {
    const dirPath: string = core.getInput('dirPath')
    const project = await detectProjectType(dirPath)
    //@ts-ignore
    core.debug(project)
    core.setOutput('dirPath', dirPath)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
