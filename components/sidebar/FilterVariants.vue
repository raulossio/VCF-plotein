<template>
  <base-titled-section title="Variant filter" role="tablist">
    <b-card v-for="(item, key) in list" no-body :key="key" class="mb-1">
      <b-card-header header-tag="header" class="p-1">
        <b-btn block disabled variant="primary">{{item.title}}</b-btn>
      </b-card-header>
      <b-card-body class="p-0">
        <filter-consequences v-if="item.key === 'consequences'" />
        <filter-clinical v-else-if="item.key === 'clinical'" />
        <filter-sift v-else-if="item.key === 'sift'" />
        <filter-polyphen v-else-if="item.key === 'polyphenPred'" />
        <filter-population v-else-if="item.key === 'population'" />
        <filter-variants-searcher v-else-if="item.key === 'variant'" />
      </b-card-body>
    </b-card>
  </base-titled-section>
</template>

<script>
  import FilterConsequences from '~/components/sidebar/FilterConsequences'
  import FilterClinical from '~/components/sidebar/FilterClinical'
  import FilterSift from '~/components/sidebar/FilterSift'
  import FilterPolyphen from '~/components/sidebar/FilterPolyphen'
  import FilterPopulation from '~/components/sidebar/FilterPopulation'
  import FilterVariantsSearcher from '~/components/sidebar/FilterVariantsSearcher'
 const list = [
    {title: 'Filter by consequences', key: 'consequences'},
    {title: 'Filter by clinical', key: 'clinical'},
    {title: 'Filter by SIFT prediction', key: 'sift'},
    {title: 'Filter by PolyPhen prediction', key: 'polyphenPred'},
    {title: 'Filter by population', key: 'population'},
    {title: 'Filter by variant', key: 'variant'}
  ]

  export default {
    components: {
      FilterConsequences,
      FilterClinical,
      FilterSift,
      FilterPolyphen,
      FilterPopulation,
      FilterVariantsSearcher
    },
    data: () => ({
      list: list
    })
  }
</script>
