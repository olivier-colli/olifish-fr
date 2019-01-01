/*
  Extract data from config.js and compose a static index.html
  It uses template files
  Run it with :
  $ node --experimental-modules  cli/composeIndex.mjs
*/

import fs from 'fs'
import {promisify} from 'util'
import yaml from 'js-yaml'
import {slugify, keysValueArraysToMap} from './utils.mjs'
import path_ from './path.mjs'
import nano from './nano.mjs'

const readFile = promisify(fs.readFile)

const readIndexFiles = Promise.all([
    readFile(path_.configGalleries, 'utf-8').then(configGalleries => (['configGalleries', yaml.load(configGalleries)])),
    readFile(path_.tplHead, 'utf-8').then(head => (['head', head])),
    readFile(path_.tplCss, 'utf-8').then(css => (['css', css])),
    readFile(path_.tplJS, 'utf-8').then(js => (['js', js])),
    readFile(path_.tplHeader, 'utf-8').then(header => (['header', header])),
    readFile(path_.tplIndex, 'utf-8').then(body => (['body', body])),
    readFile(path_.tplGalleries, 'utf-8').then(galleries => (['galleries', galleries]))
])

readIndexFiles.then(promisesResult => {
    const file = keysValueArraysToMap(promisesResult)

    const htmlGalleries = composeGalleries(file.get('configGalleries'), file.get('galleries'))
    const body = nano(file.get('body'), {galleries: htmlGalleries})
    const index = `
        ${file.get('head')}
        <style>${nano(file.get('css'), {'background-image': './assets/background-image.jpg'})}</style>
        <script>${file.get('js')}</script>
        ${file.get('header')}
        ${body}
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

function composeGallery(meta, tpl) {
    const datas = {
        title: meta.title,
        description: meta.description,
        img: meta.img,
        href: `./galeries/${slugify(meta.title)}.html`,
        src: `${path_.photosRepoUrl}/thumb/thumb-${meta.img}.jpg`
    }
    return nano(tpl, datas)
}
