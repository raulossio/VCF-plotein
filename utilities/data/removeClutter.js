const fs = require('fs');
const gotermMapping = require('./gotermMapping');
const genes_37 = require('./genes_37');
const genes_38 = require('./genes_38');

let gotermsOf = {};
for (const [index, goterm] of gotermMapping.entries()) {
  let go = Object.keys(goterm)[0];
  let values = Object.values(goterm)[0];
  for (const ensg of values) {
    if (!(ensg in gotermsOf)) {
      gotermsOf[ensg] = [];
    }
    gotermsOf[ensg].push(go);
  }
}

const createInfoFile = (file) => {
  let data = {}
  for (const gene of file) {
    data[gene['Gene stable ID']] = {
      name: gene['Gene name'],
      chr: gene['Chromosome'],
      go: gotermsOf[gene['Gene stable ID']]
    }
  }

  let json = JSON.stringify(data);
  fs.writeFile('genes_info.json', json, 'utf8');
}

const removeColumns = (file) => {
  let data = file.map(gene => ({
    id: gene["Gene stable ID"],
    start: gene["Gene start (bp)"],
    end: gene["Gene end (bp)"]
  }))
  let json = JSON.stringify(data);
  fs.writeFile('genes_38.json', json, 'utf8');
}

// createInfoFile(genes_38)
// removeColumns(genes_37)
// removeColumns(genes_38)
