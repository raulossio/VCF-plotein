<script>
import { mapActions } from 'vuex'

import * as d3 from 'd3'

const HEIGHT = 100

const SCALE = d3.scaleLinear()
                .domain([0, 3])
                .range([0, 50])

export default {
  render: (h) => h(),
  props: {
    data: {type: Array, required: true},
    cons: {type: Array, required: true},
    mainvar: {type: Object, required: true},
    container: {type: Object, required: true},
    y: {type: Number, required: true},
    width: {type: Number, required: true},
    radius: {type: Number, required: true},
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
    cons: {
      handler: function () {
        this.createResponsiveComponent()
      },
      deep: true
    }
  },
  computed: {
    consequenceNames () {
      return this.cons.map(c => c.name)
    },
    colorcons () {
      let dict = {}
      console.log('Consequences changed')
      for (const con of this.cons) {
        dict[con.name] = con.color
      }
      return dict
    }
  },
  methods: {
    ...mapActions({
      clearVariant: 'clearVariant',
      setVariant: 'setVariant',
    }),
    validConsequences (d) {
      return d.consequences.filter(dc => this.consequenceNames.includes(dc))
    },
    level (d) {
      return SCALE(Math.floor(Math.log10(Math.max(d.samples.length, 1))))
    },
    createSemaforo ({d, group}) {
      let x = d.position + this.leftMargin
      const semaforo = group.selectAll('circle').data(this.validConsequences(d))
      semaforo
        .exit()
        .remove()
      semaforo
        .enter()
        .append('circle')
        .attr('r', this.radius)
        .merge(semaforo)
        .attr('fill', c => this.colorcons[c])
        .attr('cy', (c, i) => (HEIGHT - this.level(d) - this.radius * 2 * i))
        .attr('cx', c => x)
    },
    createTriangulo ({d, group}) {
      let triangle = d3.symbol()
                    .type(d3.symbolTriangle)
                    .size(75)

      const triangulo = group.selectAll('path').data([d])
      triangulo
        .exit()
        .remove()
      triangulo
        .enter()
        .append('path')
        .attr('fill', 'white')
        .attr('stroke', d => (d.type === 'insertion' ? 'green' : 'red'))
        .attr('stroke-width', 2)
        .attr('d', triangle)
        .merge(triangulo)
        .attr('transform', d => {
          return "translate("
                  + (d.position + this.leftMargin)
                  + ","
                  + HEIGHT
                  + ") rotate("
                  + (d.type === 'insertion' ? "-180" : "0")
                  + ")"
        })
    },
    createResponsiveComponent () {
      let { width, data, radius, leftMargin, container, createSemaforo, createTriangulo, mainvar } = this
      let svg_height = 130

      let svg = container.selectAll('svg.lollipops').data([null])
      svg = svg
        .enter()
        .append('svg')
        .attr('class', 'lollipops')
        .merge(svg)
        .attr('width', width)
        .attr('height', svg_height)

      const lollipopText = svg.selectAll('text').data(data)
      lollipopText
        .exit()
        .remove()
      lollipopText
        .enter()
        .append('text')
        .attr('font-size', '0.75em')
        .attr('style', 'letter-spacing: 3px;')
        .attr('y', d => HEIGHT + radius - 12)
        .merge(lollipopText)
        .attr('fill', d => (mainvar && d.id === mainvar.id ? 'red' : '#000'))
        .attr('transform', d => `rotate(-90 ${d.position + leftMargin}, 90)`)
        .attr('x', d => {
          return d.position
            + leftMargin
            + this.level(d)
            + Math.max(0, this.validConsequences(d).length - 1) * radius * 2
        })
        .text(d => {
          let letters = d.aa_change.split('/')
          return `${letters[0]}${d.aa_pos}${(letters[1] || '')}`
        })

      const lollipopStick = svg.selectAll('polyline').data(data)
      lollipopStick
        .exit()
        .remove()
      lollipopStick
        .enter()
        .append('polyline')
        .attr('fill', 'none')
        .attr('stroke-width', 1)
        .style('stroke-line-join', 'round')
        .merge(lollipopStick)
        .attr('stroke', d => (mainvar && d.id === mainvar.id ? 'red' : '#777'))
        .attr('points', d => {
          return `
            ${leftMargin + d.position}, ${HEIGHT + radius - this.level(d)},
            ${leftMargin + d.position}, ${HEIGHT + radius + 10},
            ${leftMargin + d.protein_position}, ${svg_height - 10},
            ${leftMargin + d.protein_position}, ${svg_height}
          `
        })

      let groups = svg.selectAll('g').data(data, d => d.id)
      groups
        .exit()
        .remove()
      groups
        .enter()
        .append('g')
        .attr('class', 'pointer')
        .attr('role', 'button')
        .attr('tabindex', '0')
        .attr('focusable', 'true')
        .on('focus', d => this.setVariant(d))
        .on('focusout', d => this.clearVariant())
        .on("keypress", (d) => {
          if(d3.event.keyCode === 37) {
            d3.event.target.previousElementSibling.focus()
          } else if(d3.event.keyCode === 39) {
            d3.event.target.nextElementSibling.focus()
          }
        })
        .merge(groups)
        .each(function (d, i) {
          if (d.type === 'variant') {
            createSemaforo({ d, group: d3.select(this) })
          } else {
            createTriangulo({ d, group: d3.select(this) })
          }
        })
    }
  }
}
</script>
