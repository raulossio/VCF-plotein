<template>
  <div id="default-wrapper" v-if="loaded">
    <navbar />
    <nuxt/>
    <notifications />
  </div>
  <div class="row h-100 justify-content-center align-items-center" v-else>
    <spinner />
  </div>
</template>

<script>
import Navbar from '~/components/Navbar.vue'
import Spinner from '~/components/Spinner.vue'

export default {
  components: {
    Navbar,
    Spinner
  },
  data: () => ({
    loaded: false
  }),
  // After app is fully loaded
  mounted () {
    // After next render (ala Frame Per Second)
    this.$nextTick(() => {
      this.loaded = true
    })
  }
}
</script>

