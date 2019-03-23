<template>
  <b-container class="text-left" fluid>
    <b-row class="mt-3">
      <b-col>
        <select-file />
      </b-col>
      <template v-if="myGenes.length">
        <b-col>
          <genes-filter />
        </b-col>
        <b-col>
          <genes-table :perPage="7" />
        </b-col>
      </template>
      <template v-else>
        <b-col cols="8">
          <spinner v-if="mySpinner" class="mt-4 pt-4" />
        </b-col>
      </template>
    </b-row>
  </b-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  import GenesFilter from '~/components/GenesFilter'
  import GenesTable from '~/components/GenesTable'
  import SelectFile from '~/components/SelectFile'
  import Spinner from '~/components/Spinner'

  export default {
    components: {
      GenesFilter,
      GenesTable,
      SelectFile,
      Spinner
    },
    computed: {
      ...mapGetters({
        isBookmark: 'isBookmark',
        myGenes: 'getGenes',
        mySpinner: 'getSpinner'
      })
    },
    methods: {
      ...mapActions({
        setDemoState: 'setDemoState',
        clearAllData: 'clearAllData',
      })
    },
    // Before app is fully loaded
    beforeMount () {
      this.clearAllData()
      if (this.$route.query && this.$route.query.demo) {
        this.setDemoState();
      }
    }
  }
</script>
