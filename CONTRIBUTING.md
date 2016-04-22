# Contributing to Netbeast
Netbeast is an Open Source project so everyone is allowed to contribute on this project. We are under GNU GPL-3.0 License. You can read more about this [here](LICENSE.txt). We encourage our community to create [plugins](http://docs.netbeast.co/chapters/creating_a_plugin/index.html) and [apps](http://docs.netbeast.co/chapters/creating_an_application/index.html) to integrate new IoT devices and create unique experiences. If you want to join us but you do not know where to start, take a look on [the roadmap](#roadmap).

## How to contribute: Our development process
We follow a agile development convention: develop, test, improve. For all tasks or issues:

1. Open a branch and pull request.
2. Code the feature / solve the bug
3. The code passes the tests / new tests are appended
4. Travis-ci agrees, the code is good to merge.
5. Code styling will be fixed within the following iterations.

Some of the core team will be working directly on Github. We will reviewing all pull requests and accepting them as soon as possible.
And just please, please: read the [docs](http://docs.netbeast.co).

### Pull Requests
**Working on your first Pull Request (PR)?** You can learn how from this *free* series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github). 

In short, it consists on:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests!
3. Ensure the test suite passes (`npm test`).
4. If you are solving a bug problem posted on issues with your PR, comment your solution on it.

Netbeast @engineering team will help you trhough the process if you have any doubts. The moment you create a pull request, [travis](https://travis-ci.org/netbeast/dashboard) will test your code. If this process is sucessfull we will merge your PR.

### `master` is unsafe
We will keep `master` in good shape. That means you are not able to push master directly. Netbeast dev team will update master once the pull request have been sucessful

### Test your code
Before creating a pull resquest please be sure your code passes all tests we have been coding. Once you have finished coding you only need to run this code:

```
npm test
```

If you want to have coverage reports on it. We are not currently focusing on coverage, but would be great to have new and better test to have a even more solid codebase.
```
npm run coverage.
```

If everything goes successfully you are able to create the pull request.

## Bugs

### Where to Find Known Issues
[here](https://github.com/netbeast/dashboard/issues).
We will be using GitHub Issues for our public bugs. We will keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new task, try to make sure your problem doesn't already exist.

### Reporting New Issues
[Here](https://github.com/netbeast/dashboard/issues/new). The best way to get your bug fixed is to provide a reduced test case. Please always you report a bug write some code to show the problem and if it is possible tell us how to replicate your bug.

## How to Get in Touch
* Slack-Channel - [Join us](https://netbeastco.typeform.com/to/VGLexg)
* [Opening a new issue](https://github.com/netbeast/dashboard/issues/) – this can be tagged as questions. Fear no evil, we are happy to get new issues (really!)
* Forum - comming soon.

## Style Guide
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

We follow standardjs style guide. You can read [here](http://standardjs.com/) more about it. If you make a PR without being 100% styled,
do not worry, we'll take over. However we appreciate clean and easy to read code, and we'd like to introduce you to this pro convention.

<a name="roadmap">
### The Roadmap
* [x] Resources
* [x] Events
* [ ] Streams
* [x] Node-red custom nodes
* [ ] Write documentation for bear HTTP Resources API
* [ ] Write documentation for dashboard HTTP remote control
* [ ] tunnel and reverse DNS for out-home control
* [ ] Custom controls for device map
* [ ] Private app marketplace
* [ ] Voice recognition support
* [ ] Android app
* [ ] iOS app
* [x] In-app settings

## License
By contributing to Netbeast, you agree that your contributions will be licensed under its GPL-3.0 license. Which is developed [here](https://github.com/netbeast/dashboard/blob/master/LICENSE.txt).
