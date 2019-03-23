<template>
  <span
    class="p-0"
    variant="dark"
    title="Download as PNG"
    data-toggle="tooltip"
    data-placement="right">
    <i class="fa fa-file-image"></i>
  </span>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { saveSvgAsPng } from 'save-svg-as-png'

  export default {
    computed: {
      ...mapGetters({
        myInfo: 'getInfo',
      })
    },
    methods: {
      downloadPng () {
        let filename = `plotein_${this.myInfo.name}.png`;
        saveSvgAsPng(document.getElementById('SvgGrouper'), filename);
      }
    }
  }
</script>
