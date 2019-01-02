#! /usr/bin/env bash

galleries='./galeries'

if [[ "$TRAVIS_COMMIT_MESSAGE" == "Travis: cpmopse index and galleries" ]]
then
  exit 0
fi

# init
rm -Rf $galleries
mkdir $galeries

# compose index and galleries page
npm run compose-index
npm run compose-galleries
