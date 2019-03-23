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
        <th scope="col">Database</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="option in options" :key="option">
        <th scope="row" class="text-center">
          <label class="custom-control custom-checkbox">
            <input type="checkbox" :value="option" v-model="selected" class="custom-control-input center">
            <span class="custom-control-indicator"></span>
          </label>
        </th>
        <td>
          {{option}}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  const options = [
    'clinvar',
    'cosmic',
    'dbSnp',
    'gnomAD'
  ]

  export default {
    data: () => ({
      options: options,
      list: []
    }),
    computed: {
      selected: {
        get () {
          return this.list
        },
        set (newList) {
          this.$store.commit('setFilterClinvar', newList.includes('clinvar'))
          this.$store.commit('setFilterCosmic', newList.includes('cosmic'))
          this.$store.commit('setFilterDbsnp', newList.includes('dbSnp'))
          this.$store.commit('setFilterGnomad', newList.includes('gnomad'))
          this.list = newList
        }
      },
      selectAll: {
        get () {
          return this.selected.length === this.options.length
        },
        set (value) {
          let selected = []
          if (value) {
            for (const filter of this.options) {
              selected.push(filter)
            }
          }
          this.selected = selected
        }
      }
    }
  }
</script>
