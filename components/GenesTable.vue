<template>
  <base-titled-section :title="`Genes (${filteredGeneList.length})`">
    <p class="muted mb-0" v-if="myFilter">
      Filtered by {{myFilterType}} ({{myFilter}})
    </p>
    <b-form-input
    type="text"
    v-model.trim="search"
    aria-describedby="inputLiveHelp inputLiveFeedback"
    placeholder="Search a gene"></b-form-input>
    <b-table show-empty striped responsive bordered hover
      :fields="fields"
      :items="filteredGeneList"
      :current-page="currentPage"
      :per-page="perPage"
      sortBy="name"
      id="tabla"
    >
      <template slot="name" slot-scope="data">
        <b-link :to="{ path: '/graph', query: { gene: data.item }, force: true }">
          {{data.value}}
        </b-link>
      </template>
    </b-table>
    <b-pagination class="justify-content-center pb-5"
      v-show="filteredGeneList.length > perPage"
      :total-rows="filteredGeneList.length"
      :per-page="perPage"
      v-model="currentPage" />
  </base-titled-section>
</template>

<script>
  import { mapGetters } from 'vuex'

  const fields = [
    { key: 'name', sortable: true },
    { key: 'id', sortable: true }
  ]

  export default {
    props: {
      perPage: {type: Number, required: true},
    },
    data: () => ({
      search: "",
      fields: fields,
      currentPage: 1
    }),
    computed: {
      ...mapGetters({
        myGenes: 'getGenes',
        mySpinner: 'getSpinner',
        myPhenotypes: 'getPhenotypes',
        myFilter: 'genefilter/getFilter',
        myFilterType: 'genefilter/getType',
      }),
      filteredGeneList() {
        debugger
        let gene_list = this.myGenes.filter(gene => {
          return (gene.name.toLowerCase().includes(this.search.toLowerCase()) ||
            gene.id.toLowerCase().includes(this.search.toLowerCase()))
        })
        if (this.myFilterType === 'phenotypes') {
          let genes_list_phe =[]
          //get gen by phenotype
           let genes = this.getGenesByPhenotype(this.myFilter)

           genes.forEach(function(g) {

                let gt= gene_list.filter(gene => ( gene.name.includes(g) ))

                genes_list_phe.push(gt)
            });
           var genes_list_phe_marge = [].concat.apply([],genes_list_phe)
           let dictionary=[...new Set(genes_list_phe_marge)];

          return dictionary;
        }else{
          if (this.myFilterType === 'goterm') {
            gene_list = gene_list.filter(gene => (
              gene.go && gene.go.includes(this.myFilter)
            ))
          }
          if (this.myFilterType === 'chromosome') {
            gene_list = gene_list.filter(gene => (
              gene.chr.toString() === this.myFilter
            ))
          }

        }
        return gene_list

      }

    },
    methods: {
      getGenesByPhenotype(phe){
        var genesObject= this.myPhenotypes.filter(function(o) {
          return o['phenotypes'].includes(phe)
        });
        let genes =genesObject.map(p=> p['gen']);
        return genes;
      },
    }
  }
</script>
