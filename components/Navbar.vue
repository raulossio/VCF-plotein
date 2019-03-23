<template>
  <b-navbar toggleable="sm" type="dark" variant="primary-dark" :sticky="true">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand class="upper" to="/">
      <b-img src="/Plotein.png" width="32" class="mr-2" />
      VCF/Plotein
      <span class="muted">Beta</span>
    </b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav class="ml-auto">
        <template v-if="showOptions()">
          <template v-if="!myFlipped">
            <b-nav-item @click="$refs.pngButton.downloadPng()">
              <download-png ref="pngButton" />
            </b-nav-item>
            <b-nav-item @click="$refs.svgButton.downloadSvg()">
              <download-svg ref="svgButton" />
            </b-nav-item>
          </template>
          <b-nav-item @click="$refs.csvButton.downloadCsv()">
            <download-csv ref="csvButton" />
          </b-nav-item>
          <b-nav-item href="javascript:window.print()">
            <print />
          </b-nav-item>
          <b-nav-item @click="toggleFlipped">
            <i class="fa fa-code-branch" v-if="myFlipped"
              title="Change to table view"
              data-toggle="tooltip"></i>
            <i class="fa fa-table" v-else></i>
          </b-nav-item>
          <b-nav-item @click="toggleFullscreen">
            <i class="fa fa-compress"></i>
          </b-nav-item>
        </template>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  import Print from '~/components/sidebar/Print'
  import DownloadCsv from '~/components/sidebar/DownloadCsv'
  import DownloadPng from '~/components/sidebar/DownloadPng'
  import DownloadSvg from '~/components/sidebar/DownloadSvg'

  export default {
    components: {
      Print,
      DownloadCsv,
      DownloadPng,
      DownloadSvg
    },
    computed: {
      ...mapGetters({
        myFile: 'getFile',
        myFlipped: 'interactions/getFlipped',
      })
    },
    methods: {
      ...mapActions({
        toggleFlipped: 'interactions/toggleFlipped',
      }),
      toggleFullscreen () {
        this.$bus.$emit('fullscreen', 'ok')
      },
      showOptions () {
        return this.$route.name === 'graph' && this.myFile
      }
    }
  }
</script>

<style scoped>
.navbar a {
  color: #eee !important;
}
.navbar .navbar-brand {
  color: #fff !important;
}
.upper {
  text-transform: uppercase;
}
.nav-item {
  margin-left: 10px;
}
</style>
