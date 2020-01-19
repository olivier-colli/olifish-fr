/* 
    Nano Templates - https://github.com/trix/nano
    Allow to inject data in html template pages    
*/

export default function nano(template, data) {
    return template.replace(/\{([\w.]*)\}/g, function(str, key) {
        const keys = key.split('.')
        let v = data[keys.shift()]
        for (let i = 0, l = keys.length; i < l; i++) v = v[keys[i]]

        return typeof v !== 'undefined' && v !== null ? v : ''
    })
}
