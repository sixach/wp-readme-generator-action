# WordPress Readme.txt Generator Action

This action generates WordPress flavored readme.txt from Theme/Plugin metadata.

Keeping two versions of README is no bueno. Basically, developers need to create one version of ```README.md``` for GitHub and another one for WordPress.org. So why bother? If you can create only one file and this action will do the rest for you.

## Code in Main

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
- uses: r007/wp-readme-generator-action@latest
  with:
    # Optional, but recommended
    # Defaults to the current directory (`.`)
    dir_path: .

    # Optional. Delete existing README.md and place readme.txt instead
    # Defaults to true
    replace: true

    # Optional. Relative path to the working directory
    # If you want to customize the path where readme.txt should be placed
    # Defaults to the current directory (`./readme.txt`)
    output_path: ./readme.txt
```