<template>
  <base-titled-section title="Transcripts">
    <b-list-group v-for="transcript_id in myTranscripts" :key="transcript_id">
      <b-list-group-item
        active-class="router-link-active"
        :class="{
          active: (transcript_id === myInfo.transcript_id),
          'font-weight-bold': (transcript_id === myInfo.canonical)
        }"
        :to="{
          path: 'graph',
          query: { gene: (createInfo(transcript_id)) },
          force: true
        }"
      >
        {{transcript_id}}
      </b-list-group-item>
    </b-list-group>
  </base-titled-section>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        myInfo: 'getInfo',
        myTranscripts: 'getTranscripts',
      })
    },
    methods: {
      createInfo (transcript_id) {
        let newInfo = Object.assign({}, this.myInfo)
        newInfo.transcript_id = transcript_id
        return newInfo
      }
    }
  }
</script>
