"use client"

import { useEffect, useRef, useState } from 'react'
import { select,  Selection } from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { max} from 'd3-array'

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

type d3Select = Selection<null, unknown, null, undefined>

const BarChart: React.FC = () => {
  const svgRef = useRef(null)
  const [selection, setSelection] = useState<d3Select | null>(null)
  
  const maxVal = max(data, d=>d.number)
  const y = scaleLinear()
              .domain([0, maxVal!])
              .range([0, 500])
  const x = scaleBand()
              .domain(data.map(d=>d.name))
              .range([0,800])
              .paddingInner(0.01)
              .paddingOuter(0.5)

  useEffect(() => {
    if (!selection) {
      setSelection(select(svgRef.current))
      return
    } 
    
    const rects = selection
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('width', x.bandwidth)
      .attr('fill', 'orange')
      .attr('height', d=>y(d.number))
      .attr('x', d=> {
        const xVal = x(d.name)
        if (xVal) {
          return xVal
        } else {
          return null
        }
      })
  
    
   
  },[selection])

  return (
    <div>
      <svg ref={svgRef} width='800' height='500'>
      </svg>
    </div>
    )
}


export default BarChart