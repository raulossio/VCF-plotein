import pako from 'pako'
import zlib from 'zlib'

let keys
let NONSAMPLES = [
  'ALT',
  'CHROM',
  'FILTER',
  'FORMAT',
  'ID',
  'INFO',
  'POS',
  'QUAL',
  'REF'
]

// UTILITIES

const valuesToMiniObject = (values) => {
  let obj = {}
  for (let i = 0; i <= 1; ++i) {
    obj[keys[i]] = values[i]
  }
  return obj
}

const valuesToObject = (values) => {
  let obj = {}
  for (var i = values.length - 1; i >= 0; i--) {
    obj[keys[i]] = values[i]
  }
  return obj
}

const columnsNames = (line) => {
  let keys = line.trim().split('\t')
  keys[0] = keys[0].substr(1, keys.length)
  return keys
}

const getSamples = (raw) => {
  return Object.keys(raw)
    .filter(key => NONSAMPLES.includes(key) === false)
    .map((key, id) => ({
      name: key,
      value: raw[key].slice(0,3),
      status: true,
      id: id
    }))
}

// LINE READERS

const getVariantIfSameGene = (line, gene) => {
  if (line.startsWith('./.') || line.startsWith('##')) {
    return
  }
  if (line[0] === '#') {
    keys = columnsNames(line)
    return
  }
  let values = line.trim().split('\t')
  let obj = valuesToObject(values)
  if (obj['POS'] === undefined) {
    return
  }
  let x = parseInt(obj['POS'])
  if (gene.start <= x && x <= gene.end) {
    return {
      chr: parseInt(obj['CHROM'].match( /\d+/g )),
      pos: obj.POS,
      ref: obj.REF,
      alt: obj.ALT,
      samples: getSamples(obj)
    }
  }
}

const obtainsGeneInLine = (line) => {
  if (line.startsWith('./.')) {
    return
  }
  if (line.startsWith('##')) {
    if (line.startsWith('##reference')) {
      const matches = line.match( /\d+/g )
      const x = parseInt(matches[matches.length - 1])
      return {
        version: (x !== 38 ? 37 : 38),
      }
    }
    return
  }
  if (line[0] === '#') {
    keys = columnsNames(line)
    return
  }
  const values = line.trim().split('\t')
  const obj = valuesToMiniObject(values)
  if (obj['POS'] === undefined) {
    return
  }

  return {
    chrom: parseInt(obj['CHROM'].match( /\d+/g )) || obj['CHROM'],
    pos: parseInt(obj['POS'])
  }
}

// READERS

export const readVCFGenes = (path) => {
  return new Promise(async (resolve, reject) => {
    console.time('readfile')
    const fileContents = await readFileAsText(path)
    console.timeEnd('readfile')
    const allLines = fileContents.split(/\r\n|\n/)

    let genes = []
    let version = 37
    for (var i = 0; i < allLines.length; i++) {
      try {
        let gene = obtainsGeneInLine(allLines[i])
        if (gene) {
          if (gene.version) version = gene.version
          else genes.push(gene)
        }
      } catch (err) {
        reject(err)
      }
    }
    resolve({genes, version})
  })
}

export const readVCFVariants = (path, gene) => {
  return new Promise(async (resolve) => {
    const fileContents = await readFileAsText(path)
    const allLines = fileContents.split(/\r\n|\n/)

    let res = allLines.map((line) => getVariantIfSameGene(line, gene)).filter(x => x)
    resolve(res)
  })
}

const ungzip = (buffer) => {
  return pako.inflate(buffer, { to: 'string' });
}

// READ FILE

export const readFileAsText = (inputFile) => {
  const temporaryFileReader = new FileReader()
  const isCompressed = inputFile.name.endsWith('.vcf.gz')

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort()
      reject(new DOMException("Problem parsing input file."))
    }

    temporaryFileReader.onload = () => {
      let contents = temporaryFileReader.result
      if (isCompressed) {
        const arr = new Uint8Array(contents)
        console.log(arr.length)
        contents = ungzip(arr)
        console.log(contents.length)
      }
      resolve(contents)
    }

    if (isCompressed) {
      temporaryFileReader.readAsArrayBuffer(inputFile)
    } else {
      temporaryFileReader.readAsText(inputFile)
    }
  })
}
