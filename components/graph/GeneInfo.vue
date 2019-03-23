<template>
  <div class="bar-wrapper">
    <div class="general border-right text-left">
      <div class="title"><h5>General</h5></div>
      <div class="only-top">
        <div>
          <p class="subtitle">Gene name</p>
          <p class="gene-name">{{myInfo.name}}</p>
        </div>
        <div class="expand-items">
          <div>
          <p class="subtitle">Ensembl ID</p>
          <p>{{myInfo.id}}</p>
          </div>
          <div>
          <p class="subtitle">Transcript ID</p>
          <p>{{myInfo.transcript_id}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="variants scrollable border-right">
      <div class="title" style="grid-column:1/3;"><h5>Variants</h5></div>
      <div class="top">
        <div>
          <p class="subtitle">Total gene variants</p>
          <p>{{myInfo.num_vcf_vars}}</p>
        </div>
        <div>
          <p class="subtitle">Variants in transcript</p>
          <p>{{myVariants.length}}</p>
        </div>
        <div>
          <p class="subtitle">Variants in graph</p>
          <p>{{myStatusVariants.length}}</p>
        </div>
      </div>
      <div class="bottom">
        <div class="expand-items">
          <p style="font-size: .7em;">
            Base changes:<br/><span class="muted">(in graph)</span>
          </p>
        </div>
        <div class="count-wrapper">
          <span class="ref">A</span>
          <p class="alt-1">G {{myBaseCount.A.G}}</p>
          <p class="alt-2">C {{myBaseCount.A.C}}</p>
          <p class="alt-3">T {{myBaseCount.A.T}}</p>
        </div>
        <div class="count-wrapper">
          <span class="ref">G</span>
          <p class="alt-2">A {{myBaseCount.G.A}}</p>
          <p class="alt-1">C {{myBaseCount.G.C}}</p>
          <p class="alt-3">T {{myBaseCount.G.T}}</p>
        </div>
        <div class="count-wrapper">
          <span class="ref">C</span>
          <p class="alt-2">A {{myBaseCount.C.A}}</p>
          <p class="alt-1">G {{myBaseCount.C.G}}</p>
          <p class="alt-3">T {{myBaseCount.C.T}}</p>
        </div>
        <div class="count-wrapper">
          <span class="ref">T</span>
          <p class="alt-2">A {{myBaseCount.T.A}}</p>
          <p class="alt-1">C {{myBaseCount.T.C}}</p>
          <p class="alt-3">G {{myBaseCount.T.G}}</p>
        </div>
      </div>
      <div class="scroll">
        <p class="subtitle">Consequences</p>
        <ul class="scroll-list">
          <li v-for="con in myStatusConsequences"
            :key="con.id"
            :style="`color:${con.color};list-style-type:disc;`"
          >
            <span style="color: black;">{{con.name.replace(/_/g, ' ')}}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="samples scrollable">
      <div class="title"><h5>Samples</h5></div>
      <div class="only-top text-left">
        <div class="expand-items">
          <p style="font-size: .7em;">
            Total gene samples: <strong>{{myInfo.num_vcf_samples}}</strong>
          </p>
          <p style="font-size: .7em;">
            Samples in transcript: <strong>{{mySamples.length}}</strong>
          </p>
          <p style="font-size: .7em;">
            Samples in graph: <strong>{{myStatusSamples.length}}</strong>
          </p>
        </div>
      </div>
      <div class="scroll">
        <p class="subtitle">Samples</p>
        <ul class="scroll-list">
          <li v-for="sample in myStatusSamples" :key="sample.id">
            <span>{{sample.name}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        myInfo: 'getInfo',
        myVariants: 'getVariants',
        myStatusVariants: 'getStatusVariants',
        myStatusConsequences: 'getStatusConsequences',
        mySamples: 'getSamples',
        myStatusSamples: 'getStatusSamples',
        mySpinner: 'getSpinner',
        myBaseCount: 'getBaseCount',
      })
    },
    methods: {
      plottedVariants () {
        if (!this.mySpinner) return this.myVariants.length
        return this.myStatusVariants.length
      }
    }
  }
</script>
