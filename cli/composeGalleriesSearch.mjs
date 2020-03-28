/*
  Compose an index page in galleries folder
  This page is use to return the search engine result 
*/

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import path_ from './path.mjs'
import nano from './nano.mjs'
import { keysValueArraysToMap } from './utils.mjs'

const readFile = promisify(fs.readFile)

const readIndexFiles = Promise.all([
    readFile(path_.tplHead, 'utf-8').then(head => ['head', head]),
    readFile(path_.tplCss, 'utf-8').then(css => ['css', css]),
    readFile(path_.tplJS, 'utf-8').then(js => ['js', js]),
    readFile(path_.tplSearchJS, 'utf-8').then(searchJs => [
        'searchJs',
        searchJs
    ]),
    readFile(path_.tplPhotoswipe, 'utf-8').then(photoswipe => [
        'photoswipe',
        photoswipe
    ]),
    readFile(path_.tplHeader, 'utf-8').then(header => ['header', header]),
    readFile(path_.tplSearch, 'utf-8').then(body => ['body', body])
])

readIndexFiles.then(promisesResult => {
    const file = keysValueArraysToMap(promisesResult)
    const js = nano(file.get('js'), { galleriesDir: path_.galleriesDir })
    const index = `
      ${file.get('head')}
      <style>${file.get('css')}</style>
      <script>${js}</script>
      <script>${file.get('searchJs')}</script>
      ${file.get('photoswipe')}
      ${file.get('header')}
      ${file.get('body')}
  </html>
  `

    writeHome(index)
})

const writeHome = content =>
    fs.writeFile(
        path.join(path_.galleriesDir, 'index.html'),
        content,
        'utf8',
        err => {
            if (err) throw err
            console.log(
                'write gallerySearch:',
                path.join(path_.galleriesDir, 'index.html')
            )
        }
    )
