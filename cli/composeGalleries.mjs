/*
  Extract data from config.js and with *-tpl.html compose static index.html
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
        writeGallery(`galleries/${slugify(galleryMeta.title)}.html`, galleryPage)
    })
})

function composeGallery(galleryMetas, photosMetas, file) {
    let htmlGallery = '<div class=fish>'
    for (const meta of photosMetas) {
        let counter = 0
        let metas = {   
            fishname: meta.Fr,
            fishnameLatin: meta.Lat,
            imgSize: meta.targetImageSize,
            imgUrl: new URL(meta.fileName.img, fp.imgsUrl.href),
            Id: counter++,
            thumbUrl: new URL(meta.fileName.thumbnail, fp.thumbsUrl.href),
            thumbWidth: meta.imageSize.split('x')[0]+'px',
            thumbHeight: meta.imageSize.split('x')[1]+'px',
            title: meta.title
        }
        htmlGallery += nano(file.get('thumb'), metas)
    }
    return htmlGallery
}

/*
{
    keywords:['Nom allemand','Nom anglais','nom francais','nom latin'],
    De:'Partnergarnele'
    Eng:'Anemone shrimp'
    Fr: 'Crevette commensale'
    Lat':'Ancylomenes Sarasvati',
    fileName: {'thumbnail':'/light-thumbs/thumb-734.jpg','img':'/img/img-734.jpg'}
    dateCreated: "2010-01-01T00:00:00.000Z",
    imageSiz":"300x200",
    targetImageSize:"2400x1600",
    location:"egypte-coral-garden-nov-2017",
    title:"Canon EOS 6D"
/*
        .map((metas, index) => {
            const img = {}
            const fishname = {}
            const [width, height] = metas.imageSize.split('x')

            function fishnametoAnchor(fishname) {
            try {
                return fishname.split(' ')
                .map(word => `<a href='/galleries/#${slugify(word)}'>${word}</a>`)
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
                <figure class='img' itemprop='associatedMedia' itemscope='' itemtype='http://schema.org/ImageObject'>
                <a data-caption='${metas.Fr} - <i>${metas.Lat}</i>' itemprop='contentUrl' data-size='${metas.targetImageSize}' href='${metas.fileName.img}'>
                <img itemprop='thumbnail' alt='${metas.Fr} - ${metas.Lat}' data-id='${index}' src='${metas.fileName.thumbnail}' style='width: ${img.width}; height: ${img.height};' title='${metas.title}'>
                </a>
                <figcaption itemprop='caption description'>${fishname.fr}</figcaption>   
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
        <figure class='img'>
        <a href='/galleries/${slugify(title)}.html' class='gallery'>
            <img src='./light-thumbs/thumb-${img}.jpg' alt='${title}'>
        </a>
        <figcaption itemprop='caption description'>${description}</figcaption>
        <h3>${title}</h3>
        </figure>
    `
}
