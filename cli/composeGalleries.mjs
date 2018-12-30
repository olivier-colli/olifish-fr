/*
  Extract data from config.js and with *-tpl.html compose static index.html
  The script return the pageName to Bash
*/

import fs from 'fs'
import path from 'path'
import {promisify} from 'util'
import yaml from 'js-yaml'
import db from './db.mjs'
import {slugify, keysValueArraysToMap} from './utils.mjs'
import path_ from './path.mjs'
import nano from './nano.mjs'

const readFile = promisify(fs.readFile)

const readIndexFiles = Promise.all([
    db.load().then(db => ['db', db.data]),
    readFile(path_.configGalleries, 'utf-8').then(configGalleries => (['configGalleries', yaml.load(configGalleries)])),
    readFile(path_.tplHead, 'utf-8').then(head => (['head', head])),
    readFile(path_.tplCss, 'utf-8').then(css => (['css', css])),
    readFile(path_.tplJS, 'utf-8').then(js => (['js', js])),
    readFile(path_.tplPhotoswipe, 'utf-8').then(photoswipe => (['photoswipe', photoswipe])),
    readFile(path_.tplHeader, 'utf-8').then(header => (['header', header])),
    readFile(path_.tplGallery, 'utf-8').then(body => (['body', body])),
    readFile(path_.tplThumb, 'utf-8').then(thumb => (['thumb', thumb])),
])

readIndexFiles.then(promisesResult => {
    const file = keysValueArraysToMap(promisesResult)
    file.get('configGalleries').map(galleryMeta => {
        const photosMetas = db.findAll( file.get('db'), galleryMeta.title)
        const gallery = composeGallery(galleryMeta, photosMetas, file)
        const body = nano(file.get('body'), {gallery: gallery})
        const galleryPage = `
            ${file.get('head')}
            <style>${file.get('css')}</style>
            <script>${file.get('js')}</script>
            ${file.get('photoswipe')}
            ${file.get('header')}
            ${body}
        </html>
        `
        const galleryPath = path.join(path_.galleriesDir, `${slugify(galleryMeta.title)}.html`)
        writeGallery(galleryPath, galleryPage)
    })
})

function composeGallery(galleryMetas, photosMetas, file) {
    let htmlGallery = '<div class=fish>'
    let counter = 0
    for (const meta of photosMetas) {
        let metas = {   
            fishname: meta.Fr,
            fishnameLatin: meta.Lat,
            imgSize: meta.targetImageSize,
            imgUrl: new URL(meta.fileName.img, path_.photosRepoUrl.href),
            Id: counter++,
            thumbUrl: new URL(meta.fileName.thumbnail, path_.photosRepoUrl.href),
            thumbWidth: meta.imageSize.split('x')[0]+'px',
            thumbHeight: meta.imageSize.split('x')[1]+'px',
            title: meta.title,
        }
        htmlGallery += nano(file.get('thumb'), metas)
    }
    return htmlGallery
}

function writeGallery(name, content) {
    fs.writeFile(name, content, 'utf8', err => {
        if (err) throw err
    })
}
