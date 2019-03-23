<template>
  <div>
    <h6 class="text-center">Chromosome</h6>
    <b-form-input id="inputLive"
    type="text"
    v-model.trim="search"
    aria-describedby="inputLiveHelp inputLiveFeedback"
    placeholder="Search a chromosome"></b-form-input>
    <div class="goterms-list">
      <b-list-group v-for="item in filteredList" :key="item">
        <b-list-group-item button
          @click="setFilter(item)"
          :active="item === myFilter"
        >
          {{item}}
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data: () => ({
      search: ""
    }),
    computed: {
      ...mapGetters({
        myGenes: 'getGenes',
        myFilter: 'genefilter/getFilter'
      }),
      chromosomesInFile () {
        let list = this.myGenes.filter(g => g.chr).map(g => g.chr.toString())
        return [...new Set(list)]
      },
      filteredList() {
        return this.chromosomesInFile.filter(d => (
          d.includes(this.search)))
      }
    },
    methods: {
      ...mapActions({
        mySetFilter: 'genefilter/setFilter',
      }),
      setFilter (chromosome) {
        this.mySetFilter({filter: chromosome, type: 'chromosome'})
      }
    }
  }
</script>

<style scoped>
.goterms-list {
  max-height: 300px;
  overflow-y: auto;
}
</style>
