/*

*/

const photosRepo = 'https://olivier-colli.github.io/olifish-photos'
const galleriesDir = 'galeries'

window.addEventListener('DOMContentLoaded', evt => {
    if (document.location.hash) {
        document.title += ' ' + location.hash.replace(/^#/, ' ')
    }
})

window.onhashchange = () => {
    display.imgsByQuery(document.location.hash)
}

const Db = class {
    constructor() {
        this.data = []
    }

    find(query) {
        if (!query) {
            return this.data
        }
        return this.data.filter(item => {
            return (
                this.slugify(JSON.stringify(item)).indexOf(
                    this.slugify(query)
                ) !== -1
            )
        })
    }

    slugify(text) {
        const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
        const b = 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
        const p = new RegExp(a.split('').join('|'), 'g')

        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(p, c => b.charAt(a.indexOf(c))) // Replace special chars
            .replace(/&/g, '-and-') // Replace & with 'and'
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '') // Trim - from end of text
    }
}

const display = {}

display.imgsByQuery = query => {
    const imgsSelect = ImgsDb.find(query)
    display.imgs(imgsSelect)
}

display.imgs = imgsSelect => {
    const area = document.querySelector('div.fish')
    const tpl = document.querySelector('#img')

    function fishnametoAnchor(fishname) {
        try {
            return fishname
                .split(' ')
                .map(
                    name =>
                        `<a href="/${galleriesDir}/#${ImgsDb.slugify(
                            name
                        )}">${name}</a>`
                )
                .join(' ')
        } catch (err) {
            return '-'
        }
    }

    // area.className = 'fish'
    area.innerHTML = ''
    imgsSelect.map(metas => {
        const a = tpl.content.querySelector('a')
        const thumb = tpl.content.querySelector('img')
        const pLatin = tpl.content.querySelector('figcaption')
        const pName = tpl.content.querySelector('h3')

        a.href = `${photosRepo}/${metas.filepath.img}`
        a.setAttribute(
            'data-caption',
            `${metas.nameLat} - <i>${metas.nameFr}</i>`
        )
        a.setAttribute(
            'data-size',
            `${metas.imgSize.width}x${metas.imgSize.height}`
        )

        thumb.src = `${photosRepo}/${metas.filepath.thumb}`
        thumb.setAttribute('data-id', area.childElementCount)
        thumb.style.width =
            metas.thumbSize.width > metas.thumbSize.height ? '300px' : '133px'
        thumb.style.height = '200px'
        thumb.title = metas.location
        thumb.alt = `${metas.nameLat} - ${metas.nameFr}`

        pLatin.innerHTML = fishnametoAnchor(metas.nameLat)
        pName.innerHTML = fishnametoAnchor(metas.nameFr)

        const clone = document.importNode(tpl.content, true)
        area.appendChild(clone)
    })
}

const ImgsDb = new Db()

fetch(`${photosRepo}/data.json`)
    .then(response => response.json())
    .then(json => {
        console.info('DATA LOADED')
        ImgsDb.data = json
        if (document.location.hash) {
            display.imgsByQuery(document.location.hash)
        }
        photoSwipe.init()
    })
