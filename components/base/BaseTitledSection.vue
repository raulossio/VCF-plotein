<template>
  <div>
    <label style="font-size: 1.55rem;">{{title}}</label>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      title: {type: String, required: true},
    },
  }
</script>
