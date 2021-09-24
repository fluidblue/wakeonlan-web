#!/bin/bash

SCRIPT_DIR=${0%/*}

# Clean
source "$SCRIPT_DIR/clean.sh"

# Backend
tsc

# Frontend
cd ../frontend
yarn build
cd ../backend
cp -R ../frontend/build ./build/httpdocs

# Docs
cp ../*.md .
cp -R ../docs ./docs
