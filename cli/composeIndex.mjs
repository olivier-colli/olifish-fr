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

const tplHead = path.join(tplDir, 'tpl-head.html')
const tplCss = path.join(tplDir, 'tpl-style.css')
const tplJS = path.join(tplDir, 'tpl-script.js')
const tplBody = path.join(tplDir, 'tpl-body.html')

const readFile = promisify(fs.readFile)

const readTpls = Promise.all([
  readFile(tplHead, 'utf-8').then(head => ({head: head})),
  readFile(tplCss, 'utf-8').then(css => ({css: css})),
  readFile(tplJS, 'utf-8').then(js => ({js: js})),
  readFile(tplBody, 'utf-8').then(body => ({body: body}))
])

readTpls.then(tplsData => {
  const tpls = Object.assign({}, ...tplsData)
  console.log(tpls)
})


/* 
const composeIndex = config =>
  fs.readFile(tplHead, 'utf8', (err, head) => {
    if (err) throw err
    fs.readFile(tplCss, 'utf8', (err, css) => {
      if (err) throw err
      fs.readFile(tplJS, 'utf8', (err, js) => {
        if (err) throw err
        fs.readFile(tplBody, 'utf8', (err, body) => {
          if (err) throw err
          const bodyWithGalleries = body.replace('${galleries}', composeGalleries(config))
          const index = `
              ${head}
              <style>${css}</style>
              <script>${js}</script>
              ${bodyWithGalleries}
            </html>
          `
          writeHome(index)
        })
      })
    })
  })

readConfig(composeIndex)

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
*/