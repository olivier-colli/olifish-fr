#! /usr/bin/env bash
# set -e # Exit with nonzero exit code if anything fails

galleries='./galeries'

# init
rm -Rf $galleries
mkdir $galleries

# -- init git
git checkout --orphan gh-pages

# compose index and galleries page
npm run compose-index
npm run compose-galleries
npm run compose-galleries-search

git add --force index.html $galleries
git commit -m "add galleries and index"

git push --force https://$token@github.com/olivier-colli/olifish-fr.git
