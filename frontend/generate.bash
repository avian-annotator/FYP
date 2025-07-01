#!/bin/bash
# This is the entry point for generating the code.
# If you are on windows, use git bash or WSL to run this script.
# If you are on mac or linux, just run this script.

# Detect OS and execute appropriate script
case "$OSTYPE" in
  msys*|cygwin*|win32*)
    powershell.exe -ExecutionPolicy Bypass -File generate_scripts/generate.ps1
    ;;
  darwin*)
    bash generate_scripts/generate.bash
    ;;
  *)
    echo "Unsupported OS: $OSTYPE"
    exit 1
    ;;
esac