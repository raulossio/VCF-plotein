<template>
  <div id="main-card">
    <svg-grouper v-if="!myFlipped"
      :proteinAASize="myInfo.length"
      :leftMargin="100"
      :rightMargin="10"
      :mutations="myStatusVariants"
      :domains="myStatusDomains"
      :consequences="myStatusConsequences"
      :radius="6" />
    <div v-else-if="myVariants">
      <variants-table :variants="myStatusVariants" />
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import SvgGrouper from '~/components/graph/SvgGrouper'
  import VariantsTable from '~/components/graph/VariantsTable'

  export default {
    components: {
      SvgGrouper,
      VariantsTable
    },
    data: () => ({
      flipped: false
    }),
    computed: {
      ...mapGetters({
        myInfo: 'getInfo',
        myVariants: 'getVariants',
        myStatusVariants: 'getStatusVariants',
        myStatusDomains: 'getStatusDomains',
        myStatusConsequences: 'getStatusConsequences',
        myFlipped: 'interactions/getFlipped',
      })
    }
  }
</script>

<style scoped>
#main-card {
  overflow-x: auto;
  width: 100%;
}
.card-header.small-header {
  padding: 3px 1em;
}
.flip-content {
  padding: 0px;
}
</style>
