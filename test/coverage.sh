#!/bin/bash
export ENV=development;

ISTANBUL=./node_modules/.bin/istanbul;
ISTANBUL_OPTIONS="--dir ./test/coverage";

_MOCHA=./node_modules/.bin/_mocha;
_MOCHA_OPTIONS="-R spec --bail --recursive";

# Trick to tell Node.js to look in your local folder for modules
export NODE_PATH=.:$NODE_PATH

rm -rf ./test/coverage # clean
$ISTANBUL cover  $ISTANBUL_OPTIONS $_MOCHA -- $_MOCHA_OPTIONS;
