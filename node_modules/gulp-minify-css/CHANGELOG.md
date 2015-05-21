# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [1.1.1] - 2015-05-03

### Changed

- index.js
  * Improve path handlong for more correct Source Map. ([#89](https://github.com/jonathanepollack/gulp-minify-css/issues/89))

## [1.1.0] - 2015-04-21

### Added

- CHANGELOG.md for project clarity.

### Changed

- index.js
  * Follow th internal changes of clean-css v3.2.x

## [1.0.0] - 2015-03-10

### Changed

- test/sourceMaps.js
  * gulp-sourcemaps doesn’t support stream mode, so we don’t need to test the result of Source Map in stream mode.
- README.md
  * 'Breaking Changes' section removed, as those changes are now 3 months old and are no longer surprising.


### Removed

- `cache` option -- this violated the 'do one thing well' principle of gulp.
- test/cache.js
  * No more `cache` option in the API means no need for those tests.