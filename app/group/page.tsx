"use client"

import { useEffect, useRef, useState } from 'react'
import { select,  Selection } from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { max} from 'd3-array'
import { axisLeft , axisBottom } from 'd3-axis'

const data = [
  {
    name: 'a',
    number: 4000
  },
  {
    name: 'b',
    number: 1500
  },
  {
    name: 'c',
    number: 8000
  },
  {
    name: 'd',
    number:9000
  },
  {
    name: 'e',
    number: 5000
  },
  {
    name: 'f',
    number: 2000
  },
  {
    name: 'g',
    number: 6000
  },
  {
    name: 'h',
    number: 5000
  },
]

const dimensions = {
  width: 800,
  height: 500,
  chartWidth: 700,
  chartHeight: 400,
  marginLeft: 100,
  marginTop: 50,
}

type d3Select = Selection<null, unknown, null, undefined>

const Group: React.FC = () => {
  const svgRef = useRef(null)
  const [selection, setSelection] = useState<d3Select | null>(null)
  
  const maxVal = max(data, d=>d.number)
  const y = scaleLinear()
              .domain([0, maxVal!])
              .range([0, dimensions.chartHeight])
  const x = scaleBand()
              .domain(data.map(d=>d.name))
              .range([0, dimensions.chartWidth])
  const yAxis = axisLeft(y)
                .ticks(4)
                .tickFormat(d=>`$${d}`)
  const xAxis = axisBottom(x)

  useEffect(() => {
    if (!selection) {
      setSelection(select(svgRef.current))
      return
    } 
    const xAxisG = selection
                    .append('g')
                    .attr('transform', `translate(${dimensions.marginLeft}, ${dimensions.chartHeight + dimensions.marginTop})`)
                    .call(xAxis)
    const yAxisG = selection
                    .append('g')
                    .attr('transform', `translate(${dimensions.marginLeft}, ${dimensions.marginTop})`)
                    .call(yAxis)
    selection
      .append('g')
      .attr('transform', `translate(${dimensions.marginLeft}, ${dimensions.marginTop})`)
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('width', x.bandwidth()*1)
      .attr('fill', 'orange')
      .attr('height', d=>y(d.number))
      .attr('x', d=> x(d.name)!)
  },[selection])

  return (
    <div>
      <svg ref={svgRef} 
            width={dimensions.width}
            height={dimensions.height}>
      </svg>
    </div>
    )
}


export default Group