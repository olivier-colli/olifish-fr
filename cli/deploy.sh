#! /usr/bin/env bash
# set -e # Exit with nonzero exit code if anything fails

npm install photoswipe

galleries='./galeries'

# init
rm -Rf $galleries
mkdir $galleries

# -- init git
git checkout --orphan gh-pages

# compose index and galleries page
npm run compose-index
npm run compose-galleries

git add --force index.html $galleries node_modules
git commit -m "add galleries and index"

git push --force https://$token@github.com/olivier-colli/olifish-fr.git
