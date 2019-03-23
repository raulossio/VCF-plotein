<template>
  <svg id="SvgGrouper" :height="grouperHeight">
    <lollipops
      :y="0"
      :data="data"
      :width="width"
      :radius="radius"
      :cons="consequences"
      :mainvar="myVariant"
      :container="container"
      :leftMargin="leftMargin" />
    <domains-expanded
      :groups="groups"
      :y="lollipopsHeight"
      :spacing="domainSpacing"
      :data="data"
      :width="width"
      :mainvar="myVariant"
      :container="container"
      :leftMargin="leftMargin"
      :domainScale="domainScale"
      :domains="domains" />
    <protein-bar
      :y="proteinBarY"
      :data="data"
      :container="container"
      :leftMargin="leftMargin"
      :rightMargin="rightMargin"
      :domainScale="domainScale"
      :proteinAASize="proteinAASize"
      :width="width" />
    <Metadata
      :y="metadataY"
      :data="data"
      :width="width"
      :radius="radius"
      :version="myVersion"
      :mainvar="myVariant"
      :container="container"
      :leftMargin="leftMargin" />
  </svg>
</template>

<script>
  import { mapGetters } from 'vuex'

  import * as d3 from 'd3'

  import Lollipops from '~/components/graph/Lollipops'
  import DomainsExpanded from '~/components/graph/DomainsExpanded'
  import ProteinBar from '~/components/graph/ProteinBar'
  import Metadata from '~/components/graph/Metadata'

  import calculatePositions from '~/utilities/HandleMutations'
  import intervalPartition from '~/utilities/intervalPartition'

  export default {
    props: {
      mutations: {type: Array, required: true},
      domains: {type: Array, required: true},
      consequences: {type: Array, required: true},
      proteinAASize: {type: Number, required: true},
      rightMargin: {type: Number, required: true},
      leftMargin: {type: Number, required: true},
      radius: {type: Number, required: true},
    },
    components: {
      Lollipops,
      DomainsExpanded,
      ProteinBar,
      Metadata,
    },
    data: () => ({
      data: [],
      width: 0,
      container: {},
      domainScale: (()=>{}),
      lollipopsHeight: 130,
      proteinHeight: 13,
      domainSpacing: 8,
    }),
    computed: {
      ...mapGetters({
        myInfo: 'getInfo',
        myVersion: 'getVersion',
        myVariant: 'getVariant',
        sidebarIsToggled: 'sidebar/isActive',
      }),
      groups () {
        return intervalPartition(this.domains)
      },
      domainsHeight () {
        return this.groups.num * this.domainSpacing
      },
      proteinBarY () {
        return this.lollipopsHeight + this.domainsHeight
      },
      metadataY () {
        return this.proteinBarY + this.proteinHeight
      },
      grouperHeight () {
        return this.metadataY + 180
      }
    },
    methods: {
      recalculate () {
        if (!(d3.select('#main-card').node() || d3.select('#SvgGrouper').node())) {
          return
        }
        let parentWidth = d3.select('#main-card').node().getBoundingClientRect().width
        parentWidth += (this.sidebarIsToggled ? 350 : 0)
        let minimumMutationsWidth = (
          4 * this.radius * this.mutations.length + this.leftMargin + this.rightMargin
        )
        this.width = Math.max(parentWidth, minimumMutationsWidth)
        this.container.style('width', this.width)

        this.domainScale = d3.scaleLinear()
          .domain([0, this.proteinAASize])
          .range([this.leftMargin, this.width - this.rightMargin])

        this.data = calculatePositions({
          width: this.width - this.rightMargin - this.leftMargin,
          transAASize: this.proteinAASize,
          leftMargin: this.leftMargin,
          data: this.mutations,
          radius: this.radius
        })
      }
    },
    mounted () {
      this.container = d3.select('#SvgGrouper')

      this.recalculate()
      window.addEventListener('resize', this.recalculate)
    },
    watch: {
      myInfo () {
        this.recalculate()
      },
      mutations (val) {
        this.recalculate()
        console.log('SvgGrouper.vue - mutations:', val.length)
      },
      domains () {
        this.recalculate()
      }
    }
  }
</script>

<style>
#SvgGrouper {
  width: 100%;
  display: block;
  overflow-x: auto;
}
#SvgGrouper > svg {
  display: block;
}
</style>
