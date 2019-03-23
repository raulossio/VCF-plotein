<template>
  <base-titled-section title="Domains">
    <b-form-group>
      <b-form-input
        class="mb-0"
        type="text"
        v-model.trim="search"
        aria-describedby="inputLiveHelp inputLiveFeedback"
        placeholder="Filter by domain" />
      <table class="table table-striped table-bordered table-sm mb-0 pb-5">
        <thead>
          <tr>
            <th scope="col" style="width: 50px;" class="text-center">
              <label class="custom-control custom-checkbox">
                <input type="checkbox" v-model="selectAll" class="custom-control-input center">
                <span class="custom-control-indicator"></span>
              </label>
            </th>
            <th scope="col">Domain</th>
            <th scope="col" style="width: 20px;">Color</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dom in options" :key="dom.id">
            <td scope="row" class="text-center">
              <label class="custom-control custom-checkbox">
                <input type="checkbox" :value="dom.id" v-model="selected" class="custom-control-input center">
                <span class="custom-control-indicator"></span>
              </label>
            </td>
            <td :title="dom.name" data-toggle="tooltip" data-placement="top">
              {{dom.family}}
              <span class="muted">({{dom.start}}, {{dom.end}})</span>
            </td>
            <td>
              <input @change="changeColor" :id="dom.id" :value="dom.color" class="colorpicker center" type="color">
            </td>
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
        myDomains: 'getDomains',
        myStatusDomains: 'getStatusDomains',
      }),
      options () {
        return this.myDomains
          .filter(domain => domain.family.includes(this.search))
      },
      selected: {
        get () {
          let statusDomainsNames = this.myStatusDomains.map(d=>d.id)
          return [...new Set(statusDomainsNames)]
        },
        set (newList) {
          this.setSelectedDomains(newList)
        }
      },
      selectAll: {
        get () {
          return this.selected.length === this.myDomains.length
        },
        set (value) {
          let selected = []
          if (value) {
            for (const domain of this.myDomains) {
              selected.push(domain.id)
            }
            this.search = ''
          }
          this.selected = selected
        }
      }
    },
    methods: {
      ...mapActions({
        setSelectedDomains: 'setSelectedDomains'
      }),
      changeColor (event) {
        let index = event.target.id
        let val = event.target.value
        this.$store.commit('setDomainColor', {index, val})
      }
    }
  }
</script>
