<template>
  <base-titled-section title="Samples">
    <b-form-group>
      <b-form-input
        class="mb-0"
        type="text"
        v-model.trim="search"
        aria-describedby="inputLiveHelp inputLiveFeedback"
        placeholder="Filter by sample" />
      <table class="table table-striped table-bordered table-sm mb-0 pb-5">
        <thead>
          <tr>
            <th scope="col" style="width: 50px;" class="text-center">
              <label class="custom-control custom-checkbox">
                <input type="checkbox" v-model="selectAll" class="custom-control-input center">
                <span class="custom-control-indicator"></span>
              </label>
            </th>
            <th scope="col">Sample</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sample in options" :key="sample.id">
            <td scope="row" class="text-center">
              <label class="custom-control custom-checkbox">
                <input type="checkbox" :value="sample.id" v-model="selected" class="custom-control-input center">
                <span class="custom-control-indicator"></span>
              </label>
            </td>
            <td>{{sample.name}}</td>
          </tr>
        </tbody>
      </table>
    </b-form-group>
  </base-titled-section>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data: () => ({
      search: "",
    }),
    computed: {
      ...mapGetters({
        myPlottedSamples: 'getPlottedSamples',
        myStatusSamples: 'getStatusSamples',
      }),
      options () {
        return this.myPlottedSamples
          .filter(sample => sample.name.includes(this.search))
      },
      selected: {
        get () {
          return this.myStatusSamples.map(s => s.id)
        },
        set (newList) {
          this.setSelectedSamples(newList)
        }
      },
      selectAll: {
        get () {
          return this.selected.length === this.myPlottedSamples.length
        },
        set (value) {
          let selected = []
          if (value) {
            for (const sample of this.myPlottedSamples) {
              selected.push(sample.id)
            }
            this.search = ''
          }
          this.selected = selected
        }
      }
    },
    methods: {
      ...mapActions({
        setSelectedSamples: 'setSelectedSamples'
      })
    }
  }
</script>
