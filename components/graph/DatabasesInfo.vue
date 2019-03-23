<template>
  <div class="bar-wrapper">
    <div class="general border-right text-left">
      <div class="title"><h5>Prediction</h5></div>
      <div class="only-top">
        <div class="expand-items">
          <div>
            <p class="subtitle">Sift score</p>
            <p>{{myVariant.sift_score || '-'}}</p>
          </div>
          <div>
            <p class="subtitle">Sift prediction</p>
            <p class="text-capitalize">
              {{myVariant.sift_prediction || 'Not available'}}
            </p>
          </div>
        </div>
        <div class="expand-items">
          <div>
            <p class="subtitle">Polyphen score</p>
            <p>{{myVariant.polyphen_score || '-'}}</p>
          </div>
          <div>
            <p class="subtitle">Polyphen prediction</p>
            <p class="text-capitalize">
              {{myVariant.polyphen_prediction
                ? myVariant.polyphen_prediction.replace(/_/g, ' ')
                : 'Not available'}}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="variants border-right text-left">
      <div class="title"><h5>Clinical</h5></div>
      <div class="top">
        <div>
          <p class="subtitle" style="text-transform: none;">{{dbFormat('Clinvar')}}</p>
          <p class="text-normal">
            {{myVariant[`clinvar_${myVersion}`] ? 'Present' : 'Absent'}}
          </p>
        </div>
        <div>
          <p class="subtitle" style="text-transform: none;">{{dbFormat('Cosmic')}}</p>
          <p class="text-normal">
            {{myVariant[`cosmic_${myVersion}`] ? 'Present' : 'Absent'}}
          </p>
        </div>
      </div>
      <div class="bottom">
        <div>
          <p class="subtitle">Clinical significance</p>
          <p class="text-normal">
            {{clinicalSignificance()}}
          </p>
        </div>
      </div>
    </div>

    <div class="samples text-left">
      <div class="title"><h5>Population</h5></div>
      <div class="top">
        <div>
          <p class="subtitle" style="text-transform: none;">{{dbFormat('gnomAD')}}</p>
          <p class="text-normal">
            {{myVariant[`gnomad_${myVersion}`] ? 'Present' : 'Absent'}}
          </p>
        </div>
        <div>
          <p class="subtitle" style="text-transform: none;">{{dbFormat('dbSnp')}}</p>
          <p class="text-normal">
            {{myVariant[`dbSnp_${myVersion}`] ? 'Present' : 'Absent'}}
          </p>
        </div>
      </div>
      <div class="bottom">
        <div>
          <p class="subtitle">Total population</p>
          <p>{{totalPopulation()}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import dbNameFormat from '~/utilities/dbNameFormat'

  const GROUP_POSITION = 1

  export default {
    computed: {
      ...mapGetters({
        myVersion: 'getVersion',
        myVariant: 'getVariant',
      })
    },
    methods: {
      dbFormat (dbName) {
        return dbNameFormat(dbName)
      },
      clinicalSignificance () {
        const clinvarInfo = this.myVariant[`clinvar_${this.myVersion}_info`]
        if (!clinvarInfo) {
          return '-'
        }
        const cs = clinvarInfo.match(/CLNDN=([^;]+)/)[GROUP_POSITION]
        // cs == 'Melanoma,_cutaneous_malignant,_susceptibility_to,_10'
        const arr = cs.split(',').reverse()
        const noTenArr = arr.slice(1)
        return noTenArr.map(w => w.replace(/_/g, ' ').trim()).join(' ')
      },
      totalPopulation () {
        const gnomadInfo = this.myVariant[`gnomad_${this.myVersion}_info`]
        if (!gnomadInfo) {
          return '-'
        }
        const tp = gnomadInfo.match(/AF=([^;]+)/)[GROUP_POSITION]
        return parseFloat(tp)
      }
    }
  }
</script>
