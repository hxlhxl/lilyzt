1. Module build failed: AssertionError [ERR_ASSERTION]: libraryName should be provided

2. Field 'browser' doesn't contain a valid alias configuration


3. user "root" does not have permission to access the dev dir "/usr/lib/node_modules/node-sass/.node-gyp/8.4.0"

sudo npm install -g node-sass --unsafe-perm
    ref: https://docs.npmjs.com/getting-started/fixing-npm-permissions
    ref: https://bbs.archlinux.org/viewtopic.php?id=229180


4. Node Sass could not find a binding for your current environment: Linux 64-bit with Node.js 8.x

Found bindings for the following environments:
  - Linux 64-bit with Node.js 8.x

This usually happens because your environment has changed since running `npm install`.
Run `npm rebuild node-sass --force` to build the binding for your current environment.
