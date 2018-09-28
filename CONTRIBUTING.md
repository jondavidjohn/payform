# How to Contribute

Yay, you're interested in helping this thing suck less.  Thank you!

## Project Layout

  - `src/`  - Coffeescript Source
  - `dist/` - Compiled and Minified
  - `test/` - Unit Tests

## Having a problem?

A **great** way to start a discussion about a potential issue is to
submit a pull request including a failing test case.  It's really hard to
misunderstand a problem presented this way.  This way it's clear what the
problem is before you spend your valuable time trying to fix it.

## Have an idea to make it better?

Again, guard your time and effort.  Make sure that you don't spend a lot
of time on an improvement without talking through it first.

## Getting to work

```sh
npm install
npm run build
npm test
```

## Pull Requests

**Make sure to send pull requests to `develop`.**

Good Pull Requests include:

  - A clear explaination of the problem (or enhancement)
  - Clean commit history (squash where it makes sense)
  - Relevant Tests (either updated and/or new)

## Release Process

We strive for [semantic versioning](https://semver.org/) for our version number assignment, and utilize the [git flow](https://github.com/nvie/gitflow) tool to execute releases in the repository.

All new functionality should come in on the `develop` branch and when you're ready to cut a new release, start the process by using the

```
  $> git flow release start 1.x.x
```

This should give you a release branch off develop and some relevant instructions.

This is when you should:
  - Bump the version numbers in both `src/payform.coffee` and `package.json`
  - Update the `CHANGELOG`
  - Run `make clean && make build`

Once you've done this and committed these changes to the release branch, you are ready to run:

```
  $> git flow release finish 1.x.x
```

This will:
  - Merge the release branch into `master` and also back into `develop`
  - Create a tag for the release and prompt you for an annotation (I usually paste in the relevant `CHANGELOG` entry)

At this point you should push `master` and `develop`, and also the new tag with `git push --tags`

### Publishing to npm

Once the release process is complete, and you're confident it is correct, you should be able to publish to npm with

```
  $> npm publish
```
