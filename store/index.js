import axios from 'axios'

import Api from '~/store/classes/Api'
import * as VCFParser from '~/utilities/VCFParser'
import * as GeneTree from '~/utilities/GeneTree'

const API = new Api(37)
const BASE_FILTERS = {
    clinvar: false,
    cosmic: false,
    dbSnp: false,
    gnomad: false
}
const BASE_STATE = {
        // Main
        file: null,
        version: 37,
        bookmark: { genes: {} },
        info: {},
        genes: [],
        goterms: {},
        transcripts: [],
        phenotypes: [],
        // Variants, domains and consequences
        variants: [],
        domains: [],
        consequences: [],
        sifts: [],
        polyphen_predictions: [],
        population: {},
        // Extra
        variant: {},
        spinner: false,
        v_filters: Object.assign({}, BASE_FILTERS),
    }
    //Utilities
const sortByProteinPos = (a, b) => {
    return (a.aa_pos > b.aa_pos) - (a.aa_pos < b.aa_pos)
}

const uniqueArrBy = (arr, key) => {
    let set = new Set()
    let result = arr.filter(s => !set.has(s[key]) ? set.add(s[key]) : false)
    return result
}

const countDecimals = (val) => {
    if (Math.floor(val.valueOf()) === val.valueOf()) return 0;
    return val.toString().split(".")[1].length || 0;
}
const noExponents = (val) => {
    var data = String(val).split(/[eE]/);
    if (data.length == 1) return data[0];

    var z = '',
        sign = val < 0 ? '-' : '',
        str = data[0].replace('.', ''),
        mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + '0.';
        while (mag++) z += '0';
        return z + str.replace(/^\-/, '');
    }
    mag -= str.length;
    while (mag--) z += '0';
    return str + z;
}

const minMax = (arr) => {
    var minMaxArray = arr.reduce(function(r, n) {
        r[0] = (!r[0]) ? n : Math.min(r[0], n);
        r[1] = (!r[1]) ? n : Math.max(r[1], n);
        return r;
    }, []);

    return minMaxArray;
}
const IsExponential = (val) => {
    var r = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)/g
    return String(val).match(r) !== null;
}

//Utilities
export const state = () => (BASE_STATE)

