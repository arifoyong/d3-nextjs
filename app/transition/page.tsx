"use client"

import { useEffect, useRef, useState } from 'react'
import { select,  Selection } from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { max} from 'd3-array'
import { axisLeft , axisBottom } from 'd3-axis'
import Randomstring from 'randomstring'
import 'd3-transition'
import { easeElastic, easeQuadInOut, easeBounce, easeLinear } from 'd3-ease'
import { transition } from 'd3-transition'

type TData = {
  name: string,
  number: number
}
const initialData: TData[] = [
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

const chart = {
  canvasW: 800,
  canvsH: 500,
  W: 700,
  H: 400,
  ml: 100,
  mt: 50,
}

type d3Select = Selection<null, unknown, null, undefined>

const Group: React.FC = () => {
  const svgRef = useRef(null)
  const [selection, setSelection] = useState<d3Select | null>(null)
  const [data, setData] = useState<TData[]>(initialData)
  
  let y = scaleLinear().domain([0, max(data, d=>d.number)!])
                            .range([chart.H, 0])
  let x = scaleBand().domain(data.map(d=>d.name!))
                            .range([0,chart.W])
                            .paddingInner(0.05)
  useEffect(() => {
    if (!selection) {
      setSelection(select(svgRef.current))
      return
    } 

    selection
      .append('g')
      .attr('transform', `translate(${chart.ml}, ${chart.mt})`)
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('width', x.bandwidth())
      .attr('x', d => x(d.name)!)
      .attr('fill', 'orange')
      .attr('height', d => 0)
      // .attr('y', d=>y(d.number))
      .attr('y', d => chart.H)
      .transition()
      .duration((_,i) => i*100)
      .attr('height', d => chart.H - y(d.number))
      .attr('y', d=>y(d.number))
    
  },[selection])

  const addRandom = () => {
    const dataToAdd = {
      name: Randomstring.generate(10), 
      number: Math.floor(Math.random()*9000)
    }

    setData([...data, dataToAdd])
  }

  const removeLast = () => {
    if (data.length === 0 ) {
      return
    }

    const slicedData = data.slice(0, data.length-1)
    setData(slicedData)
  }

  useEffect(() => {
    if (selection) {
      y = scaleLinear().domain([0, max(data, d=>d.number)!])
                            .range([chart.H, 0])
      x = scaleBand().domain(data.map(d=>d.name!))
                            .range([0,chart.W])
                            .paddingInner(0.05)
      const rects = selection
                  .selectAll('rect')
                  .data(data)

      // remove rectangle
      rects
        .exit()
        .transition()
        .duration(200)
        .attr('y', chart.H)
        .attr('height', 0)
        .remove()

      // update existing rectangle
      rects
        .transition()
        .duration(200)
        .delay(200)
        .attr('width', x.bandwidth())
        .attr('height', d => chart.H - y(d.number))
        .attr('x', d => x(d.name)!)
        .attr('y', d=>y(d.number))
        .attr('fill', 'orange')
      
      // update new rectangle
      rects
        .enter()
        .append('g')
        .attr('transform', `translate(${chart.ml}, ${chart.mt})`)
        .append('rect')
        .attr('width', x.bandwidth())
        .attr('x', d => x(d.name)!)
        .attr('height', d => 0)
        .attr('y', d=> chart.H)
        .transition()
        .duration(200)
        .delay(300)
        .attr('height', d => chart.H - y(d.number))
        .attr('y', d=>y(d.number))
        .attr('fill', 'orange')
    }
  },[data])

  return (
    <div>
      <svg ref={svgRef} 
            width={chart.canvasW}
            height={chart.canvsH}>
      </svg>

      <div className='flex flex-row gap-4'>
        <button className='px-4 py-2 bg-blue-500 rounded-lg'
          onClick={() => addRandom()}>Add</button>
        <button className='px-4 py-2 bg-blue-500 rounded-lg' 
          onClick={() => removeLast()}>Remove</button>
      </div>
    </div>
    )
}


export default Group