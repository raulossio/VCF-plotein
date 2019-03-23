<script>
import { mapActions } from 'vuex'

import * as d3 from 'd3'
import dbNameFormat from '~/utilities/dbNameFormat'

export default{
  render: (h) => h(),
  props: {
    data: {type: Array, required: true},
    mainvar: {type: Object, required: true},
    container: {type: Object, required: true},
    y: {type: Number, required: true},
    width: {type: Number, required: true},
    radius: {type: Number, required: true},
    version: {type: Number, required: true},
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
    }
  },
  methods: {
    ...mapActions({
      clearVariant: 'clearVariant',
      setVariant: 'setVariant',
    }),
    presentDB (d, db) {
      let name = db.name + '_' + this.version
      return (d[name] === true ? 'red' : 'white')
    },
    createLeftDBTitle ({ db, data, group }) {
      let { leftMargin, radius, mainvar, presentDB } = this

      const metaText = group.selectAll('text').data([null])
      metaText
        .enter()
        .append('text')
        .attr('x', 5)
        .attr('font-size', '1em')
        .attr('fill', '#000')
        .merge(metaText)
        .text(dbNameFormat(db.name))
        .attr('y', db.y + 5)

      const createStick = ({d, db}) => {
        const context = d3.path()
        if (db.name === 'gnomad') {
          context.moveTo(leftMargin + d.protein_position, -10)
        } else {
          context.moveTo(leftMargin + d.position, db.y - 30 + radius)
        }
        context.lineTo(leftMargin + d.position, db.y - radius)
        context.closePath()
        return context
      }

      const metaStick = group.selectAll('polyline').data(data)
      metaStick
        .exit()
        .remove()
      metaStick
        .enter()
        .append('polyline')
        .attr('stroke-width', 1)
        .attr('stroke-linejoin', 'round')
        .style('fill', 'none')
        .merge(metaStick)
        .attr('stroke', d => (mainvar && d.id === mainvar.id ? 'red' : '#777'))
        .attr('points', d => {
          return `
            ${leftMargin + (db.name === 'gnomad' ? d.protein_position : d.position)},
            ${db.name === 'gnomad' ? 0 : db.y - 30 + radius},

            ${leftMargin + (db.name === 'gnomad' ? d.protein_position : d.position)},
            ${db.name === 'gnomad' ? 10 : db.y - 30 + radius},

            ${leftMargin + d.position},
            ${db.name === 'gnomad' ? 15 : db.y - radius},

            ${leftMargin + d.position}, ${db.y - radius}
          `
        })

      let side = 2 * radius - 2
      const metaSquare = group.selectAll('rect').data(data)
      metaSquare
        .exit()
        .remove()
      metaSquare
        .enter()
        .append('rect')
        .attr('width', side)
        .attr('height', side)
        .attr('stroke-width', 1)
        .attr('stroke-linejoin', 'round')
        .attr('class', 'pointer')
        .attr('role', 'button')
        .attr('tabindex', '0')
        .attr('focusable', 'true')
        .on('focus', d => this.setVariant(d))
        .on('focusout', d => this.clearVariant())
        .merge(metaSquare)
        .attr('y', d => (db.y - side / 2))
        .attr('x', d => (d.position + leftMargin - side / 2))
        .attr('fill', d => presentDB(d, db))
        .attr('stroke', d => (mainvar && d.id === mainvar.id ? 'red' : '#777'))
    },
    createResponsiveComponent () {
      let { width, data, container } = this
      let height = 180

      let svg = container.selectAll('svg.metadata').data([null])
      svg = svg
        .enter()
        .append('svg')
        .attr('class', 'metadata')
        .merge(svg)
        .attr('y', this.y)
        .attr('width', width)
        .attr('height', height)

      const databases = [
        { name: 'gnomad', y: 35 },
        { name: 'dbSnp', y: 65 },
        { name: 'clinvar', y: 95 },
        { name: 'cosmic', y: 125 },
        // { name: 'dbptm', y: 155 },
      ]

      let createLeftDBTitle = this.createLeftDBTitle
      let groups = svg.selectAll('g').data(databases)
      groups
        .exit()
        .remove()
      groups
        .enter()
        .append('g')
        .merge(groups)
        .each(function (db, i) {
          createLeftDBTitle({ db, data, group: d3.select(this) })
        })
    }
  }
}
</script>
