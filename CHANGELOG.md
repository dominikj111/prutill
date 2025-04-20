# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-04-20

### Added

- Added `promiseWrapper` utility for synchronous and asynchronous function Promise conversion
- Added additional handy utilities for Promise management
- Improved Deno support with better cross-platform compatibility

### Changed

- Renamed `TimedPromise` to `DelayedPromise` for better semantic clarity
- Switched to pnpm package manager for improved dependency management
- Enhanced package configuration for better compatibility across environments

### Fixed

- Fixed ESLint configuration for improved code quality enforcement
- Fixed unit tests for better reliability
- Fixed VSCode Jest plugin integration for better developer experience
- Improved deployment documentation

## [1.2.0-rc.1] - 2025-02-14

### Added

- Added `promiseWrapper` utility for wrapping synchronous and asynchronous functions into Promises
- Full TypeScript support and comprehensive tests for the new feature

## [1.1.0] - 2025-02-13

### Added

- Added publint script for package validation
- Improved test coverage for promise utilities
- Added proper CHANGELOG and updated CONTRIBUTION guidelines

### Changed

- Updated package description to better reflect library capabilities
- Enhanced keywords for better npm discoverability
- Upgraded dev dependencies
- Improved project structure
- Removed redundant test:coverage from test script (already part of jest)

### Fixed

- Fixed minification process in build pipeline
- Fixed CommonJS module generation for all files
- Fixed package.json configuration
- Improved Deno support

## [1.0.3] - 2025-02-13

### Added

- Added publint script for package validation
- Added keywords and TypeScript type definitions

### Changed

- Upgraded development dependencies
- Improved project structure
- Fixed package configuration

## [1.0.2] - 2023-10-09

### Added

- Added comprehensive README.md documentation
- Added CONTRIBUTION.md guidelines

### Changed

- Enhanced documentation with usage examples
- Improved package description

## [1.0.1] - 2023-10-02

### Added

- Support for Deno runtime
- CommonJS and ES6 module builds
- Jest and VSCode integration
- ESLint, Prettier configuration

### Changed

- Cleaned up unused modules
- Fixed Jest-VSCode plugin integration

## [1.0.0] - 2023-09-30

### Added

- Initial implementation of Promise utilities
- Core functionality: getLastPromise and getRaceWonPromise
- Basic test suite with Jest
- ESLint and Prettier setup
- Project initialization and structure
