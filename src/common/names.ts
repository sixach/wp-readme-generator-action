import {MetaProperty} from '../extension-meta'

export const defaultHeaderMap: MetaProperty = {
  contributors: 'Contributors',
  donate: 'Donate link',
  tags: 'Tags',
  description: 'Description',
  requires: 'Requires at least',
  requiresPHP: 'Requires PHP',
  version: 'Version',
  tested: 'Tested up to',
  stable: 'Stable tag',
  license: 'License',
  licenseURI: 'License URI',
  textDomain: 'Text Domain',
  domainPath: 'Domain Path',
  author: 'Author',
  authorURI: 'Author URI'
}

export const pluginHeaderNames: MetaProperty = {
  name: 'Plugin Name',
  pluginURI: 'Plugin URI',
  network: 'Network',
  ...defaultHeaderMap
}

export const themeHeaderNames: MetaProperty = {
  name: 'Theme Name',
  themeURI: 'Theme URI',
  template: 'Template',
  status: 'Status',
  detailsURI: 'Details URI',
  ...defaultHeaderMap
}
