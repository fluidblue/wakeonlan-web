#!/bin/bash

# Get script directory.
# https://stackoverflow.com/a/66292509/2013757
SCRIPT_DIR=${0%/*}

source "$SCRIPT_DIR/development_env.sh"
npx ts-node node_modules/jasmine/bin/jasmine
