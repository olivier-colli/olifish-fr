/*
  Extract data from config.js and compose a static index.html
  It uses template files
  Run it with :
  $ node --experimental-modules  cli/composeIndex.mjs
*/

import fs from 'fs'
import path from 'path'
import {promisify} from 'util'
import slugify from './slugify.mjs'
import readConfig from './readConfig.mjs'

const tplDir = './cli/template'

const configGalleries = 'galleries.json'
const tplHead = path.join(tplDir, 'tpl-head.html')
const tplCss = path.join(tplDir, 'tpl-style.css')
const tplJS = path.join(tplDir, 'tpl-script.js')
const tplBody = path.join(tplDir, 'tpl-body.html')

const readFile = promisify(fs.readFile)

const readIndexFiles = Promise.all([
  readFile(configGalleries, 'utf-8').then(configGalleries => ({configGalleries: JSON.parse(configGalleries)})),
  readFile(tplHead, 'utf-8').then(head => ({head: head})),
  readFile(tplCss, 'utf-8').then(css => ({css: css})),
  readFile(tplJS, 'utf-8').then(js => ({js: js})),
  readFile(tplBody, 'utf-8').then(body => ({body: body}))
])

readIndexFiles.then(tplsData => {
  const {configGalleries, head, js, css, body} = Object.assign({}, ...tplsData)
  const bodyWithGalleries = body.replace('${galleries}', composeGalleries(configGalleries))
  const index = `
    ${head}
    <style>${css}</style>
    <script>${js}</script>
    ${bodyWithGalleries}
  </html>
  `
  writeHome(index)
})

const writeHome = content =>
  fs.writeFile('index.html', content, 'utf8', err => {
    if (err) throw err
  })

const composeGalleries = config =>
  config.map(galleryData => composeGallery(galleryData)).join('')

const composeGallery = data => {
  const {title, description, img} = data
  return `
      <figure class="img">
        <a href="/galleries/${slugify(title)}.html" class="gallery">
          <img src="https://www.olifish.com/light-thumbs/thumb-${img}.jpg" alt="${title}">
        </a>
        <figcaption itemprop="caption description">${description}</figcaption>
        <h3>${title}</h3>
      </figure>
  `
}
