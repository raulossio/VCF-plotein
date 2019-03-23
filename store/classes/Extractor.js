import assert from 'assert'

import Colorgorical from '~/utilities/colorgorical'
import ColorsGoogle10 from '~/utilities/colorsGoogle10'

export default class Extractor {
  constructor () {
    this.colorOf = {count:0};
  }

  set sampledict (vcf_vars) {
    this.samplesOf = {}
    this.counter = 0
    for (const v of vcf_vars) {
      this.samplesOf[this._variantToString(v)] = v.samples
    }
  }

  // PARSERS

  parseInfo (data, selectedTranscript) {
    this._assertProperties(data, ['id', 'display_name', 'Transcript'])
    let verification = (t) => {
      return (selectedTranscript ? t.id === selectedTranscript : t.is_canonical === 1)
    }
    let info = {name: data.display_name, id: data.id}
    for (const [i, t] of data.Transcript.entries()) {
      if (verification(t) && 'Translation' in t) {
        console.log('Transcript:', t)
        info.transcript_id = t.id
        info.protein_id = t.Translation.id
        info.length = t.Translation.length
        if (t.is_canonical) {
          info.canonical = t.id
        }
      }
    }
    console.log('Info:', info)
    return info
  }

  parseDomains (data) {
    let newList = []
    for (const [i, d] of data.entries()) {
      newList.push({
        id: i,
        name: d.description,
        start: d.start,
        end: d.end,
        family: d.id,
        color: this._getColor(d.id),
        status: d.id.startsWith('PF')
      })
    }
    return newList
  }

  parseConsequences (data) {
    let newList = []
    for (const [i, c] of data.entries()) {
      newList.push({
        id: i,
        name: c,
        color: ColorsGoogle10[i % ColorsGoogle10.length],
        status: true
      })
    }
    return newList
  }

  parseVariant (v, t) {
    this._assertProperties(this, ['samplesOf', 'counter'])
    return {
      id: ++this.counter,
      chr: v.chr,
      pos: v.pos,
      ref: v.ref,
      alt: v.alt,
      aa_pos: t.protein_start,
      aa_change: t.amino_acids,
      consequences: t.consequence_terms,
      impact: t.impact,
      sift_score: t.sift_score,
      sift_prediction: t.sift_prediction,
      polyphen_score: t.polyphen_score,
      polyphen_prediction: t.polyphen_prediction,
      samples: this._validSamples(this.samplesOf[this._variantToString(v)]),
      type: 'variant'
    }
  }

  nonConfidentialInfo (variants) {
    return variants.map(v => ({
      id: v.id,
      chr: v.chr,
      pos: v.pos,
      ref: v.ref,
      alt: v.alt
    }))
  }

  mergeVariantsAndDb (variants, db_presence) {
    let dbinfo = this._dbPresenceToDict(db_presence)
    let newList = []
    for (const v of variants) {
      newList.push(Object.assign(dbinfo[v.id], v))
    }
    return newList
  }

  // HELPERS

  _assertProperties (obj, keys) {
    for (const key of keys) {
      assert(obj.hasOwnProperty(key), `Extractor: ${key} not found in ${Object.keys(obj)}`)
    }
  }

  _validSamples (samples) {
    let newList = []
    for (const sample of samples) {
      if (sample.value !== '0/0' && sample.value !== './.') {
        newList.push(sample)
      }
    }
    return newList
  }

  _variantToString (v) {
    return `${v.chr}${v.pos}${v.ref}`
  }

  _dbPresenceToDict (db_presence) {
    let dict = {}
    for (const dbs of db_presence) {
      dict[dbs.id] = dbs
    }
    return dict
  }

  _getColor (name) {
    if (!this.colorOf.hasOwnProperty(name)) {
      let pos = this.colorOf.count % Colorgorical.length
      this.colorOf[name] = Colorgorical[pos]
      this.colorOf.count += 1
    }
    return this.colorOf[name]
  }
}
