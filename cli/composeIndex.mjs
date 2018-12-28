/*
  Extract data from config.js and compose a static index.html
  It uses template files
  Run it with :
  $ node --experimental-modules  cli/composeIndex.mjs
*/

import fs from 'fs'
import path from 'path'
import {promisify} from 'util'
import yaml from 'js-yaml'
import slugify from './slugify.mjs'

const tplDir = './cli/template'

const configGalleries = 'galleries.yaml'
const tplHead = path.join(tplDir, 'tpl-head.html')
const tplCss = path.join(tplDir, 'tpl-style.css')
const tplJS = path.join(tplDir, 'tpl-script.js')
const tplBody = path.join(tplDir, 'tpl-body.html')
const tplGalleries = path.join(tplDir, 'tpl-galleries.html')

const readFile = promisify(fs.readFile)

const readIndexFiles = Promise.all([
  readFile(configGalleries, 'utf-8').then(configGalleries => ({configGalleries: yaml.load(configGalleries)})),
  readFile(tplHead, 'utf-8').then(head => ({head: head})),
  readFile(tplCss, 'utf-8').then(css => ({css: css})),
  readFile(tplJS, 'utf-8').then(js => ({js: js})),
  readFile(tplBody, 'utf-8').then(body => ({body: body})),
  readFile(tplGalleries, 'utf-8').then(galleries => ({galleries: galleries}))
])

readIndexFiles.then(tplsData => {
  const {configGalleries, head, js, css, body, galleries} = Object.assign({}, ...tplsData)
  const htmlGalleries = composeGalleries(configGalleries, galleries)
  const bodyWithGalleries = nano(body, {galleries: htmlGalleries})
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

const composeGalleries = (config, tpl) =>
  config.map(galleryData => composeGallery(galleryData, tpl)).join('')

const composeGallery = (data, tpl) => {
  const datas = {
    title: data.title,
    description: data.description,
    img: data.img,
    href: `/galleries/${slugify(data.title)}.html`,
    src: `https://www.olifish.com/light-thumbs/thumb-${data.img}.jpg`
  }
  return nano(tpl, datas)
}

/* Nano Templates - https://github.com/trix/nano */
function nano(template, data) {
  return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
    var keys = key.split("."), v = data[keys.shift()]
    for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]]
    return (typeof v !== "undefined" && v !== null) ? v : ""
  })
}
