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
          <th scope="col">All Polyphen categories</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="PolyPred in myPolyPred" :key="PolyPred.id">
        <th scope="row" class="text-center">
          <label class="custom-control custom-checkbox">
            <input type="checkbox" :value="PolyPred.id" v-model="selected" class="custom-control-input center">
            <span class="custom-control-indicator"></span>
          </label>
        </th>
        <td>
          {{PolyPred.name}}
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
        myPolyPred: 'getPolyphenPredictions',
        myStatusPolyPred: 'getStatusPolyphenPredictions'
      }),
      selected: {
        get () {
          debugger
          let statusPolyPred = this.myStatusPolyPred.map(p=>p.id)
          return [...new Set(statusPolyPred)]
        },
        set (newList) {
          debugger
            this.setSelectedPolyphenPredictions(newList)
        }
      },
      selectAll: {
        get () {
          debugger
          return this.selected.length === this.myPolyPred.length
        },
        set (value) {
          debugger 
         let selected = []
          if (value) {
            for (const cons of this.myPolyPred) {
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
        setSelectedPolyphenPredictions: 'setSelectedPolyphenPredictions'
      }),
     
     }
  }

</script>
