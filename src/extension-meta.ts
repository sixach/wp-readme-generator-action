import * as core from '@actions/core'
import {pluginHeaderNames, themeHeaderNames} from './common/names'
import fs from 'fs'
import path from 'path'
import {stat} from 'fs/promises'

export interface MetaProperty {
  [key: string]: string
}

export interface ProjectType {
  type: 'theme' | 'plugin'
  file: string
}

/**
 * Helper function to find path to README file.
 * @param dirPath {String} Directory where to look for readme file
 * @returns {String|null} Path to README file if found, null otherwise
 */
export async function getReadmeFilePath(dirPath: string): Promise<fs.PathLike> {
  // Check possible file names of README.md
  const readmeFiles = [
    path.join(dirPath, `README.md`),
    path.join(dirPath, 'readme.md')
  ]
  for (const filename of readmeFiles) {
    if (fs.existsSync(filename)) {
      const entryStat = await stat(filename)
      if (entryStat.isFile()) {
        return filename
      }
    }
  }

  // Nothing found
  return ''
}

/**
 * Reads the content of README.md file.
 * The file name can be either README.md or readme.md (lowercase).
 *
 * @param dirPath {String} Path to the project directory
 * @returns {String} README.md content
 */
export async function getReadmeContent(
  dirPath: string
): Promise<string | null> {
  // Try to find a readme file
  const readmeFile = await getReadmeFilePath(dirPath)
  if (readmeFile) {
    core.info(`👀 Reading the content of README.md...`)
    return fs.readFileSync(readmeFile, 'utf8')
  }

  // Nothing found
  return null
}

/**
 * Parse the file contents to retrieve its metadata.
 *
 * Searches for metadata for a file, such as a plugin or theme. Each piece of
 * metadata must be on its own line. For a field spanning multiple lines, it
 * must not have any newlines or only parts of it will be displayed.
 *
 * @param fileContent {String} Data to be parsed
 * @param headerMap {MetaProperty} The list of headers to look for
 *
 * @returns An array of header meta values
 */
export function getFileHeaders(
  fileContent: string,
  headerMap: MetaProperty
): MetaProperty {
  if (Object.keys(headerMap).length === 0) {
    throw new Error('Must provide a valid header map')
  }

  const headers: MetaProperty | null = {}
  // Support systems that use CR as a line ending.
  fileContent = fileContent.replace(/(?:\r)/g, '\n')

  for (const key in headerMap) {
    const value: string = headerMap[key]
    const regex = new RegExp(`^.*\\/\\*\\*[\\s\\S]*${value}:\\s*(.*)\\n?`, 'im')
    const match: RegExpMatchArray | null = fileContent.match(regex)
    if (match) {
      headers[key] = match[1].trim()
    }
  }

  return headers
}

/**
 * Parse the theme stylesheet to retrieve its metadata headers.
 *
 * Adapted from the get_theme_data() function and the WP_Theme class in WordPress.
 * Returns an array that contains the following:
 * - 'name' - Name of the theme.
 * - 'description' - Theme description.
 * - 'author' - The author's name
 * - 'authorURI' - The authors web site address.
 * - 'version' - The theme version number.
 * - 'themeURI' - Theme web site address.
 * - 'template' - The slug of the parent theme. Only applies to child themes.
 * - 'status' - Unknown. Included for completeness.
 * - 'tags' - An array of tags.
 * - 'textDomain' - Theme's text domain for localization.
 * - 'domainPath' - Theme's relative directory path to .mo files.
 *
 * If the input string doesn't appear to contain a valid theme header, the function
 * will return NULL.
 *
 * @param fileContent {String} Data to be parsed
 * @returns {MetaProperty|null} See above for description
 */
export function getThemeHeaders(fileContent: string): MetaProperty {
  const headers: MetaProperty = getFileHeaders(fileContent, themeHeaderNames)

  // If it doesn't have a name, it's probably not a valid theme.
  if (!headers.hasOwnProperty('name')) {
    throw new Error('Not a valid theme')
  }

  return headers
}

/**
 * Parse the plugin contents to retrieve plugin's metadata headers.
 *
 * Adapted from the get_plugin_data() function used by WordPress.
 * Returns an array that contains the following:
 * - 'name' - Name of the plugin.
 * - 'title' - Title of the plugin and the link to the plugin's web site.
 * - 'description' - Description of what the plugin does and/or notes from the author.
 * - 'author' - The author's name.
 * - 'authorURI' - The author's web site address.
 * - 'version' - The plugin version number.
 * - 'pluginURI' - Plugin web site address.
 * - 'textDomain' - Plugin's text domain for localization.
 * - 'domainPath' - Plugin's relative directory path to .mo files.
 * - 'network' - Boolean. Whether the plugin can only be activated network wide.\
 *
 * @param fileContent {String} Data to be parsed
 * @returns {MetaProperty|null} See above for description
 */
export function getPluginHeaders(fileContent: string): MetaProperty {
  const headers: MetaProperty = getFileHeaders(fileContent, pluginHeaderNames)

  // If it doesn't have a name, it's probably not a valid plugin.
  if (!headers.hasOwnProperty('name')) {
    throw new Error('Not a valid plugin')
  }

  return headers
}

/**
 * Detects whether project type is plugin or theme by looking into directory content.
 *
 * @param dirPath {String} Path to the project directory
 * @returns {ProjectType} Detected package type. This can be either "plugin" or "theme".
 */
export async function detectProjectType(dirPath: string): Promise<ProjectType> {
  // Check if directory exists
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Directory ${dirPath} does not exist`)
  }

  // Test if it's a theme or not
  const cssFile = path.join(dirPath, 'style.css')
  if (fs.existsSync(cssFile)) {
    const entryStat = await stat(cssFile)
    if (entryStat.isFile()) {
      core.info(
        `ℹ️ theme detected! Extracting info from CSS file ${cssFile}...`
      )
      return {
        type: 'theme',
        file: cssFile
      }
    }
  }

  // Check every possible file name to see if it's a plugin or not
  const pluginFiles = [
    path.join(dirPath, `${path.basename(dirPath)}.php`),
    path.join(dirPath, 'index.php')
  ]
  for (const filename of pluginFiles) {
    if (fs.existsSync(filename)) {
      const entryStat = await stat(filename)
      if (entryStat.isFile()) {
        core.info(
          `ℹ️ plugin detected! Extracting info from PHP file ${cssFile}...`
        )
        return {
          type: 'plugin',
          file: filename
        }
      }
    }
  }

  throw new Error('Not a theme or plugin')
}

/**
 * Detect project type and then call appropriate function to get theme/plugin meta.
 *
 * @param dirPath {String} Path to the project directory
 * @returns {MetaProperty} Parsed meta properties of the theme/plugin
 */
export async function readProjectMeta(dirPath: string): Promise<MetaProperty> {
  let meta: MetaProperty = {}

  try {
    const project = await detectProjectType(dirPath)
    const fileContent = fs.readFileSync(project.file, 'utf8')

    if (project.type === 'theme') {
      meta = getThemeHeaders(fileContent)
    }
    if (project.type === 'plugin') {
      meta = getPluginHeaders(fileContent)
    }

    // Read readme file content
    const readme = await getReadmeContent(dirPath)
    if (readme) meta.readme = readme
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }

  return meta
}
