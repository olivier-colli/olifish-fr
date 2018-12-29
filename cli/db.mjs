import axios from 'axios'
import {slugify} from './utils.mjs'
import fp from './filesPath.mjs'

export default {
    load: () => axios.get(fp.db),
    findAll: (db, query) => db.filter(metas =>
        slugify(JSON.stringify(metas)).indexOf(slugify(query)) !== -1
    )
}
