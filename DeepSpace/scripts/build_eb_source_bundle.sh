#!/usr/bin/env bash

DEEPSPACE_LOOSE_FILE_DIR=PLACEHOLDER

echo "cd into $DEEPSPACE_LOOSE_FILE_DIR"

pushd $DEEPSPACE_LOOSE_FILE_DIR
cp index.html index.html.bak
cp index.html-aws index.html
jar -cvf deepspace.war *

# clean up
mv index.html.bak index.html

eb deploy

popd
