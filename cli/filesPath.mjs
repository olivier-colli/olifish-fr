import path from 'path'

const tplDir = './cli/template'

export default {
    db: 'https://www.olifish.com/data.json',
    configGalleries: 'galleries.yaml',
    tplHead: path.join(tplDir, 'tpl-head.html'),
    tplCss: path.join(tplDir, 'tpl-style.css'),
    tplJS: path.join(tplDir, 'tpl-script.js'),
    tplPhotoswipe: path.join(tplDir, 'tpl-photoswipe.html'),
    tplHeader: path.join(tplDir, 'tpl-header.html'),
    tplIndex: path.join(tplDir, 'tpl-index.html'),
    tplGallery: path.join(tplDir, 'tpl-gallery.html'),
    tplGalleries: path.join(tplDir, 'tpl-galleries.html'),
    tplThumb: path.join(tplDir, 'tpl-thumb.html')
}
