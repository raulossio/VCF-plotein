<template>
  <div>
    <b-table show-empty striped responsive bordered hover caption-top
      :fields="fields"
      :items="variants"
      :current-page="currentPage"
      :per-page="perPage"
      sortBy="pos"
      id="tabla">
      <template slot="consequences" slot-scope="data">
        {{data.value.join(', ')}}
      </template>
      <template slot="samples" slot-scope="data">
        {{data.value.map(d => d.name).join(', ')}}
      </template>
      <template slot="table-caption">
        Variants in graph
      </template>
    </b-table>
    <b-pagination
      class="justify-content-center"
      :total-rows="variants.length"
      :per-page="perPage"
      v-model="currentPage" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      variants: {type: Array, required: true},
    },
    data: () => ({
      currentPage: 1,
      perPage: 10
    }),
    computed: {
      ...mapGetters({
        myVersion: 'getVersion',
      }),
      fields () {
        return [
          {key:'chr', sortable: false},
          {key:'pos', sortable: true},
          {key:'ref', sortable: true},
          {key:'alt', sortable: true},
          {key:'aa_pos', sortable: true},
          {key:'aa_change', sortable: true},
          {key:'consequences', sortable: false},
          {key:`gnomad_${this.myVersion}`, sortable: false},
          {key:`dbSnp_${this.myVersion}`, sortable: false},
          {key:`clinvar_${this.myVersion}`, sortable: false},
          {key:`cosmic_${this.myVersion}`, sortable: false},
          {key:'samples', sortable: false}
        ]
      }
    }
  }
</script>
