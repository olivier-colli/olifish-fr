/*
  Extract data from config.js and with index-tpl.html compose a static index.html
  The script return the pageName to Bash
*/

import fs from 'fs'
import path from 'path'
import {promisify} from 'util'
import yaml from 'js-yaml'
import axios from 'axios'

const tplDir = './cli/template'

const dbUrl = 'https://www.olifish.com/data.json'
const configGalleries = 'galleries.yaml'
const tplHead = path.join(tplDir, 'tpl-head.html')
const tplCss = path.join(tplDir, 'tpl-style.css')
const tplJS = path.join(tplDir, 'tpl-script.js')

const readFile = promisify(fs.readFile)

axios.get(dbUrl)
    .then(response => console.log(response))
    .catch(error => console.log(error))

// httpsGet(dbUrl).then(data => data).then(data => console.log(data))


/*
const readGalleriesFiles = Promise.all([
    readFile(configGalleries, 'utf-8').then(configGalleries => ({configGalleries: yaml.load(configGalleries)})),
    readFile(tplHead, 'utf-8').then(head => ({head: head})),
    readFile(tplCss, 'utf-8').then(css => ({css: css})),
    readFile(tplJS, 'utf-8').then(js => ({js: js})),
])

readGalleriesFiles.then(tplsData => {
    console.log(tplsData)
})

/*
readConfig(composeGallery)

function composeGallery(config) {
  fs.readFile('tpl-header.html', 'utf8', (err, header) => {
    if (err) throw err
    fs.readFile('tpl-style.html', 'utf8', (err, style) => {
      if (err) throw err
      fs.readFile('tpl-gallery.html', 'utf8', (err, html) => {
        if (err) throw err
        fs.readFile('data.json', 'utf8', (err, data) => {
          config.map(galleryData => {
            let htmlGallery = '<div class="fish">'
            htmlGallery += JSON.parse(data)
              .filter(metas =>
                slugify(JSON.stringify(metas)).indexOf(slugify(galleryData.title)) !== -1
              )
              .sort((a, b) => (a.Fr > b.Fr) ? 1 : ((b.Fr > a.Fr) ? -1 : 0) )
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
            `} 
            )
            .join()
            htmlGallery += '</div>'
            const galleryPage = header + style + html.replace('${photos}', htmlGallery)
            writeGallery(`galleries/${slugify(galleryData.title)}.html`, galleryPage)
          })
        })
      })
    })
  })
}

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
*/
