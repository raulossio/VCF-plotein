<template>
  <base-titled-section title="Filter genes" role="tablist">
    <div id="v-step-0">
    <b-nav pills class="nav-pills">
      <b-nav-item v-for="item in list"
        :active="cur.key === item.key"
        :class="{ active: (cur.key === item.key) }"
        :key="item.key"
        @click="setCurrent(item)"
      >
        {{item.title}}
      </b-nav-item>
    </b-nav>
  </div>
    <div class="pt-3">
      <chromosome-filter v-if="cur.key === 'chr'" />
      <spinner v-else-if="mySpinner" />
      <goterms-filter v-else-if="cur.key === 'bio'" :list="bio" :title="cur.title" />
      <goterms-filter v-else-if="cur.key === 'mol'" :list="mol" :title="cur.title" />
      <goterms-filter v-else-if="cur.key === 'cel'" :list="cel" :title="cur.title" />
      <phenotype-filter v-else-if="cur.key === 'phe'" :list="phe" :title="cur.title" />
      <p v-else>Error</p>
    </div>
    <div>
   <v-tour name="myTour" :steps="steps" :options="myOptions"></v-tour>
 </div>
  </base-titled-section>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  import ChromosomeFilter from '~/components/wizard/ChromosomeFilter'
  import GotermsFilter from '~/components/wizard/GotermsFilter'
  import PhenotypeFilter from '~/components/wizard/PhenotypeFilter'
  import Spinner from '~/components/Spinner'

  const list = [
    {title: 'Chromosome', key: 'chr'},
    {title: 'Biological process', key: 'bio'},
    {title: 'Molecular function', key: 'mol'},
    {title: 'Cellular component', key: 'cel'},
    {title: 'Phenotype', key: 'phe'}
  ]

  export default {
    components: {
      ChromosomeFilter,
      GotermsFilter,
      PhenotypeFilter,
      Spinner
    },

    data: () => ({
      list: list,
      cur: list[0],
      fetchedGoterms: false,
      myOptions: {
          useKeyboardNavigation: false,
          labels: {
            buttonSkip: 'Skip tour',
            buttonPrevious: 'Previous',
            buttonNext: 'Next',
            buttonStop: 'Ok'
          }
        },
        steps: [
          {
            target: '#v-step-0',  // We're using document.querySelector() under the hood
            content: `Here you can select a filter to help you decide which gene you want to visualise first`
          }
        ]
    }),
    mounted: function () {
      // console.log('VALOR ' + this.myDemo);
      if (this.myDemo === true){
        this.$tours['myTour'].start();
      //   console.log('MY DEMO VALUE ES TRUE');
       }
    },
    computed: {
      ...mapGetters({
        myPhenotypes: 'getPhenotypes',
        myGoterms: 'getGoterms',
        mySpinner: 'getSpinner',
        myDemo: 'getDemo',
      }),
      bio () {
        return this.myGoterms['biological_process']
      },
      mol () {
        return this.myGoterms['molecular_function']
      },
      cel () {
        return this.myGoterms['cellular_component']
      },
      phe (){
        return this.myPhenotypes;
      }
    },
    methods: {
      ...mapActions({
        setPhenotypes: 'setPhenotypes',
        setGoterms: 'setGoterms',
      }),
      setCurrent (item) {
        this.cur = item
        if (!this.fetchedGoterms) {
          this.fetchedGoterms = true
          this.setGoterms()
          this.setPhenotypes()
        }
      }
    }
  }
</script>
