import fs from 'fs'

export default callback =>
  fs.readFile('config.json', 'utf8', (err, json) => {
    if (err) throw err
    const config = JSON.parse(json)
    callback(config)
  })
