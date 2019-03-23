<template>
  <span
    class="p-0"
    variant="dark"
    title="Download as CSV"
    data-toggle="tooltip"
    data-placement="right">
    <i class="fa fa-file-excel"></i>
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
        myVariants: 'getVariants'
      }),
      fields () {
        return [
          'chr',
          'pos',
          'ref',
          'alt',
          'aa_pos',
          'aa_change',
          'consequences',
          `gnomad_${this.myVersion}`,
          `dbSnp_${this.myVersion}`,
          `clinvar_${this.myVersion}`,
          `cosmic_${this.myVersion}`,
          'samples'
        ]
      },
      opts () {
        return { fields: this.fields }
      }
    },
    methods: {
      downloadCsv () {
        try {
          let csv = json2csv(this.myVariants, this.opts)
          let blob = new Blob([csv], {type: "text/csv;charset=utf-8"})
          saveAs(blob, `table_${this.myInfo.name}_${this.myInfo.transcript_id}.csv`)
        } catch (err) {
          console.error('wat', err)
        }
      }
    }
  }
</script>
