import axios from "axios";
import { slugify } from "./utils.mjs";
import path_ from "./path.mjs";

/*
    Allow to load and find photo's metas in DB file 
*/

export default {
  load: () => axios.get(path_.dbUrl.href),
  findAll: (db, query) =>
    db
      .filter(
        metas => slugify(JSON.stringify(metas)).indexOf(slugify(query)) !== -1
      )
      .sort((a, b) => (a.nameFr > b.nameFr ? 1 : b.nameFr > a.nameFr ? -1 : 0))
};
