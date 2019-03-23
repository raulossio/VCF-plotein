const eps = 1e-6

const normalizeData = ({ mutations, transAASize, width }) => {
  let list = mutations.map((mutation) => {
    return Object.assign({
      protein_position: (mutation.aa_pos * width) / transAASize
    }, mutation)
  })
  return list
}

const splitGraph = ({ mutations, leftMargin, radius }) => {
  let nodes = []
  for (var i = 0; i < mutations.length; i++) {
    nodes.push(mutations[i].protein_position)
  }
  let free = [leftMargin]
  for (let i = 1; i < nodes.length; i++) {
    free.push(nodes[i] - nodes[i - 1] - 2 * radius)
  }
  free.push(0)
  return {nodes, free, radius}
}

const solveCollisions = ({ nodes, free, radius }) => {
  let bias = 0
  for (let i = 0; i < nodes.length; i++) {
    if (free[i] < 0) {
      bias = Math.abs(nodes[i] - nodes[i - 1] - 2 * radius)
      nodes[i] += bias
      free[i] = 0
      free[i + 1] -= bias
    }
  }
  return {nodes, free, radius}
}

const bringBack = ({ nodes, free, mutations, radius }) => {
  let l = 0
  while (l < nodes.length - 1) {
    let r = l + 1
    while (r < nodes.length && Math.abs(nodes[r] - mutations[r].protein_position) > eps) {
      r++
    }
    if (r - l > 1) {
      for (let i = l; i < r; i++) {
        let change = Math.min(
          (r - i - 1) * (radius * 0.5),
          free[i]
        )
        nodes[i] -= change
        free[i + 1] += change
      }
    }
    l = r
  }
  return nodes
}

export default ({ transAASize, width, data, leftMargin, radius }) => {
  let mutations = normalizeData({ mutations: data, transAASize, width })

  let graph = solveCollisions(splitGraph({
    mutations, leftMargin, radius
  }))

  let finalPos = bringBack({
    nodes: graph.nodes,
    free: graph.free,
    mutations,
    radius
  })

  for (let i = 0; i < mutations.length; i++) {
    mutations[i].position = finalPos[i]
  }

  return mutations
}
