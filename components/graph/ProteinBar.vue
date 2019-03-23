<script>
import * as d3 from 'd3'

export default{
  render: (h) => h(),
  props: {
    data: {type: Array, required: true},
    container: {type: Object, required: true},
    domainScale: {type: Function, required: true},
    proteinAASize: {type: Number, required: true},
    rightMargin: {type: Number, required: true},
    leftMargin: {type: Number, required: true},
    width: {type: Number, required: true},
    y: {type: Number, required: true},
  },
  watch: {
    width () {
      this.createResponsiveComponent()
    },
    data () {
      this.createResponsiveComponent()
    }
  },
  methods: {
    createResponsiveComponent () {
      let { width, container } = this
      let height = 15

      let svg = container.selectAll('svg.proteinbar').data([null])
      svg = svg
        .enter()
        .append('svg')
        .attr('class', 'proteinbar')
        .merge(svg)
        .attr('y', this.y)
        .attr('width', width)
        .attr('height', height)

      let proteinTrack = svg.selectAll('rect').data([null])
      proteinTrack
        .enter()
        .append('rect')
        .attr('y', 1) // allows border
        .attr('x', this.leftMargin)
        .attr('stroke', 'black')
        .attr('fill', '#eee')
        .merge(proteinTrack)
        .attr('height', height - 2)
        .attr('width', width - this.leftMargin - this.rightMargin)

    }
  }
}
</script>
