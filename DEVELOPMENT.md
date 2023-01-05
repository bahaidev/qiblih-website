### Set-up for development

1. Clone the repository
1. Be sure you have `npm` installed (it comes with installation of Node.js).
1. Run `npm install` (or `npm i`) within the `qiblih-website` directory to
    install our dependencies and development dependencies.

### Scripts to use during development

1. `npm run eslint` - Will check the code for common errors. The configuration
    is within `.eslintrc.js` (and `.eslintignore` indicates the files that will
    not be linted).
1. `npm run images` - Needs to be run to generate the responsive header images.
    You don't need to run this again until you make changes to the
    `image-processing.js` script or change the source header image file.
1. `npm start` or `npm run open`/`npm run open-dev` to start a
    [Vite](https://vitejs.dev/) dev server,
    with the latter also auto-opening the page in the browser. You may have
    to refresh the page as the `start` will run afterward.


### Updating dependencies

It is a good idea to periodically check whether dependencies have new versions
available, whether to ensure we are using versions with bugs fixed, or so as
to allow us to use new features.

One helpful tool is
[npm-check-updates](https://www.npmjs.com/package/npm-check-updates).
If you install globally `npm i -g npm-check-updates`, you can use this within
any project (including our own) to see if updates are available. To update
all dependencies to the latest stable versions, for example, you can run
`npm-check-updates -u` (or just `ncu -u`).
