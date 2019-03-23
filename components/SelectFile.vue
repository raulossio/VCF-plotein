<template>
  <base-titled-section title="Open VCF or Bookmark">
    <b-file v-model="file"
      :state="Boolean(file)"
      accept=".vcf,.gz,.json"
      placeholder="Browse files..."
      class="drag-drop d-flex align-items-stretch">
      <p>Drag your files here or click in this area.</p>
    </b-file>
    <div class="mt-3">
      Selected file:<br>
      <span class="font-weight-bold">
        {{(file && file.name) || "None"}}
      </span>
    </div>
    <p class="mt-3" v-if="myFile">
      Reference genome: ({{myVersion}})
      <br>
      <span class="font-weight-bold">
        Human assembly {{myVersion === 37 ? 'GRCh37 (hg 19)' : 'GRCh38'}}
      </span>
    </p>
  </base-titled-section>
</template>

<script>
  import { mapGetters, mapActions, map } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        myFile: 'getFile',
        myGenes: 'getGenes',
        myVersion: 'getVersion',
        myIsBookmark: 'isBookmark',
      }),
      file: {
        get () {
          return this.myFile
        },
        set (newFile) {
          if (!this.validName(newFile)) {
            this.invalidFileError()
            return
          }
          this.myClearAllData()
          this.$store.commit('setFile', newFile)
          if (this.myIsBookmark) this.mySetBookmarkContents
          else this.mySetVcfContents().catch(this.vcfFileError)
        }
      }
    },
    methods: {
      ...mapActions({
        mySetFile: 'setFile',
        myClearAllData: 'clearAllData',
        mySetVcfContents: 'setVcfContents',
        mySetBookmarkContents: 'setBookmarkContents',
      }),
      validName (file) {
        if (file.name.endsWith('.json')) return true;
        if (file.name.endsWith('.vcf')) return true;
        if (file.name.endsWith('.vcf.gz')) return true;
        return false;
      },
      invalidFileError () {
        this.$notify({
          title: 'Invalid file type.',
          text: 'Make sure to use a vcf file.',
          type: 'warn',
        })
      },
      vcfFileError (err) {
        const title = 'Error reading file.'
        console.warn(title, err.message)
        this.$store.commit('setSpinner', false)
        this.$notify({
          title,
          text: 'Make sure the uncompressed vcf is a valid one.',
          type: 'error',
        })
      },
      noGenesError () {
        this.$notify({
          title: 'No genes found.',
          text: 'No coding variants found in your vcf.',
          type: 'warn',
        })
      },
    }
  }
</script>
