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

== Description ==

{{{readme}}}`

/**
 * Render the readme.txt using mustache templating engine.
 *
 * @param vars {Array} Theme/plugin meta properties to be used
 * @returns {String} Rendered readme.txt with vars provided
 */
export function templater(vars: MetaProperty): string {
  // Format the readme content if needed
  if (vars.hasOwnProperty('readme')) {
    vars.readme = formatter(vars.readme)
  }

  return Mustache.render(template, vars)
}

/**
 * Replace markdown headings with WordPress-style headings
 *
 * @param content {String} File content to be parsed
 * @returns {String} Content with all headings replaced
 */
export function formatter(content: string): string {
  return content
    .replace(/^ *#[ \t]+([^\n]+?) *#*[ \t]*(\n+|$)/gm, '= $1 =$2')
    .replace(/^ *##[ \t]+([^\n]+?) *#*[ \t]*(\n+|$)/gm, '== $1 ==$2')
    .replace(/^ *###[ \t]+([^\n]+?) *#*[ \t]*(\n+|$)/gm, '=== $1 ===$2')
    .replace(/^ *####[ \t]+([^\n]+?) *#*[ \t]*(\n+|$)/gm, '==== $1 ====$2')
}
