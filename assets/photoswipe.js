const photoSwipe = {}

photoSwipe.init = () =>
    Array.from(document.querySelectorAll('.fish a[itemprop=contentUrl]'))
        .map(a => { a.onclick = photoSwipe.onThumbnailsClick })

photoSwipe.parseThumbnailElements = gallerySelector =>
    Array.from(document.querySelectorAll(`${gallerySelector} figure`)).map(figureEl => {
        const linkEl = figureEl.querySelector('a')
        const size = linkEl.getAttribute('data-size').split('x')
        const item = {
            src: linkEl.getAttribute('href'),
            w: parseInt(size[0], 10),
            h: parseInt(size[1], 10)
        }
        item.title = figureEl.querySelector('a img').alt
        item.msrc = linkEl.querySelector('img').getAttribute('src')
        item.el = figureEl
        return item
    })

photoSwipe.onThumbnailsClick = evt => {
    evt.preventDefault()
    photoSwipe.openPhotoSwipe(evt.target.getAttribute('data-id'))
}

photoSwipe.openPhotoSwipe = (index, disableAnimation, fromURL) => {
    const pswpElement = document.querySelector('.pswp')
    const items = photoSwipe.parseThumbnailElements('.fish')
    const options = {
        getThumbBoundsFn: index => {
            // See Options -> getThumbBoundsFn section of documentation for more info
            const thumbnail = items[index].el.querySelector('img')
            const pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            const rect = thumbnail.getBoundingClientRect()

            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
        },
        shareButtons: [
            { id: 'download', label: 'Download image', url: '{{raw_image_url}}', download: true }
        ],
        maxSpreadZoom: 10
    }
    options.index = parseInt(index, 10)
    if (disableAnimation) {
        options.showAnimationDuration = 0
    }

    const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)
    gallery.init()
}
