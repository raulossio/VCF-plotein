<template>
  <base-titled-section title="Bookmarks">
    <b-list-group>
      <b-list-group-item
        v-for="t in bookmarkTranscripts"
        :key="t.info.transcript_id"
      >
        {{t.info.name}}: {{t.info.transcript_id}}
      </b-list-group-item>

      <b-list-group-item v-if="bookmarkTranscripts.length === 0">
        No genes added yet
      </b-list-group-item>
    </b-list-group>
    <b-button-group class="mt-3 mx-auto">
      <b-button variant="secondary"  @click="addTranscriptToBookmark">
        Add to bookmarks
      </b-button>
      <b-button
        v-if="bookmarkTranscripts.length"
        @click="downloadBookmark"
        variant="success"
      >
        Export bookmarks
      </b-button>
    </b-button-group>
  </base-titled-section>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { saveAs } from 'file-saver';

  export default {
    computed: {
      ...mapGetters({
        myBookmark: 'getBookmark',
      }),
      bookmarkTranscripts () {
        let transcripts = []
        for (const [geneName, geneTranscripts] of Object.entries(this.myBookmark.genes)) {
          transcripts.push(...geneTranscripts)
        }
        return transcripts
      }
    },
    methods: {
      ...mapActions({
        addTranscriptToBookmark: 'addTranscriptToBookmark',
      }),
      downloadBookmark () {
        try {
          let blob = new Blob([JSON.stringify(this.myBookmark)], {type: "application/json"})
          let names = Object.keys(this.myBookmark.genes)
          saveAs(blob, `bookmark_${names.join('_')}.json`)
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
</script>