export const getters = {
    // Basic
    getApi: (state) => (API.api_url),
    getEnsembl: (state) => (API.ensembl_url),
    getFile: (state) => (state.file),
    getVersion: (state) => (state.version),
    getBookmark: (state) => (state.bookmark),
    getInfo: (state) => (state.info),
    getGenes: (state) => (state.genes),
    getGoterms: (state) => (state.goterms),
    getTranscripts: (state) => (state.transcripts),
    getPhenotypes: (state) => (state.phenotypes),
    getVariants: (state) => (state.variants),
    getDomains: (state) => (state.domains),
    getConsequences: (state) => (state.consequences),
    getSifts: (state) => (state.sifts),
    getPolyphenPredictions: (state) => (state.polyphen_predictions),
    getPopulation: (state) => (state.population),
    getSpinner: (state) => (state.spinner),
    getVariant: (state) => (state.variant),
    // Filter
    isBookmark: (state) => (state.file && state.file.name.endsWith('.json')),
    getStatusDomains: (state) => (state.domains.filter(d => d.status)),
    getPlottedVariants: (state, getters) => (state.variants.filter(v => (
        v.consequences.some(vc => getters.getStatusConsequencesNames.includes(vc)) &&
        (!v.hasOwnProperty("sift_prediction") || getters.getStatusSiftsName.includes(v.sift_prediction)) &&
        (v.hasOwnProperty("sift_prediction") || getters.getStatusSiftsName.includes("Not Available")) &&

        (!v.hasOwnProperty("polyphen_prediction") || getters.getStatusPolyphenPredictionsName.includes(v.polyphen_prediction)) &&
        (v.hasOwnProperty("polyphen_prediction") || getters.getStatusPolyphenPredictionsName.includes("Not Available")) &&

        (!v.hasOwnProperty(`gnomad_${state.version}_info`) || parseFloat(v[`gnomad_${state.version}_info`].match(/AF=([^;]+)/)[1]) <= getters.getPopulation.value) &&


        (getters.getFilterClinvar ? v[`clinvar_${state.version}`] : true) &&
        (getters.getFilterCosmic ? v[`cosmic_${state.version}`] : true) &&
        (getters.getFilterDbsnp ? v[`dbSnp_${state.version}`] : true) &&
        (getters.getFilterGnomad ? v[`gnomad_${state.version}`] : true)
    ))),
    getStatusVariants: (state, getters) => (getters.getPlottedVariants.filter(v => (
        (getters.getSamples.length ?
            v.samples.some(s => getters.getStatusSamples.map(d => d.id).includes(s.id)) :
            true
        )
    ))),
    getStatusConsequences: (state) => (state.consequences.filter(c => c.status)),
    getStatusConsequencesNames: (state, getters) => (getters.getStatusConsequences.map(c => c.name)),

    getStatusSifts: (state) => (state.sifts.filter(c => c.status)),
    getStatusSiftsName: (state, getters) => (getters.getStatusSifts.map(c => c.name)),

    getStatusPolyphenPredictions: (state) => (state.polyphen_predictions.filter(c => c.status)),
    getStatusPolyphenPredictionsName: (state, getters) => (getters.getStatusPolyphenPredictions.map(c => c.name)),



    getAllTranscript: (state, getters) => ({
        info: getters.getInfo,
        variants: getters.getVariants,
        domains: getters.getDomains,
        consequences: getters.getConsequences,
        sifts: getters.getSifts,
        polyphen_predictions: getters.getPolyphenPredictions
    }),
    getMutations: (state, getters) => ([
        ...getters.getStatusVariants,
    ].sort(sortByProteinPos)),
    getSamples: (state, getters) => {
        let samples = []
        for (const v of getters.getVariants) {
            samples.push(...v.samples)
        }
        let unique = uniqueArrBy(samples, 'id')
        return unique
    },
    getPlottedSamples: (state, getters) => {
        let samples = []
        for (const v of getters.getPlottedVariants) {
            samples.push(...v.samples)
        }
        let unique = uniqueArrBy(samples, 'id')
        return unique
    },
    getStatusSamples: (state, getters) => {
        return getters.getPlottedSamples.filter(s => s.status)
    },
    getFilterClinvar: (state) => (state.v_filters.clinvar),
    getFilterCosmic: (state) => (state.v_filters.cosmic),
    getFilterDbsnp: (state) => (state.v_filters.dbSnp),
    getFilterGnomad: (state) => (state.v_filters.gnomad),
    getBaseCount: (state, getters) => {
        let dict = {
            A: { C: 0, G: 0, T: 0 },
            G: { A: 0, C: 0, T: 0 },
            C: { A: 0, G: 0, T: 0 },
            T: { A: 0, C: 0, G: 0 },
        }
        for (const v of getters.getPlottedVariants) {
            if (v.ref in dict && v.alt in dict) {
                dict[v.ref][v.alt] += 1
            }
        }
        return dict
    },
}

