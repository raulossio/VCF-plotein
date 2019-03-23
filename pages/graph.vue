<template>
  <div id="wrapper" :class="{toggle: isToggled}">
    <template v-if="myFile">
      <sidebar class="no-print" />
      <fullscreen ref="fullscreen">
        <div id="page-content-wrapper">
          <div class="row1">
            <variant-info v-if="objIsNotEmpty(myVariant)" class="gene-info" />
            <gene-info v-else class="gene-info" />
          </div>
          <div class="row3">
            <databases-info v-if="objIsNotEmpty(myVariant)"
              class="gene-info"
              style="border-top: solid 2px #ccc;border-bottom: none;" />
          </div>
          <div class="row2">
            <spinner v-if="mySpinner" class="mt-4 pt-4" />
            <main-card v-else-if="myVariants.length" />
            <h4 v-else class="text-center">No data to display</h4>
          </div>
        </div>
      </fullscreen>
    </template>
    <template v-else>
      <div class="text-center">
        <h3 class="mt-5">No file was found</h3>
        <h4>
          Please go back to the
          <span class="font-weight-bold"><nuxt-link to="/wizard">Wizard</nuxt-link></span>
        </h4>
      </div>
    </template>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  import Sidebar from '~/components/Sidebar'
  import MainCard from '~/components/graph/MainCard'
  import GeneInfo from '~/components/graph/GeneInfo'
  import VariantInfo from '~/components/graph/VariantInfo'
  import DatabasesInfo from '~/components/graph/DatabasesInfo'
  import Spinner from '~/components/Spinner'

  export default {
    components: {
      Sidebar,
      GeneInfo,
      VariantInfo,
      DatabasesInfo,
      MainCard,
      Spinner
    },
    computed: {
      ...mapGetters({
        myFile: 'getFile',
        myInfo: 'getInfo',
        myIsBookmark: 'isBookmark',
        myVariants: 'getVariants',
        myVariant: 'getVariant',
        mySpinner: 'getSpinner',
        isToggled: 'sidebar/isActive',
      })
    },
    methods: {
      ...mapActions({
        chooseGene: 'chooseGene',
        fetchAllData: 'fetchAllData',
        clearFilter: 'genefilter/clearFilter',
      }),
      selectDataSource (currentGene) {
        console.log(
          'Data source:',
          (this.myIsBookmark ? 'bookmark source' : 'fetch source'),
          ':',
          currentGene
        )
        if (this.myIsBookmark) {
          this.chooseGene(currentGene)
        } else {
          this.fetchAllData(currentGene).catch(this.fetchingError)
        }
      },
      objIsNotEmpty (obj) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            return true
          }
        }
        return false
      },
      fetchingError (err) {
        console.warn(err)
        this.$notify({
          title: 'Network error.',
          text: 'Problem retrieving data from external databases.',
          type: 'error',
        })
      }
    },
    beforeMount () {
      this.clearFilter()
      if (this.myFile) {
        this.selectDataSource(this.$route.query.gene)
      }
    },
    mounted () {
      this.$bus.$on('fullscreen', (data) => {
        if (this.$refs['fullscreen']) {
          this.$refs['fullscreen'].toggle()
        }
      })
    },
    beforeRouteUpdate (to, from, next) {
      console.log('From:', from.query.gene)
      console.log('To:', to.query.gene)
      next()
      this.selectDataSource(to.query.gene)
    }
  }
</script>
