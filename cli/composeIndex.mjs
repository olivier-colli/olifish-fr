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
import fp from './filesPath.mjs'
import nano from './nano.mjs'

const readFile = promisify(fs.readFile)

const readIndexFiles = Promise.all([
    readFile(fp.configGalleries, 'utf-8').then(configGalleries => (['configGalleries', yaml.load(configGalleries)])),
    readFile(fp.tplHead, 'utf-8').then(head => (['head', head])),
    readFile(fp.tplCss, 'utf-8').then(css => (['css', css])),
    readFile(fp.tplJS, 'utf-8').then(js => (['js', js])),
    readFile(fp.tplHeader, 'utf-8').then(header => (['header', header])),
    readFile(fp.tplIndex, 'utf-8').then(body => (['body', body])),
    readFile(fp.tplGalleries, 'utf-8').then(galleries => (['galleries', galleries]))
])

readIndexFiles.then(promisesResult => {
    const file = keysValueArraysToMap(promisesResult)

    const htmlGalleries = composeGalleries(file.get('configGalleries'), file.get('galleries'))
    const body = nano(file.get('body'), {galleries: htmlGalleries})
    const index = `
        ${file.get('head')}
        <style>${file.get('css')}</style>
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

function composeGallery(data, tpl) {
    const datas = {
        title: data.title,
        description: data.description,
        img: data.img,
        href: `/galleries/${slugify(data.title)}.html`,
        src: `https://www.olifish.com/light-thumbs/thumb-${data.img}.jpg`
    }
    return nano(tpl, datas)
}
