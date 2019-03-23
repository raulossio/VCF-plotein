<template>
  <div id="sidebar-wrapper">
    <!-- Sidebar Top -->
    <ul class="sidebar-nav">
      <li v-for="item in items" :key="item.fa">
        <b-btn block
          variant="primary"
          data-toggle="tooltip"
          data-placement="right"
          :title="item.title"
          :pressed="myActive && item.fa === myOption"
          @click="myToggle({active: true, option: item.fa})"
        >
          <i :class="`fa fa-${item.fa}`"></i>
        </b-btn>
      </li>
    </ul>
    <!-- Sidebar Extra -->
    <div class="sidebar-extra pb-5">
      <div class="btn-close-sidebar">
        <button
          size="sm"
          type="button"
          tabIndex="-1"
          style="margin-right: 2px;"
          class="btn btn-secondary btn-circle mt-1"
          @click="myToggle({active: false})"
        >
          <i class="fa fa-chevron-left"></i>
        </button>
      </div>
      <div class="text-left" style="padding-left: 0.35rem;">
        <!-- Top nav -->
        <div v-show="myOption === 'upload'">
          <select-file />
          <spinner v-if="mySpinner" class="mt-4 pt-4" />
        </div>
        <genes-table v-show="myOption === 'dna'" :perPage="9" />
        <select-transcript v-show="myOption === 'microscope'" />
        <filter-domains v-show="myOption === 'layer-group'" />
        <filter-variants v-show="myOption === 'filter'" />
        <div v-show="myOption === 'plus-square'">
          <h1>Insertions</h1>
        </div>
        <div v-show="myOption === 'minus-square'">
          <h1>Deletions</h1>
        </div>
        <filter-samples v-show="myOption === 'users'" />
        <bookmarks v-show="myOption === 'bookmark'" />
        <!-- Bottom nav -->
        <div v-show="myOption === 'cog'">
          <h1>Cog</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { readVCFGenes } from '~/utilities/VCFParser'

  import Spinner from '~/components/Spinner'
  import SelectFile from '~/components/SelectFile'
  import GenesTable from '~/components/GenesTable'
  import SelectTranscript from '~/components/sidebar/SelectTranscript'
  import FilterDomains from '~/components/sidebar/FilterDomains'
  import FilterVariants from '~/components/sidebar/FilterVariants'
  import FilterSamples from '~/components/sidebar/FilterSamples'
  import Bookmarks from '~/components/sidebar/Bookmarks'

  const items = [
    {fa: 'upload', title: 'Upload vcf/bookmark'},
    {fa: 'dna', title: 'Select gene'},
    {fa: 'microscope', title: 'Select transcript'},
    {fa: 'layer-group', title: 'Filter domains'},
    {fa: 'filter', title: 'Filter variants'},
    {fa: 'users', title: 'Filter Samples'},
    {fa: 'bookmark', title: 'Bookmarks'}
  ]

  export default {
    data: () => ({
      items: items,
      spinner: false
    }),
    components: {
      Spinner,
      SelectFile,
      GenesTable,
      SelectTranscript,
      FilterDomains,
      FilterVariants,
      FilterSamples,
      Bookmarks,
    },
    computed: {
      ...mapGetters({
        myGenes: 'getGenes',
        mySpinner: 'getSpinner',
        myActive: 'sidebar/isActive',
        myOption: 'sidebar/getOption',
      })
    },
    methods: {
      ...mapActions({
        myGetGeneNames: 'getGeneNames',
        myReadBookmarkFile: 'readBookmarkFile',
        myToggle: 'sidebar/toggle',
      })
    },
    watch: {
      myGenes: function (contents) {
        if (contents.length === 0) return
        this.$store.commit('sidebar/setOption', 'dna')
      }
    }
  }
</script>
