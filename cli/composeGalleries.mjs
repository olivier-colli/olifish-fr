/*
  Extract data from config.js and with index-tpl.html compose a static index.html
  The script return the pageName to Bash
*/

import fs from 'fs'
import {promisify} from 'util'
import yaml from 'js-yaml'
import db from './db.mjs'
import {slugify, keysValueArraysToMap} from './utils.mjs'
import fp from './filesPath.mjs'
import nano from './nano.mjs'

const readFile = promisify(fs.readFile)

const readIndexFiles = Promise.all([
    db.load().then(db => ['db', db.data]),
    readFile(fp.configGalleries, 'utf-8').then(configGalleries => (['configGalleries', yaml.load(configGalleries)])),
    readFile(fp.tplHead, 'utf-8').then(head => (['head', head])),
    readFile(fp.tplCss, 'utf-8').then(css => (['css', css])),
    readFile(fp.tplJS, 'utf-8').then(js => (['js', js])),
    readFile(fp.tplPhotoswipe, 'utf-8').then(photoswipe => (['photoswipe', photoswipe])),
    readFile(fp.tplHeader, 'utf-8').then(header => (['header', header])),
    readFile(fp.tplGallery, 'utf-8').then(body => (['body', body])),
    readFile(fp.tplThumb, 'utf-8').then(thumb => (['thumb', thumb])),
])

readIndexFiles.then(promisesResult => {
    const file = keysValueArraysToMap(promisesResult)
    file.get('configGalleries').map(galleryMeta => {
        const photos = db.findAll( file.get('db'), galleryMeta.title)
        const gallery = composeGallery(galleryMeta, photos, file.get('thumb'))
        writeGallery(`galleries/${slugify(galleryMeta.title)}.html`, gallery)
    })
})

function composeGallery(meta, photos, tplThumb) {
    let htmlGallery = `<h1>${meta.title}</h1><div class="fish">`
    for (const photo of photos) {
        let metas = {   
            fr: '',
            lat: '',
            targetImageSize: '',
            fileNameImg: '',
            index: '',
            fileNameThumbnail: '',
            imgWidth: '',
            imgHeight: '',
            title: 'Poision',
            fishnameFr: photo.keywords.Fr,
            fishnameLat: '' 
        }
        htmlGallery += nano(tplThumb, metas)
    }
    return htmlGallery
}

/*
        .map((metas, index) => {
            const img = {}
            const fishname = {}
            const [width, height] = metas.imageSize.split('x')

            function fishnametoAnchor(fishname) {
            try {
                return fishname.split(' ')
                .map(word => `<a href="/galleries/#${slugify(word)}">${word}</a>`)
                .join(' ')
            } catch (err) {
                return '-'
            }
            }

            img.width = +width > +height ? '300px' : '133px'
            img.height = '200px'
            fishname.fr = fishnamc <&      font-size: 1.2em;
            line-height: 2.5em;zetoAnchor(metas.Fr)
            fishname.lat = fishnametoAnchor(metas.Lat)
            return `
                <figure class="img" itemprop="associatedMedia" itemscope="" itemtype="http://schema.org/ImageObject">
                <a data-caption="${metas.Fr} - <i>${metas.Lat}</i>" itemprop="contentUrl" data-size="${metas.targetImageSize}" href="${metas.fileName.img}">
                <img itemprop="thumbnail" alt="${metas.Fr} - ${metas.Lat}" data-id="${index}" src="${metas.fileName.thumbnail}" style="width: ${img.width}; height: ${img.height};" title="${metas.title}">
                </a>
                <figcaption itemprop="caption description">${fishname.fr}</figcaption>   
                <h3>${fishname.lat}</h3>
                </figure>
            `
        } 
      )
      .join()
      htmlGallery += '</div>'
      const galleryPage = header + style + html.replace('${photos}', htmlGallery)
      writeGallery(`galleries/${slugify(galleryData.title)}.html`, galleryPage)
})
*/

function writeGallery(name, content) {
    fs.writeFile(name, content, 'utf8', err => {
        if (err) throw err
    })
}

function composeGalleries(config) {
    return config.map(galleryData => composePhoto(galleryData)).join('')
}

function composePhoto(data) {
    const {title, description, img} = data
    return `
        <figure class="img">
        <a href="/galleries/${slugify(title)}.html" class="gallery">
            <img src="./light-thumbs/thumb-${img}.jpg" alt="${title}">
        </a>
        <figcaption itemprop="caption description">${description}</figcaption>
        <h3>${title}</h3>
        </figure>
    `
}
