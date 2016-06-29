#!/usr/bin/env bash

echo "Update deepspace loose file dir to $1 in $2"

LOOSE_FILE_DIR=$1

sed -i "s,PLACEHOLDER,$1,g" $2
