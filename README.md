# ✨ WordPress Readme.txt Generator Action

This action generates WordPress flavored readme.txt from Theme/Plugin metadata. 

Every public plugin or theme is required to provide a so-called **“readme.txt” text file**. This is required because the repository parses it with Markdown language and draws all appropiate information from it, which is then displayed on the public repository. The header of that file also controls all aspects of the title, tagging, author, donate link etc. for your plugin or theme.

Readme.txt file is written using a customized version of Markdown syntax, which differs from original one. Because of this, the file itself is recognizable by [WordPress.org](https://wordpress.org/) only, while on any other website such as Github, Bitbucket, AWS, Gitlab etc. will be shown as a plain text. This creates a burden for developers of keeping two different versions of the same readme file in the repository: one for GitHub/Bitbucket/Gitlab, another for WordPress.org.

## How This Action Works

![How This Action Works](./.screenshots/diagram.png)

The [wp-readme-generator-action](https://github.com/sixach/wp-readme-generator-action) generates readme.txt in 3 simple steps. It takes a normal [README.md](http://README.md) as the starting point and modifies it in a way, that is understable by WordPress.org.

**Step 1**: extract information about plugin/theme from php/css file.

**Step 2**: add this information as a header to output readme.txt file

**Step 3**: replace markdown headings with WP-style headings (`== Heading ==` etc.)

A resulting output is written to readme.txt file.

### Hiding Development Instructions From Ordinary Users

Your readme may contain instructions for developers, such as how to install dependencies, how to build production release and so on. For example:

```markdown
## Development

You'll need Node.js and Composer installed on your computer in order to build this theme.

- Download or fork the repository.
- Run `npm install` to install NPM dependencies
- Run `npm run dev` command to compile and watch source files for changes while developing.
- Run `composer install` to install composer dependencies
```

Obviously, the best place for such instructions is Github. Unlikely you might want to include it into production readme.txt which ships with every public release on WordPress.org.

To exclude chunks of text, wrap them into `<!— only:github/ —>Text to exclude<!— /only:github —>` comment. The text will be removed from final output.

```markdown
<!— only:github/ —>
## Development

You'll need Node.js and Composer installed on your computer in order to build this theme.

- Download or fork the repository.
- Run `npm install` to install NPM dependencies
- Run `npm run dev` command to compile and watch source files for changes while developing.
- Run `composer install` to install composer dependencies
<!— /only:github —>
```

## Development

First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

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

## Typical Usage

Add the following step to your job.

```yml
- uses: sixach/wp-readme-generator-action@v1.1
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