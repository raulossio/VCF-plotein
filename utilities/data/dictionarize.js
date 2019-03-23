const fs = require('fs');
const goterms = require('./gotermDict.json');

let dict = {}
for (const g of goterms) {
  dict[g.id] = {
    id: g.id,
    name: g.name,
    namespace: g.namespace,
    def: g.def
  }
}

fs.writeFileSync('./gotermInfo.json', JSON.stringify(dict));
