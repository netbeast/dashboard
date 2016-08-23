# Contributing to Netbeast
Netbeast is an Open Source project so everyone can contribute to this project. Netbeast is licensed under GNU GPL v3 License. We encourage our community to create plugins and apps to support IoT devices and create unique experiences.

## How do I do X? Why doesn’t Y work? Where can I go to get help?

If these docs don’t contain an answer to your question, you might want to try the [Netbeast developers slack channel](https://netbeastco.typeform.com/to/VGLexg). Feel free to ask any question related to installing, using, developing or debugging Netbeast.

Our [issue tracker](https://github.com/netbeast/dashboard/issues/) is also a good place to find common issues and getting yours solved. Fear no evil, we are happy to get new issues (We mean it!).

## Our development process

We follow an agile development convention: develop, test, improve. For all tasks or issues:

1. Open a branch and pull request.
2. Code the feature / solve the bug
3. The code passes the tests / new tests are appended
4. Travis CI agrees, the code is good to merge.
5. Code styling will be fixed within the following iterations.

Some of our core team members will be working directly on Github. We will review all pull requests and accept them as soon as possible.

## How to contribute

### Overview
**Working on your first Pull Request (PR)?** You can learn how from this **free** series: [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

Long story short:

1. Fork the repo and create your branch from `master`.
2. If you've added code, add tests!
3. Ensure your code passes the tests (`npm test`).
4. If you are solving a bug problem posted on issues with your PR, comment your solution on it.

The Netbeast @engineering team will help you through the process if you have any questions. The moment you create a pull request, [Travis](https://travis-ci.org/netbeast/dashboard) will test your code. If this process is successful and follows style guidelines, we will merge your PR.

### Getting started

To start contributing to Netbeast, the first thing you have to do is to fork and clone one of our repositories. To do so, you need [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

First step is to fork one of our repositories. To do so, just hit the
<!-- Place this tag where you want the button to render. -->
<a class="github-button" href="https://github.com/netbeast/dashboard/fork" data-icon="octicon-repo-forked" data-style="mega" data-count-href="/netbeast/dashboard/network" data-count-api="/repos/netbeast/dashboard#forks_count" data-count-aria-label="# forks on GitHub" aria-label="Fork netbeast/dashboard on GitHub">Fork</a>
<!-- Place this tag right after the last button or just before your close body tag. -->
<script async defer id="github-bjs" src="https://buttons.github.io/buttons.js"></script>
button and you'll have a copy of the repo under your Github account.

Then all that remains is to clone your fork locally. Clone your git repo using the following command-line argument where `<my-github-name>` is your account name on GitHub and `<repo-name>` is the name of the repo you forked:

```git clone git@github.com:<my-github-name>/<repo-name>.git```

### Issues

The list of Netbeast feature requests and bugs can be found on our on our [GitHub issue tracker](https://github.com/netbeast/dashboard/issues). Pick an unassigned issue that you think you can accomplish, add a comment that you are attempting to do it, and shortly your own personal label matching your GitHub ID will be assigned to that issue.

Feel free to propose issues that aren’t described!

#### Reporting bugs
Ping us [here](https://github.com/netbeast/dashboard/issues/new) with the bugs you encounter. The best way to get your bug fixed is to provide a reduced test case. When reporting a bug please write some code to show the problem and if possible tell us how to replicate your bug.

### Setting up a topic branch

In git it is best to isolate each topic or feature into a “topic branch”. While individual commits allow you control over how small individual changes are made to the code, branches are a great way to group a set of commits all related to one feature together, or to isolate different efforts when you might be working on many topics at the same time.

While it takes some experience to get the right feel about how to break up commits, a topic branch should be limited in scope to a single issue as submitted to an issue tracker.

Also since GitHub pegs and syncs a pull request to a specific branch, it is the ONLY way that you can submit more than one fix at a time. If you submit a pull from your develop branch, you can’t make any more commits to your develop without those getting added to the pull.

To create a topic branch, its easiest to use the convenient `-b` argument to git checkout:

```
git checkout -b fix-broken-thing
Switched to a new branch 'fix-broken-thing'
```

You should use a verbose enough name for your branch so it is clear what it is about. Now you can commit your changes and regularly merge in the upstream develop as described below.

When you are ready to generate a pull request, either for preliminary review, or for consideration of merging into the project you must first push your local topic branch back up to GitHub:

```
git push origin fix-broken-thing
```

Now when you go to your fork on GitHub, you will see this branch listed under the “Source” tab where it says “Switch Branches”. Go ahead and select your topic branch from this list, and then click the “Pull request” button.

Here you can add a comment about your branch. If this in response to a submitted issue, it is good to put a link to that issue in this initial comment. The repo managers will be notified of your pull request and it will be reviewed (see below for best practices). Note that you can continue to add commits to your topic branch (and push them up to GitHub) either if you see something that needs changing, or in response to a reviewer’s comments. If a reviewer asks for changes, you do not need to close the pull and reissue it after making changes. Just make the changes locally, push them to GitHub, then add a comment to the discussion section of the pull request.

### Pull upstream changes into your fork!

Netbeast is advancing quickly. It is critical that you pull upstream changes from develop into your fork on a regular basis. Nothing is worse than putting in a days of hard work into a pull request only to have it rejected because it has diverged too far from develop.

To pull in upstream changes (`<repo-name>` is the name of the repo you are contributing to):

```
git remote add upstream https://github.com/netbeast/<repo-name>.git
git fetch upstream develop
```

Check the log to be sure that you actually want the changes, before merging:

```
git log upstream/develop
```

Then merge the changes that you fetched:

```
git merge upstream/develop
```

### How to get your pull request accepted

We want your submission. But we also want to provide a stable experience for our users and the community. Follow these rules and you should succeed without a problem!

#### `master` is holy
We will always keep `master` in good shape. That means that you cannot push to master directly. Reviewers will update master once the pull request has been tested and verified.


#### Run the tests!

Before creating a pull resquest please be sure your code passes all tests included. Once you've finished coding just run:

```
npm test
npm run coverage
```

The first thing the core committers will do is run these commands. Any pull request that fails this test suite will be rejected.

#### Add the tests for the code you add

We’ve learned the hard way that code without tests is undependable. If your pull request reduces our test coverage because it lacks tests then it will be rejected.

We run our tests as a script contained in package.json file:

```
"scripts": {
    "test": "export NODE_PATH=.:$NODE_PATH && export ENV=development && ./node_modules/.bin/gulp test",
}
```

For now, we mainly use [the mocha test framework](https://mochajs.org/) and [Travis CI](https://travis-ci.org/) to test the Dashboard and API. Feel free to experiment with other frameworks if these don't get the job done for you.

Also, keep your tests as simple as possible. Complex tests end up requiring their own tests. We would rather see duplicated assertions across test methods than cunning utility methods that magically determine which assertions are needed at a particular stage. Remember: Explicit is better than implicit.

#### Don’t mix code changes with whitespace cleanup
If you change two lines of code and correct 200 lines of whitespace issues in a file the diff on that pull request is functionally unreadable and will be rejected. Whitespace cleanups need to be in their own pull request.

#### Keep your pull requests limited to a single issue
Pull requests should be as small/atomic as possible. Large, wide-sweeping changes in a pull request will be rejected, with comments to isolate the specific code in your pull request. This is done to make smoother contributing and reviewing contributions.

#### Follow standardjs and keep it simple!

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


We follow the standardjs style guide. You can read [here](http://standardjs.com/) more about it. We appreciate clean and easy to read code, so we highly encourage you to follow this convention.

Please keep your code as clean and straightforward as possible. When we see more than one or two functions/methods starting with my_special_function or things like myStrVar = str we start to get worried. Rather than try and figure out your brilliant work we’ll just reject it and send along a request for simplification.

Furthermore, the pixel shortage is over. We want to see:

* package instead of pkg
* grid instead of g
* my_function_that_does_things instead of mftdt

#### Test any css/layout changes in multiple browsers

Any css/layout changes need to be tested in Chrome, Safari, Firefox, IE8, and IE9 across Mac, Linux, and Windows. If it fails on any of those browsers your pull request will be rejected with a note explaining which browsers are not working.

### How pull requests are reviewed

First we pull the code into a local branch:

```
git checkout -b <branch-name> <submitter-github-name>
git pull git://github.com/<submitter-github-name>/<repo-name>.git develop
```

Then we run the tests:

```
npm test
```

and (when applicable):

```
npm run coverage
```

Furthermore, pull requests to the `dashboard`and `api`repos will be checked through Travis CI.

We finish with a merge and push to GitHub:

```
git checkout develop
git merge <branch-name>
git push origin develop
```

## License
By contributing to Netbeast, you agree that your contributions will be licensed under its GPL-3.0 license. Which is developed [here](https://github.com/netbeast/dashboard/blob/master/LICENSE.txt).
