import path from 'path'

const siteUrl = new URL('https://olivier-colli.github.io/olifish-fr')
const photosRepoUrl = new URL('https://olivier-colli.github.io/olifish-photos')
const DBUrl = new URL('https://olivier-colli.github.io/olifish-photos')
const tplDir = './cli/template'

export default {
    siteUrl: siteUrl,
    photosRepoUrl: photosRepoUrl,
    dbUrl: new URL(`${DBUrl}/data.json`),
    galleriesDir: './galeries',
    configGalleries: 'galleries.yaml',
    tplHead: path.join(tplDir, 'tpl-head.html'),
    tplCss: path.join(tplDir, 'tpl-style.css'),
    tplIndexCss: path.join(tplDir, 'tpl-index.css'),
    tplJS: path.join(tplDir, 'tpl-script.js'),
    tplPhotoswipe: path.join(tplDir, 'tpl-photoswipe.html'),
    tplHeader: path.join(tplDir, 'tpl-header.html'),
    tplIndex: path.join(tplDir, 'tpl-index.html'),
    tplGallery: path.join(tplDir, 'tpl-gallery.html'),
    tplGalleries: path.join(tplDir, 'tpl-galleries.html'),
    tplThumb: path.join(tplDir, 'tpl-thumb.html')
}
