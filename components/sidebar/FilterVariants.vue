<template>
  <base-titled-section title="Variant filter" role="tablist">
    <b-card v-for="(item, key) in list" no-body :key="key" class="mb-1">
      <b-card-header header-tag="header" class="p-1">
        <b-btn block disabled variant="primary">{{item.title}}</b-btn>
      </b-card-header>
      <b-card-body class="p-0">
        <filter-consequences v-if="item.key === 'consequences'" />
        <filter-clinical v-else-if="item.key === 'clinical'" />
      </b-card-body>
    </b-card>
  </base-titled-section>
</template>

<script>
  import FilterConsequences from '~/components/sidebar/FilterConsequences'
  import FilterClinical from '~/components/sidebar/FilterClinical'

  const list = [
    {title: 'Filter by consequences', key: 'consequences'},
    {title: 'Filter by clinical', key: 'clinical'},
    // {title: 'Filter by prediction', key: 'prediction'},
    // {title: 'Filter by population', key: 'population'}
  ]

  export default {
    components: {
      FilterConsequences,
      FilterClinical
    },
    data: () => ({
      list: list
    })
  }
</script>
