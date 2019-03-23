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
      <div class="title"><h5>Variants</h5></div>
      <div class="top">
        <div>
          <p class="subtitle">Chromosome</p>
          <p>{{myVariant.chr}}</p>
        </div>
        <div>
          <p class="subtitle">Genomic position</p>
          <p>{{myVariant.pos}}</p>
        </div>
        <div>
          <p class="subtitle">Protein position</p>
          <p>{{myVariant.aa_pos}}</p>
        </div>
      </div>
      <div class="bottom">
        <div>
          <p class="subtitle">Reference</p>
          <p>{{myVariant.ref}}</p>
        </div>
        <div>
          <p class="subtitle">Alternative</p>
          <p>{{myVariant.alt}}</p>
        </div>
        <div>
          <p class="subtitle">Aminoacid Change</p>
          <p>{{myVariant.aa_change}}</p>
        </div>
      </div>
      <div class="scroll">
        <p class="subtitle">Consequences</p>
        <ul class="scroll-list">
          <li v-for="con in myVariant.consequences"
            :key="con"
            :style="`color:${colorcons[con]};`"
            class="circles">
            <span style="color: black;">{{con.replace(/_/g, ' ')}}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="samples scrollable">
      <div class="title"><h5>Samples</h5></div>
      <div class="top text-left">
        <p style="font-size: .7em;">
          Samples in variant: <strong>{{myVariant.samples.length}}</strong>
        </p>
      </div>
      <div class="scroll">
        <p class="subtitle">Samples</p>
        <ul class="scroll-list">
          <li v-for="sample in myVariant.samples" :key="sample.id">
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
        myVariant: 'getVariant',
        myConsequences: 'getConsequences',
      }),
      colorcons () {
        let dict = {}
        for (const con of this.myConsequences) {
          dict[con.name] = con.color
        }
        return dict
      }
    }
  }
</script>

<style scoped>
ul.cons {
  columns: 2;
  -webkit-columns: 2;
  -moz-columns: 2;
}
</style>
