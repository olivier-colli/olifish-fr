/*
  Extract data from config.js and compose a static index.html
  It uses template files
  Run it with :
  $ node --experimental-modules  cli/composeIndex.mjs
*/

import fs from 'fs'
import slugify from './slugify.mjs'
import readConfig from './readConfig.mjs'

const tpl_head = './cli/template/tpl-head.html'
const tpl_css = './cli/template/tpl-style.css'
const tpl_js = './cli/template/tpl-script.js'
const tpl_index = './cli/template/tpl-index.html'

const composeIndex = config =>
  fs.readFile(tpl_head, 'utf8', (err, head) => {
    if (err) throw err
    fs.readFile(tpl_css, 'utf8', (err, css) => {
      if (err) throw err
      fs.readFile(tpl_js, 'utf8', (err, js) => {
        if (err) throw err
        fs.readFile(tpl_index, 'utf8', (err, body) => {
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
