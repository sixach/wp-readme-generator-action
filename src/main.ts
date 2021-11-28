import * as core from '@actions/core'
import fs from 'fs'
import {getFileHeaders} from './extension-meta'
import {headerMap} from './common/configuration'

async function run(): Promise<void> {
  try {
    const filePath: string = core.getInput('inputFile')

    // Check if File Exists
    if (!fs.existsSync(filePath)) {
      core.setFailed(`File ${filePath} does not exist`)
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) throw err
      const headers = getFileHeaders(data, headerMap)
      //@ts-ignore
      core.debug(headers)
    })

    core.setOutput('filePath', filePath)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
