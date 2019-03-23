import Genes37 from '~/utilities/data/genes_37'
import Genes38 from '~/utilities/data/genes_38'
import GenesInfo from '~/utilities/data/genes_info'

import LazyIntervalTree from "interval-tree-type";

const version37 = {genes: Genes37, tree: new LazyIntervalTree()}
const version38 = {genes: Genes38, tree: new LazyIntervalTree()}

const constructTree = (obj) => {
  for (let i = 0; i < obj.genes.length; i++) {
    obj.tree.insert(
      obj.genes[i].start,
      obj.genes[i].end,
      Object.assign({
        treeId: i,
        id: obj.genes[i].id,
        start: obj.genes[i].start,
        end: obj.genes[i].end,
      }, GenesInfo[obj.genes[i].id])
    )
  }
}

if (!process.server) {
  console.time('interval-tree-37')
  constructTree(version37)
  console.timeEnd('interval-tree-37')

  console.time('interval-tree-38')
  constructTree(version38)
  console.timeEnd('interval-tree-38')
}

export const positionToName = ({genes, version}) => {
  let obj = (version === 37 ? version37 : version38)
  let items = []
  let set = new Set()

  for (var i = 0; i < genes.length; i++) {
    for (const interval of obj.tree.queryPoint(genes[i].pos)) {
      if (interval.value.chr === genes[i].chrom && !set.has(interval.value.treeId)) {
        set.add(interval.value.treeId)
        items.push(interval.value)
      }
    }
  }

  return items
}
