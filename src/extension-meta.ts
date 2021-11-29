import * as core from '@actions/core'
import {pluginHeaderNames, themeHeaderNames} from './common/configuration'
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
  const stats = await stat(dirPath)
  if (!fs.existsSync(dirPath) || !stats.isDirectory()) {
    core.setFailed(
      `Directory ${dirPath} does not exist or it's not a directory`
    )
  }

  // Test if it's a theme or not
  const cssFile = path.join(dirPath, 'style.css')
  if (fs.existsSync(cssFile)) {
    const entryStat = await stat(cssFile)
    if (entryStat.isFile()) {
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
        return {
          type: 'plugin',
          file: filename
        }
      }
    }
  }

  throw new Error('Not a theme or plugin')
}
