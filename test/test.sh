#!/bin/bash
export ENV=development;

_MOCHA=./node_modules/.bin/_mocha;
_MOCHA_OPTIONS="-R spec --bail --recursive";

# Trick to tell Node.js to look in your local folder for modules
export NODE_PATH=.:$NODE_PATH

rm -rf ./test/coverage # clean
$_MOCHA $_MOCHA_OPTIONS;
