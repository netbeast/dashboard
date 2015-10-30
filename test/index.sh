#!/usr/bin/env bash

COVERAGE_DIR="./test/coverage"
MODULES="./node_modules"

ISTANBUL="$MODULES/istanbul/lib/cli.js"
MOCHA="$MODULES/mocha/bin/mocha"
CODECOV="$MODULES/codecov.io/bin/codecov.io.js"

$ISTANBUL cover --dir $COVERAGE_DIR $MOCHA -- -R spec \
&& cat $COVERAGE_DIR/coverage.json | $CODECOV
