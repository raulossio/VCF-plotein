<template>
  <table class="table table-striped table-bordered table-sm mb-0 pb-5">
    <thead>
      <tr>
        <th scope="col" style="width: 50px;" class="text-center">
          <label class="custom-control custom-checkbox">
            <input type="checkbox" v-model="selectAll" class="custom-control-input center">
            <span class="custom-control-indicator"></span>
          </label>
        </th>
          <th scope="col">All SIFT categories</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="sift in mysifts" :key="sift.id">
        <th scope="row" class="text-center">
          <label class="custom-control custom-checkbox">
            <input type="checkbox" :value="sift.id" v-model="selected" class="custom-control-input center">
            <span class="custom-control-indicator"></span>
          </label>
        </th>
        <td>
          {{ (!myIsBookmark) ? sift.name === undefined ? "undefined" :  sift.name :  sift.name  }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    computed: {
       ...mapGetters({
        mysifts: 'getSifts',
        myIsBookmark: 'isBookmark',
        myStatusSifts: 'getStatusSifts'
      }),
      selected: {
        get () {
         
          let statusSifts = this.myStatusSifts.map(s=>s.id)
          return [...new Set(statusSifts)]
        },
        set (newList) {
        
            this.setSelectedSift(newList)
        }
      },
      selectAll: {
        get () {
      
          return this.selected.length === this.mysifts.length
        },
        set (value) {
        
         let selected = []
          if (value) {
            for (const cons of this.mysifts) {
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
        setSelectedSift: 'setSelectedSift'
      }),
     
     }
  }

</script>
