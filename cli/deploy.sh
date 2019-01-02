#! /usr/bin/env bash

npm run compose-index
npm run compose-galleries

if [[ "$TRAVIS_COMMIT_MESSAGE" == "Travis: cpmopse index and galleries" ]]
then
  exit 0
fi
