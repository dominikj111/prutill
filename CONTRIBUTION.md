# Contributing to prutill

Thank you for your interest in contributing to prutill! We welcome contributions from everyone and are grateful for
every pull request!

## How to Contribute

1. **Create an Issue**

    - First, create an issue in the repository issue tracker
    - Describe the bug you found or the feature you'd like to add
    - Wait for discussion and approval before proceeding

2. **Fork & Create a Branch**

    - Fork the repository
    - Create a branch with a descriptive name (e.g., `fix-async-bug` or `add-new-feature`)

3. **Make Your Changes**

    - Write your code following our code style guidelines
    - Add tests for any new functionality
    - Update documentation as needed

4. **Test Your Changes**

    - Run the test suite: `pnpm test`
    - Ensure all tests pass
    - Add new tests if you've added new functionality

5. **Submit a Pull Request**
    - Push your changes to your fork
    - Create a pull request to our main branch
    - Follow the pull request template
    - Link the related issue in your pull request

## Development Setup

This library is environment-agnostic and has no production dependencies. While the library itself can run anywhere, the
development environment uses Node.js and pnpm for building, testing, and maintaining the codebase.

### Prerequisites

1. **Node.js**: Any modern version will work as development dependencies handle Node.js-specific features
2. **pnpm**: Our preferred package manager for consistent dependency management

### Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run tests: `pnpm test`

### Development Scripts

- `pnpm build`: Build the library for all supported formats
- `pnpm test`: Run the full test suite (including Node.js and Deno tests), linting and formatting

## Code Style Guidelines

- Format code using Prettier: `pnpm format:fix`
- Follow existing code conventions for consistency
- Use meaningful variable and function names
- Add comments for complex logic
- Write comprehensive documentation for public APIs
- Include TypeScript types for all new code

## Testing Guidelines

- Write unit tests for all new functionality
- Maintain test coverage
- Test in both Node.js and Deno environments
- Include edge cases in your tests

## Documentation

- Update README.md if you're adding new features
- Add JSDoc comments for all public APIs
- Update examples if necessary
- Keep documentation clear and concise

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the CHANGELOG.md following semantic versioning
3. The PR will be merged once you have the sign-off of a maintainer

## License

By contributing to prutill, you agree that your contributions will be licensed under the Apache License 2.0 License.

Thank you for contributing to prutill! 🎉
