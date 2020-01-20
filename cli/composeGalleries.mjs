/*
  Extract data from config.js and with *-tpl.html compose static index.html
  The script return the pageName to Bash
*/

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import yaml from 'js-yaml'
import db from './db.mjs'
import { slugify, keysValueArraysToMap } from './utils.mjs'
import path_ from './path.mjs'
import nano from './nano.mjs'

const readFile = promisify(fs.readFile)

const readIndexFiles = Promise.all([
    db.load().then(db => ['db', db.data]),
    readFile(path_.configGalleries, 'utf-8').then(configGalleries => [
        'configGalleries',
        yaml.load(configGalleries)
    ]),
    readFile(path_.tplHead, 'utf-8').then(head => ['head', head]),
    readFile(path_.tplCss, 'utf-8').then(css => ['css', css]),
    readFile(path_.tplJS, 'utf-8').then(js => ['js', js]),
    readFile(path_.tplPhotoswipe, 'utf-8').then(photoswipe => [
        'photoswipe',
        photoswipe
    ]),
    readFile(path_.tplHeader, 'utf-8').then(header => ['header', header]),
    readFile(path_.tplGallery, 'utf-8').then(body => ['body', body]),
    readFile(path_.tplThumb, 'utf-8').then(thumb => ['thumb', thumb])
])

readIndexFiles.then(promisesResult => {
    const file = keysValueArraysToMap(promisesResult)
    file.get('configGalleries').map(galleryMeta => {
        const photosMetas = db.findAll(file.get('db'), galleryMeta.title)
        const gallery = composeGallery(galleryMeta, photosMetas, file)
        const body = nano(file.get('body'), { gallery: gallery })
        const js = nano(file.get('js'), { galleriesDir: path_.galleriesDir })
        const galleryContent = `
            ${file.get('head')}
            <style>${file.get('css')}</style>
            <script>${js}</script>
            ${file.get('photoswipe')}
            ${file.get('header')}
            ${body}
        </html>
        `
        const galleryFilename = `${slugify(galleryMeta.title)}.html`
        writeGallery(path_.galleriesDir, galleryFilename, galleryContent)
    })
})

function composeGallery(galleryMetas, photosMetas, file) {
    let htmlGallery = '<div class=fish>'
    let counter = 0
    for (const meta of photosMetas) {
        let metas = {
            fishname: meta.nameFr,
            fishnameLatin: meta.nameLat,
            imgUrl: `${path_.photosRepoUrl}/${meta.filepath.img}`,
            Id: counter++,
            thumbUrl: `${path_.photosRepoUrl}/${meta.filepath.thumb}`,
            imgSize: `${meta.imgSize.width}x${meta.imgSize.height}`,
            thumbSizeWidth: meta.thumbSize.width,
            thumbSizeHeight: meta.thumbSize.height,
            title: meta.location
        }
        htmlGallery += nano(file.get('thumb'), metas)
    }
    return htmlGallery
}

function writeGallery(dir, name, content) {
    fs.access(dir, err => {
        if (err) {
            fs.mkdir(dir, () => {
                writeGallery(dir, name, content)
            })
        } else {
            writeGallery(dir, name, content)
        }
    })

    function writeGallery(dir, name, content) {
        fs.writeFile(path.join(dir, name), content, 'utf8', err => {
            if (err) throw err
            console.log('write gallery:', path.join(dir, name))
        })
    }
}
