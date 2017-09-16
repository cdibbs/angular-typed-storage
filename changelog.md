# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.0] - 2017-09-16
### Added
- Exported mapper interface to facilitate customization of model (de)serialization.

### Changed
- Updated documentation to better reflect features.

### Removed
- Removed tight coupling to internal mapper library.

## [2.0.0] - 2017-09-13
### Added
- CHANGELOG.md :-)

### Changed
- Updated README.md to reflect removal of superfluous Angular dependency.
- We've experimentally switched to using [Alsatian] for unit testing.
- Builds are done through tsc and webpack, instead of Angular CLI.

### Removed
- Removed Angular wrapping. Making this an Angular library seemed like a good idea,
  at the time, since the original context for this library's creation was an Angular
  project. Now, typed-storage can be used in any Typescript or Javascript project.

## [1.1.0]
### Changed
- This was the final (barely working) Angular version. It's here only for
  historical records. :=) It should have been called 1.0.0.

[Alsatian]: https://github.com/alsatian-test/alsatian
[2.0.0]: https://github.com/cdibbs/typed-storage/compare/1.1.1...2.0.0
[1.1.0]: https://github.com/cdibbs/typed-storage/compare/1.0.3...1.1.0