export const mutations = {
    // Basic
    setFile: (state, file) => { state.file = file },
    setVersion: (state, version) => {
        console.log('VERSION:', version)
        state.version = version
        state.bookmark.version = version
        API.version = version
    },
    setBookmark: (state, bookmark) => { state.bookmark = bookmark },
    setInfo: (state, info) => { state.info = info },
    setGenes: (state, genes) => { state.genes = genes },
    setGoterms: (state, goterms) => { state.goterms = goterms },
    setTranscripts: (state, transcripts) => { state.transcripts = transcripts },
    setVariants: (state, variants) => { state.variants = variants.sort(sortByProteinPos) },
    setDomains: (state, domains) => { state.domains = domains },
    setConsequences: (state, consequences) => { state.consequences = consequences },

    setSpinner: (state, spinner) => { state.spinner = spinner },
    setVariant: (state, variant) => { state.variant = variant },
    setPhenotypes: (state, phenotype) => { state.phenotypes = phenotype },
    setPopulations: (state, population) => { state.population = population },
    // Specific
    setNumVcfVars: (state, num_vcf_vars) => { state.info.num_vcf_vars = num_vcf_vars },
    setNumVcfSamples: (state, num_vcf_samples) => { state.info.num_vcf_samples = num_vcf_samples },
    pushVariant: (state, variant) => { state.variants.push(variant) },
    setDomainStatus: (state, { index, val }) => { state.domains[index].status = val },
    setDomainColor: (state, { index, val }) => { state.domains[index].color = val },
    setSifts: (state, variants) => {

        let sifts = variants.filter(v =>
            (v.hasOwnProperty("sift_prediction") && v['sift_prediction'])
        );
        let selectField = sifts.map(s => s["sift_prediction"]);
        let MargeFields = [].concat.apply([], selectField);
        if (variants.length > sifts.length) {
            MargeFields.push("Not Available")
        }
        let dictionarySifts = [...new Set(MargeFields)];

        let id = 0;
        state.sifts = dictionarySifts.map(s => { return { id: id++, name: s, status: true } })

    },
    setSiftStatus: (state, { index, val }) => { state.sifts[index].status = val },

    setPolyphenPredictions: (state, variants) => {

        let polyphen_prediction = variants.filter(v =>
            (v.hasOwnProperty("polyphen_prediction") && v['polyphen_prediction'])
        );
        let selectField = polyphen_prediction.map(s => s["polyphen_prediction"]);
        let MargeFields = [].concat.apply([], selectField);
        if (variants.length > polyphen_prediction.length) {
            MargeFields.push("Not Available")
        }
        let dictionaryPolyphenPredictions = [...new Set(MargeFields)];

        let id = 0;
        state.polyphen_predictions = dictionaryPolyphenPredictions.map(s => { return { id: id++, name: s, status: true } })

    },
    setPolyphenPredictionsStatus: (state, { index, val }) => { state.polyphen_predictions[index].status = val },

    setPopulation: (state, variants) => {
        let population = {}
        let genes = variants.filter(v =>
            (v.hasOwnProperty(`gnomad_${state.version}_info`) && v[`gnomad_${state.version}_info`])
        );
        let selectField = genes.map(g => {
            return parseFloat(g[`gnomad_${state.version}_info`].match(/AF=([^;]+)/)[1])
        });
        let MargeFields = [].concat.apply([], selectField).sort();

        var minMaxValue = minMax(MargeFields)
        population['min'] = minMaxValue[0];
        population['max'] = minMaxValue[1];
        population['value'] = population.max;
        population['step'] = noExponents(Math.pow(10, -countDecimals(population.min)))
        state.population = population

    },

    setPopulationValue: (state, value) => { state.population.value = value },

    setConsequenceStatus: (state, { index, val }) => { state.consequences[index].status = val },
    setConsequenceColor: (state, { index, val }) => { state.consequences[index].color = val },
    setSampleStatus: (state, { sample, val }) => { sample.status = val },
    setFilterClinvar: (state, value) => { state.v_filters.clinvar = value },
    setFilterCosmic: (state, value) => { state.v_filters.cosmic = value },
    setFilterDbsnp: (state, value) => { state.v_filters.dbSnp = value },
    setFilterGnomad: (state, value) => { state.v_filters.gnomad = value },
    clearFilters: (state) => { state.v_filters = Object.assign({}, BASE_FILTERS) },
    mergeBookmark: (state, newB) => { state.bookmark = Object.assign({}, state.bookmark, newB) },
}

