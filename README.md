# ✨ WordPress Readme.txt Generator Action

This action generates WordPress flavored readme.txt from Theme/Plugin metadata.

Keeping two versions of README is no bueno. Basically, developers need to create one version of ```README.md``` for GitHub and another one for WordPress.org. So why bother? If you can create only one file and this action will do the rest for you.

## Code in General

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:  
```bash
$ npm test

PASS  __tests__/main.test.ts
  ✓ Test if action works normally (118 ms)
  ✓ Throws must provide a valid header map (16 ms)
  ✓ Must not throw an error if a valid header map provided (1 ms)
  ...
...
```

## Usage

Add the following step to your job.

```yml
- uses: sixach/wp-readme-generator-action@master
  with:
    # Optional. If not specified, tries to find main file in current directory.
    # Defaults to plugin-name.php or index.php for plugin, style.css for theme.
    input_path: ./plugin-name.php

    # Optional. If not specified, tries to depect project type.
    # Can be either 'theme' or 'plugin'
    project_type: plugin

    # Optional. Delete existing README.md and place readme.txt instead
    # Defaults to true
    replace: true

    # Optional. Relative path to the working directory
    # If you want to customize the path where readme.txt should be placed
    # Defaults to the current directory (`./readme.txt`)
    output_path: ./readme.txt
```

## Hiding Text

In some cases, you might not want for text to appear in resulting `readme.txt`. For example, your README.md can contain instructions for developers. It might be useful for developers, but useless for anyone else. To remove the text, wrap it inside the `<!-- only:github/ -->` tags like so:

```md
# My Awesome Plugin

Here goes your description.
<!-- only:github/ -->
## Development

You'll need [Node.js](https://nodejs.org/) and [Composer](https://getcomposer.org/) installed
on your computer in order to build this plugin.<!-- /only:github -->
```

It will hide the text from ordinary users.