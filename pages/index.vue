<template>
  <div id="index">
    <div class="landing">
      <div class="landing-left text-center">
        <h1 class=" mt-3">VCF/Plotein</h1>
        <h3 class="mt-0">A web application to facilitate the clinical interpretation of genetic and genomic variants from exome sequencing projects.</h3>
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
    <!--<div class="py-5 bg-light text-center">
      <h4>FAQ</h4>
      <a href="https://drive.google.com/open?id=15yokctWbhkj7up-Y3xntdrCkohLgr_ez" target="_blank">
        <p class="display-2"><i class="fa fa-file-pdf"></i></p>
      </a>
    </div>-->
    <!--<div id="v-step-0">A DOM element on your page. The first step will pop on this element because its ID is 'v-step-0'.</div>-->
    <div class="landing-left text-center">
      <h1 class="mt-3">Frequently Asked Questions</h1>
    </div>
    <div class="landind-left">
      <VueFaqAccordion :items="myItems"/>
    </div>
    <div>
    </div>
  </div>

</template>

<script>
import VueFaqAccordion from 'vue-faq-accordion'

export default {
components: {
  VueFaqAccordion
},
data () {
  return {
    myItems: [
        {
          title: 'What does this website do?',
          value: 'This website hosts VCF/Plotein, a software tool that is able to graphically and interactively display information from sequencing information files in the VCF format. The only thing you need to run it are a computer with an internet connection and a VCF file (or, if you don’t have a VCF file, you can still see how it works by loading our demo!)',
          category: 'About the app'
        },
        {
          title: 'What is a VCF file?',
          value: 'VCF stands for ‘variant call format’, which is the standard format that the genomics community uses to store and share information about genetic variants detected in sequencing projects. The format consists of columns describing the chromosome, base position, reference and alternative alleles, quality measurements and sample genotypes for each detected variant. A thorough explanation of the VCF format can be seen here (https://samtools.github.io/hts-specs/VCFv4.2.pdf).',
          category: 'About VCF files'
        },
        {
          title: 'Why does a VCF file require graphic visualisation and interactivity?',
          value: 'Many researchers who undertake exome sequencing projects are looking for genetic variants or mutations that underlie their phenotype of interest or contribute to the development of some disease. This task is notoriously difficult and generally involves having a working knowledge of bioinformatics. With this tool, we are seeking to include more investigators, including medical professionals and bench biologists, into the disease-causing variant prioritisation process.',
          category: 'About VCF files'
        },
        {
          title: 'What is the process to display the information in a VCF file?',
          value: 'Using VCF/Plotein is very easy. Just go to http://vcfplotein.liigh.unam.mx, click on ‘get started’, and load your VCF file. So far we only support human exome sequencing files aligned to the GRCh37 or GRCh38 assemblies (but we hope to expand soon). The program will identify what genes have variants in your file and will allow you to filter gene list in the right panel. You can then select a gene to see its genetic variants in detail.',
          category: 'About the app'
        },
        {
          title: 'What information can I access once I select a gene?',
          value: 'Once you select the gene you want to examine, you will be taken to another webpage where you will be able to see its variants in detail. By default, the program depicts the gene’s canonical transcript as annotated by Ensembl, but you can change the depicted transcript by clicking on the __ icon. In the main window, you can view the selected transcript’s domains and other features, and in the top panel you can see information such as how many variants were identified in that gene, how many of these can be plotted (because they fall in coding regions of the selected transcript), number and types of base changes, types of variant consequences and information about samples in the VCF. Each variant also has a metadata track below that shows its presence or absence in supported external databases (gnomAD, dbSNP, ClinVar, and COSMIC). If you click on any variant, then you will be able to access further information about it, such as bioinformatic pathogenicity predictions (by SIFT and PolyPhen), information about its clinical significance (if found in ClinVar), and more details about its annotations in other databases.',
          category: 'About the app'
        },
        {
          title: 'The ethics on my project prevent me from uploading information to a server. Is VCF/Plotein secure?',
          value: 'Many researchers who undertake exome sequencing projects are looking for genetic variants or mutations that underlie their phenotype of interest or contribute to the development of some disease. This task is notoriously difficult and generally involves having a working knowledge of bioinformatics. With this tool, we are seeking to include more investigators, including medical professionals and bench biologists, into the disease-causing variant prioritisation process.',
          category: 'About security'
        },
        {
          title: 'What tools and databases does it integrate?',
          value: 'VCF/Plotein harnesses as much information as possible from external tools and databases to provide context to the variants in your VCF file. As such, it obtains annotations and protein features from Ensembl, gene ontology terms from the GO website (http://www.geneontology.org/page/downloads), variant consequences and SIFT and PolyPhen predictions from Ensembl’s Variant Effect Predictor, and presence/absence and further annotations from COSMIC (https://cancer.sanger.ac.uk/cosmic), dbSNP (https://www.ncbi.nlm.nih.gov/projects/SNP/), gnomAD (http://gnomad.broadinstitute.org/) and ClinVar (https://www.ncbi.nlm.nih.gov/clinvar/).',
          category: 'About the app'
        },
        {
          title: 'Where can I find sample VCF files to test your site?',
          value: 'You can use the Demo already provided, or if you prefer, you can download publicly available VCFs from these links: a. ClinVar GRCh37 ftp://ftp.ncbi.nlm.nih.gov/pub/clinvar/vcf_GRCh37/clinvar_20181028.vcf.gz b. ClinVar GRCh38 ftp://ftp.ncbi.nlm.nih.gov/pub/clinvar/vcf_GRCh38/clinvar_20181028.vcf.gz',
          category: 'About VCF files'
        },
        {
          title: 'Who is behind this tool?',
          value: 'We’re students from the Cancer Genomics and Bioinformatics group from the International Laboratory for Human Genome Research (LIIGH), which belongs to the National Autonomous University of Mexico (UNAM). We have received very valuable support from staff at LIIGH and at UNAM, Juriquilla campus.',
          category: 'About the team'
        },
        {
          title: 'How can I cite VCF/Plotein?',
          value: 'We’re on it! Please check back for any news regarding publication.',
          category: 'About the app'
        },
        {
          title: 'Where can I send comments, questions or bugs?',
          value: 'Please write to us at vcfplotein@liigh.unam.mx.',
          category: 'About the team'
        },
      ]
  }
}
}
</script>
