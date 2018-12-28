window.dataLayer = window.dataLayer || []
function gtag(){dataLayer.push(arguments)}
gtag('js', new Date())
gtag('config', 'UA-108901544-1')

window.addEventListener('DOMContentLoaded', evt => {
    window.onsubmit = event => {
        event.preventDefault()
        const query = document.querySelector('input').value
        document.location.href = `/galleries/#${slugify(query)}`
    }
})

const slugify = text => {
    const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
    const b = 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c =>
        b.charAt(a.indexOf(c))) // Replace special chars
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}