import {MetaProperty} from '../extension-meta'

export const defaultHeaderMap: MetaProperty = {
  contributors: 'Contributors',
  donate: 'Donate link',
  tags: 'Tags',
  requires: 'Requires at least',
  tested: 'Tested up to',
  stable: 'Stable tag',
  license: 'License',
  licenseURI: 'License URI'
}

export const pluginHeaderNames: MetaProperty = {
  name: 'Plugin Name',
  pluginURI: 'Plugin URI',
  version: 'Version',
  description: 'Description',
  author: 'Author',
  authorURI: 'Author URI',
  textDomain: 'Text Domain',
  domainPath: 'Domain Path',
  network: 'Network',
  ...defaultHeaderMap
}

export const themeHeaderNames: MetaProperty = {
  name: 'Theme Name',
  themeURI: 'Theme URI',
  description: 'Description',
  author: 'Author',
  authorURI: 'Author URI',
  version: 'Version',
  template: 'Template',
  status: 'Status',
  textDomain: 'Text Domain',
  domainPath: 'Domain Path',
  detailsURI: 'Details URI',
  ...defaultHeaderMap
}
