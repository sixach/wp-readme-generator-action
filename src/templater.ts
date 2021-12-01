import {MetaProperty} from './extension-meta'
import Mustache from 'mustache'

const template = `=== {{{name}}} ==={{#contributors}}
Contributors: {{{contributors}}}{{/contributors}}{{#donate}}
Donate link: {{{donate}}}{{/donate}}{{#tags}}
Tags: {{{tags}}}{{/tags}}{{#requires}}
Requires at least: {{{requires}}}{{/requires}}{{#tested}}
Tested up to: {{{tested}}}{{/tested}}{{#stable}}
Stable tag: {{{stable}}}{{/stable}}{{#license}}
License: {{{license}}}{{/license}}{{#licenseURI}}
License URI: {{{licenseURI}}}{{/licenseURI}}

{{{description}}}
`

/**
 * Render the readme.txt using mustache templating engine.
 *
 * @param vars Theme/plugin meta properties to be used
 * @returns rendered readme.txt with vars provided
 */
export function templater(vars: MetaProperty): string {
  return Mustache.render(template, vars)
}
