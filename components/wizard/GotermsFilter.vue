<template>
  <div>
    <h6 class="text-center">{{title}}</h6>
    <b-form-input id="inputLive"
    type="text"
    v-model.trim="search"
    aria-describedby="inputLiveHelp inputLiveFeedback"
    placeholder="Search a Go-term"></b-form-input>
    <div class="goterms-list">
      <b-list-group v-for="item in filteredList" :key="item.id">
        <b-list-group-item button
          @click="setFilter(item)"
          :active="item.id === myFilter"
        >
          {{item.name}}
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
      filteredList() {
        return this.list.filter(d => (
          d.name.includes(this.search)))
      }
    },
    methods: {
      ...mapActions({
        mySetFilter: 'genefilter/setFilter',
      }),
      setFilter (filter) {
        this.mySetFilter({filter: filter.id, type: 'goterm'})
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
