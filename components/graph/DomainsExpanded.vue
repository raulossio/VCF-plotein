<script>
import * as d3 from 'd3'
import d3Tip from "d3-tip"

export default{
  render: (h) => h(),
  props: {
    data: {type: Array, required: true},
    domains: {type: Array, required: true},
    groups: {type: Object, required: true},
    mainvar: {type: Object, required: true},
    container: {type: Object, required: true},
    domainScale: {type: Function, required: true},
    y: {type: Number, required: true},
    width: {type: Number, required: true},
    spacing: {type: Number, required: true},
    leftMargin: {type: Number, required: true},
  },
  watch: {
    mainvar () {
      this.createResponsiveComponent()
    },
    width () {
      this.createResponsiveComponent()
    },
    data () {
      this.createResponsiveComponent()
    },
    domains () {
      this.createResponsiveComponent()
    }
  },
  methods: {
    createResponsiveComponent () {
      let { width, data, leftMargin, domains, domainScale, container, groups, spacing, mainvar } = this
      let svg_height = groups.num * spacing

      let svg = container.selectAll('svg.domainsexpanded').data([null])
      svg = svg
        .enter()
        .append('svg')
        .attr('class', 'domainsexpanded')
        .merge(svg)
        .attr('y', this.y)
        .attr('width', width)
        .attr('height', svg_height)

      let tip = d3Tip().attr('class', 'd3-tip').html((d) => {
       return `<p class="my-1"><strong>Name:</strong> <span style='color:black'>${d.name}</span></p>` +
       `<p class="my-1"><strong>Family:</strong> <span style='color:${d.color}'>${d.family}</span></p>` +
       `<p class="my-1"><strong>Start:</strong> <span style='color:black'>${d.start}</span></p>` +
       `<p class="my-1"><strong>End:</strong> <span style='color:black'>${d.end}</span></p>`
      })

      svg.call(tip)

      const domainSvg = svg.selectAll('rect').data(this.domains)
      domainSvg
        .exit()
        .remove()
      domainSvg
        .enter()
        .append('rect')
        .attr('fill', d => d.color)
        .attr('height', d => (spacing - 3))
        .attr('class', 'pointer')
        .attr('role', 'button')
        .attr('tabindex', '0')
        .attr('focusable', 'true')
        .on('focus', tip.show)
        .on('focusout', tip.hide)
        .on("keypress", () => {
          if(d3.event.keyCode === 38) {
            d3.event.target.previousElementSibling.focus()
          } else if(d3.event.keyCode === 40) {
            d3.event.target.nextElementSibling.focus()
          }
        })
        .merge(domainSvg)
        .attr('x', (d, i) => domainScale(d.start))
        .attr('y', d => spacing * (groups.schedule[d.id] - 1))
        .attr('width', d => (domainScale(d.end) - domainScale(d.start)))
        .attr('fill', d => d.color)

      const stickSvg = svg.selectAll('polyline').data(data)
      stickSvg
        .exit()
        .remove()
      stickSvg
        .enter()
        .append('polyline')
        .attr('stroke-width', 1)
        .style('fill', 'none')
        .style('stroke-linejoin', 'round')
        .merge(stickSvg)
        .attr('stroke', d => (mainvar && d.id === mainvar.id ? 'red' : '#777'))
        .attr('points', d => {
          return `
            ${leftMargin + d.protein_position}, 0,
            ${leftMargin + d.protein_position}, ${svg_height}
          `
        })
    },
  }
}
</script>
