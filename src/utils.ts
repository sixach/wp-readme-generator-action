import * as core from '@actions/core'
import * as path from 'path'
import {writeFileSync} from 'fs'

/**
 * Resolves the project path, relatively to the GITHUB_WORKSPACE
 *
 * @param providedPath {String} Provided path to plugin/theme
 * @returns {String} Real path inside the Github workspace
 */
export function retrieveDirPath(providedPath: string): string {
  let githubWorkspacePath = process.env['GITHUB_WORKSPACE']
  if (!githubWorkspacePath) {
    throw new Error('GITHUB_WORKSPACE not defined')
  }
  githubWorkspacePath = path.resolve(githubWorkspacePath)
  core.debug(`GITHUB_WORKSPACE = '${githubWorkspacePath}'`)

  let dirPath = providedPath || '.'
  dirPath = path.resolve(githubWorkspacePath, dirPath)
  core.debug(`dir_path = '${dirPath}'`)
  return dirPath
}

/**
 * Writes the readme.txt to the given the file
 *
 * @param githubWorkspacePath {String} Current working directory
 * @param outputFile {String} Relative/absolute path to readme.txt file
 * @param readme {String} Readme.txt content
 */
export function writeOutput(
  githubWorkspacePath: string,
  outputFile: string,
  readme: string | null
): void {
  if (outputFile && readme) {
    const outputPath = path.resolve(githubWorkspacePath, outputFile)
    core.debug(`output_path = '${outputPath}'`)
    try {
      writeFileSync(outputPath, readme, {
        encoding: 'utf8'
      })
    } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      core.warning(`⚠️ Could not write the file to disk - ${error.message}`)
    }
  }
}
