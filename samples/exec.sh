#!/bin/sh

cd $(dirname $0)
mkdir -p tmp
MESSAGE=$(cat - | jq -r '.text')
echo "$(basename $0) received .text: $MESSAGE" >> tmp/log.txt
# echo "STDERR output" >&2
# sleep 3
# exit 1