export const actions = {
    // Clear
    clearAllData({ commit, dispatch }) {
        commit('setFile', null)
        commit('setVersion', 37)
        commit('setBookmark', { genes: {} })
        commit('setGenes', [])
        commit('setGoterms', {})
        commit('setPhenotypes', [])
        commit('setInfo', {})
        commit('setTranscripts', [])

        dispatch('clearAllGene')
    },
    clearAllGene({ commit }) {
        commit('setVariants', [])
        commit('setDomains', [])
        commit('setConsequences', [])
        commit('setSifts', [])
        commit('setPolyphenPredictions', [])
        commit('setPopulations', {})
        commit('setVariant', {})
        commit('setSpinner', false)
        commit('clearFilters')
    },
    clearVariant({ commit }) {
        commit('setVariant', {})
    },

    // fetch
    async fetchAllData({ state, commit, dispatch }, gene) {
        dispatch('clearAllGene')
        commit('setSpinner', true)
        console.time('fetchAllData')

        let info
        try {
            info = await API.fetchInfo(gene)
        } catch (err) {
            console.log('WTF')
        }
        if (state.transcripts.length === 0 ||
            state.info.id !== gene.id) {
            commit('setTranscripts', await API.fetchTranscripts(info))
        }
        commit('setInfo', info)
        commit('setDomains', await API.fetchDomains(info))

        VCFParser.readVCFVariants(state.file, gene).then(async(vcf_vars) => {
            if (vcf_vars.length === 0) {
                console.log('vcf_vars length is 0')
                return
            }
            commit('setNumVcfVars', vcf_vars.length)
            commit('setNumVcfSamples', Object.keys(vcf_vars[0].samples).length)

            try {
                console.time('fetchVarsAndCons')
                let obj = await API.fetchVariantsAndConsequences(info, vcf_vars)
                console.timeEnd('fetchVarsAndCons')

                commit('setVariants', obj.variants)
                commit('setConsequences', obj.consequences)
                commit('setSifts', obj.variants)
                commit('setPolyphenPredictions', obj.variants)
                commit('setPopulation', obj.variants)
               
            } catch (error) {
                console.error('Error fetching variants', error)
            }
            commit('setSpinner', false)
            console.timeEnd('fetchAllData')
        })
    },
    // Setters
    setFile({ dispatch, commit, getters }, file) {
        dispatch('clearAllData')
        commit('setFile', file)

        if (getters.isBookmark) dispatch('setBookmarkContents')
        else dispatch('setVcfContents')
    },
    async setVcfContents({ state, commit }) {
        commit('setSpinner', true)

        console.time('parsefile')
        let res = await VCFParser.readVCFGenes(state.file)
        let genes = res.genes
        let version = res.version
        console.timeEnd('parsefile')

        console.time('getintersection')
        genes = await GeneTree.positionToName({ genes, version })
        console.timeEnd('getintersection')

        commit('setVersion', version)
        commit('setGenes', genes)
        commit('setSpinner', false)
    },
    setSelectedDomains({ state, commit }, selected) {
        for (const [index, domain] of state.domains.entries()) {
            let val = selected.includes(domain.id)
            if (domain.status !== val) {
                commit('setDomainStatus', { index, val })
            }
        }
    },
    setSelectedConsequences({ state, commit }, selected) {
        for (const [index, cons] of state.consequences.entries()) {
            let val = selected.includes(cons.id)
            if (cons.status !== val) {
                commit('setConsequenceStatus', { index, val })
            }
        }
    },
    setSelectedSift({ state, commit }, selected) {
        for (const [index, cons] of state.sifts.entries()) {
            let val = selected.includes(cons.id)
            if (cons.status !== val) {
                commit('setSiftStatus', { index, val })
            }
        }
    },

    setSelectedPolyphenPredictions({ state, commit }, selected) {
        for (const [index, cons] of state.polyphen_predictions.entries()) {
            let val = selected.includes(cons.id)
            if (cons.status !== val) {
                commit('setPolyphenPredictionsStatus', { index, val })
            }
        }
    },

    setRangePopulation({ state, commit }, value) {
        commit('setPopulationValue', value)
    },
    setSelectedSamples({ getters, commit }, selected) {
        for (const sample of getters.getSamples) {
            let val = selected.includes(sample.id)
            if (sample.status !== val) {
                commit('setSampleStatus', { sample, val })
            }
        }
    },
    setVariant({ state, commit }, variant) {
        commit('setVariant', variant)
    },
    async setGoterms({ state, commit }) {
        commit('setSpinner', true)

        console.time('goterms')
        let goterms = await API.fetchGoterms(state.genes.map(g => g.name));
        console.timeEnd('goterms')

        commit('setGoterms', goterms)
        commit('setSpinner', false)
    },

    async setPhenotypes({ state, commit }) {

        commit('setSpinner', true)

        console.time('phenotypes')
        let phenotype = await API.fetchPhenotype(state.genes.map(g => g.name))
        console.timeEnd('phenotypes')
        commit('setPhenotypes', phenotype)
        commit('setSpinner', false)
    },


    // Bookmark
    async setBookmarkContents({ state, commit }, rawContents) {
        let contents = rawContents
        if (!rawContents) {
            rawContents = await VCFParser.readFileAsText(state.file)
            contents = JSON.parse(rawContents)
        }
        let genes = []
        for (const [geneName, geneTranscripts] of Object.entries(contents.genes)) {
            let canonicalInfo = geneTranscripts[0].info // fallback
            for (const t of geneTranscripts) {
                if (t.info.canonical) {
                    canonicalInfo = t.info
                    break
                }
            }
            genes.push({
                name: geneName,
                id: canonicalInfo.id,
                go: canonicalInfo.go,
                chr: canonicalInfo.chr,
                transcript_id: canonicalInfo.transcript_id
            })
        }
        console.log('gen: ', genes)
        console.log('boo: ', contents)

        commit('setVersion', contents.version)
        commit('setBookmark', contents)
        commit('setGenes', genes)
    },
    addTranscriptToBookmark({ state, commit, getters }) {
        let newTranscript = getters.getAllTranscript
        let geneTranscripts = state.bookmark.genes[newTranscript.info.name] || []
        geneTranscripts = JSON.parse(JSON.stringify(geneTranscripts))

        let flagReplaced = false
        for (const [index, t] of geneTranscripts.entries()) {
            if (t.info.transcript_id === newTranscript.info.transcript_id) {
                geneTranscripts[index] = newTranscript
                flagReplaced = true
                break
            }
        }
        if (!flagReplaced) {
            geneTranscripts.push(newTranscript)
        }

        let newBookmark = {
            genes: {
                [newTranscript.info.name]: geneTranscripts
            }
        }
        commit('mergeBookmark', newBookmark)
    },
    chooseGene({ state, commit, dispatch }, currentGene) {
        console.log('Current gene:', currentGene)
        let transcripts = state.bookmark.genes[currentGene.name]

        commit('setTranscripts', transcripts.map(t => t.info.transcript_id))
        for (const t of transcripts) {
            if (t.info.transcript_id === currentGene.transcript_id) {
                dispatch('chooseTranscript', t)
                break
            }
        }
    },
    chooseTranscript({ state, commit }, currentTranscript) {
        console.log('selectedTranscript:', currentTranscript)
        commit('setInfo', currentTranscript.info)
        commit('setVariants', currentTranscript.variants)
        commit('setDomains', currentTranscript.domains)
        commit('setConsequences', currentTranscript.consequences)
        commit('setSifts', currentTranscript.variants)
        commit('setPolyphenPredictions', currentTranscript.variants)
        commit('setPopulation', currentTranscript.variants)
    },
    async setDemoState({ state, commit, dispatch }) {
        commit('setSpinner', true)
        const demoContents = await API.fetchDemo()
        commit('setFile', { name: 'bookmark_BAP1.json' })
        commit('setVersion', demoContents.version)
        dispatch('setBookmarkContents', demoContents)
        commit('setSpinner', false)
    },
}