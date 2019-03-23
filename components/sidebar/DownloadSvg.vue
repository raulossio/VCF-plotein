<template>
  <span
    class="p-0"
    variant="dark"
    title="Download as SVG"
    data-toggle="tooltip"
    data-placement="right">
    <i class="fa fa-file-code"></i>
  </span>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { saveAs } from 'file-saver';

  const json2csv = require('json2csv').parse

  export default {
    computed: {
      ...mapGetters({
        myInfo: 'getInfo',
      })
    },
    methods: {
      saveSvg(svgEl, name) {
        svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        var svgData = svgEl.outerHTML;
        var preface = '<?xml version="1.0" standalone="no"?>\r\n';
        var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
        var svgUrl = URL.createObjectURL(svgBlob);
        var downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = name;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      },
      downloadSvg () {
        let svg= document.getElementById('SvgGrouper')
        this.saveSvg(svg, `plotein_${this.myInfo.name}.svg`)
      }
    }
  }
</script>
