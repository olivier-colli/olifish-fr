/*
  Extract data from config.js and with index-tpl.html compose a static index.html
  The script return the pageName to Bash
*/

import fs from 'fs'
import moment from 'moment'
import slugify from './slugify.mjs'
import readConfig from './readConfig.mjs'

const writeSiteMap = config =>
  fs.writeFile('sitemap.xml', generateSitemap(config), err => {
    if (err) throw err
  })

readConfig(writeSiteMap)

const generateSitemap = config => {
    const urlElement = config.map(gallery =>
    `
    <url>
      <loc>https://www.olifish.com/galleries/${slugify(gallery.title)}.html</loc>
      <lastmod>${moment().format('YYYY-MM-DD')}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8000</priority>
    </url>`
    ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">	  	  
    <!-- www.check-domains.com sitemap generator -->

  <url>
    <loc>https://www.olifish.com/</loc>
    <lastmod>${moment().format('YYYY-MM-DD')}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0000</priority>
  </url>
  ${urlElement}
</urlset>
  `
  return xml
}
