#!/bin/sh
set -x

mkdir $HOME/bin

curl -sfL https://raw.githubusercontent.com/securego/gosec/master/install.sh | sh -s -- -b $HOME/bin 1.3.0
