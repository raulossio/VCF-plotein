<template>

    <b-form-group>
      <!-- <b-form-input
        class="mb-0"
        type="text"
        v-model.trim="search"
        aria-describedby="inputLiveHelp inputLiveFeedback"
        placeholder="Filter by variant" /> -->
      <table class="table table-striped table-bordered table-sm mb-0 pb-5">
        <thead>
          <tr>
            <th scope="col" style="width: 50px;" class="text-center">
              <label class="custom-control custom-checkbox">
                <input type="checkbox" v-model="selectAll" class="custom-control-input center">
                <span class="custom-control-indicator"></span>
              </label>
            </th>
              <th scope="col" colspan="3">All Variants</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="variant in mySVariants" :key="variant.id">
            <th scope="row" class="text-center">
              <label class="custom-control custom-checkbox">
                <input type="checkbox" :value="variant.id" v-model="selected" class="custom-control-input center">
                <span class="custom-control-indicator"></span>
              </label>
            </th>

            <td> {{variant.data.aa_pos}} </td>
            <td> {{variant.data.aa_change}} </td>
            <td> {{variant.data.consequences}} </td>
          </tr>
        </tbody>
      </table>

    </b-form-group>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    // data: () => ({
    //   search: "",
    // }),
    computed: {
       ...mapGetters({
        mySVariants: 'getSearchableVariants',
        myStatusSVariants: 'getStatusSearchableVariants'
      }),
      options () {
        return this.mySVariants
          .filter(v =>(
             (!(v.data.aa_change.toLowerCase() =="")||v.data.aa_change ==  this.search) &&
             (!(v.data.aa_pos =="")|| v.data.aa_pos ==this.search)&&
             (!(v.data.consequences =="")||  v.data.consequences == this.search)
             ))
        return this.mySVariants
          .filter(v =>(
             (v.data.aa_change.toLowerCase().includes( this.search.toLowerCase())) &&
             (v.data.aa_pos.toLowerCase().includes( this.search.toLowerCase())) &&
             (v.data.consequences.toLowerCase().includes( this.search.toLowerCase()))
             ))
      },
      selected: {
        get () {
          let statusSVariants = this.myStatusSVariants.map(p=>p.id)
          return [...new Set(statusSVariants)]
        },
        set (newList) {
            this.setSelectedSearchableVariants(newList)
        }
      },
      selectAll: {
        get () {

          return this.selected.length === this.mySVariants.length
        },
        set (value) {
         let selected = []
          if (value) {
            for (const cons of this.mySVariants) {
              selected.push(cons.id)
            }
            this.search = ''
          }
          this.selected = selected
        }
      }

    },
    methods: {
      ...mapActions({
          setSelectedSearchableVariants: 'setSelectedSearchableVariants'
      })
    }
  }

</script>
