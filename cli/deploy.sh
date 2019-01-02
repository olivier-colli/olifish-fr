#! /usr/bin/env bash

galleries='./galeries'

if [[ "$TRAVIS_COMMIT_MESSAGE" == "Travis: compose index and galleries" ]]
then
  exit 0
fi

# init
rm -Rf $galleries
mkdir $galleries

# compose index and galleries page
npm run compose-index
npm run compose-galleries
