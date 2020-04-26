# CGD build environment
## Install instructions

Ensure NPM is installed

Install the gulp command line utility globally (if not already)
```
$ npm install -g gulp
```

### set up build environment

Navigate to project root directory
```
$ cd sitebuild
```
Run:
```
$ npm install
```
## run build environment
Whilst in root directory after setting up build environment as above, run:
```
$ gulp
```
## What is gulp doing?
This will start gulp and run a lot of tasks such as JS concat, start a browsersync server, convert sass to css and minify files. It takes all the files from the Src directory and puts the processed files into Build.

To see what Gulp is actually doing in full detail, look in gulpfile.js in the root directory. All processes are grouped in tasks such as JS, CSS or HTML.

For more information on how Gulp works see [Gulp documentation](https://gulpjs.com/).



