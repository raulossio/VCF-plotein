<template>
  <div>
    <h6 class="text-center">Phenotype</h6>
    <b-form-input id="inputLive"
    type="text"
    v-model.trim="search"
    aria-describedby="inputLiveHelp inputLiveFeedback"
    placeholder="Search a phenotype"></b-form-input>
    <div class="goterms-list">
      <b-list-group v-for="item in filteredPheList" :key="item">
        <b-list-group-item button
          @click="setFilter(item)"
          :active="item === myFilter" >
          {{item}}
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    props: {
      list: {type: Array, required: true},
      title: {type: String, required: true},
    },
    data: () => ({
      search: ""
    }),
    computed: {
      ...mapGetters({
          myFilter: 'genefilter/getFilter'
      }),
      filteredPheList() {
        debugger;
        let fieldPhe =this.getPropertieField("phenotypes");
        let distinctPhe = this.marge(fieldPhe);
        let listPhe=this.toDictionary(distinctPhe)
        return listPhe.filter(p =>
          p.includes(this.search))
      }
    },
    methods: {
      ...mapActions({
        mySetFilter: 'genefilter/setFilter',
      }),
      getPropertieField(key){
        let selectedField = this.list.map(p=> p[key]);
        return selectedField;
      },
      marge(array){
        let listoMarge = [].concat.apply([],array);
        return listoMarge;
      },
      toDictionary(array){
        let dictionary=[...new Set(array)];
        return dictionary;
      },
      setFilter (phenotypes) {
        this.mySetFilter({filter: phenotypes, type: 'phenotypes'})
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
