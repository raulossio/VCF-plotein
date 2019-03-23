<template>
  <div id="index">
    <div class="landing">
      <div class="landing-left text-center">
        <h1 class="font-weight-bold mt-3">VCF/Plotein</h1>
        <h3 class="mt-0">A web application to facilitate the clinical interpretation of genetic and genomic variants from exome sequencing projects</h3>
      </div>
      <div class="landing-right">
        <b-img src="/bap1.png" alt="bap1.png" class="mr-3" style="width:100%;" />
        <div class="p-0 pt-3">
          <b-button size="lg"
            variant="outline-secondary-dark"
            class="px-5 py-3 mr-3"
            to="/wizard"
          >
            Get started
          </b-button>
          <b-button size="lg"
            variant="outline-primary-dark"
            class="px-5 py-3"
            :to="{ path: '/wizard', query: { demo: true }}"
          >
            Demo
          </b-button>
        </div>
      </div>
    </div>
    <div class="py-5 bg-light text-center">
      <h4>FAQ</h4>
      <a href="https://drive.google.com/open?id=15yokctWbhkj7up-Y3xntdrCkohLgr_ez" target="_blank">
        <p class="display-2"><i class="fa fa-file-pdf"></i></p>
      </a>
    </div>
    <div id="v-step-0">A DOM element on your page. The first step will pop on this element because its ID is 'v-step-0'.</div>
  </div>
</template>
