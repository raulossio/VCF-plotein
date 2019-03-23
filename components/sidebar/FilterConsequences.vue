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
        <th scope="col">Consequence</th>
        <th scope="col" style="width: 20px;">Color</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="con in myConsequences" :key="con.id">
        <th scope="row" class="text-center">
          <label class="custom-control custom-checkbox">
            <input type="checkbox" :value="con.id" v-model="selected" class="custom-control-input center">
            <span class="custom-control-indicator"></span>
          </label>
        </th>
        <td>
          {{con.name}}
        </td>
        <td>
          <input @change="changeColor" :id="con.id" :value="con.color" class="colorpicker center" type="color">
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
        myConsequences: 'getConsequences',
        myStatusConsequences: 'getStatusConsequences'
      }),
      selected: {
        get () {
          let statusConsequences = this.myStatusConsequences.map(c=>c.id)
          return [...new Set(statusConsequences)]
        },
        set (newList) {
          this.setSelectedConsequences(newList)
        }
      },
      selectAll: {
        get () {
          return this.selected.length === this.myConsequences.length
        },
        set (value) {
          let selected = []
          if (value) {
            for (const cons of this.myConsequences) {
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
        setSelectedConsequences: 'setSelectedConsequences'
      }),
      changeColor (event) {
        let index = event.target.id
        let val = event.target.value
        this.$store.commit('setConsequenceColor', {index, val})
      }
    }
  }
</script>
