### Set-up for development

1. Clone the repository
1. Be sure you have `npm` installed (it comes with installation of Node.js).
1. Run `npm install` (or `npm i`) within the `qiblih-website` directory to
    install our dependencies and development dependencies.

### Scripts to use during development

1. `npm run eslint` - Will check the code for common errors. The configuration
    is within `.eslintrc.js` (and `.eslintignore` indicates the files that will
    not be linted).
1. `npm run rollup` - Will convert the modular source code (housed in `/js`)
    into a bundle that can be used in the browser. Modifications should
    therefore be first made in `/js` and after running the `npm run rollup`
    script, the files in `/public/js` will be updated accordingly. There are
    currently no build steps for CSS, however, so the non-JavaScript files in
    `/public` can be edited directly.
1. `npm start` or `npm run open`/`npm run open-dev` to start a local server,
    with the latter also auto-opening the page in the browser. You may have
    to refresh the page as the `start` will run afterward.
1. `npm run update-cdns` - See "Updating dependencies" section below.

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

For CDN dependencies, you can auto-update these using `npm run update-cdns`.
This should auto-update the version and `integrity` based on the latest
versions indicated by `package.json`. The `crossorigin=''` attribute should
also be kept (to ensure that the mode is "anonymous", i.e., that user
credentials such as cookies are not sent by the browser to this third party
site). The `integrity` attribute helps to prevent a third party CDN from
serving up potentially malicous code which differs from the original
dependency code.
