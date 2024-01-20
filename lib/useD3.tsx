import React from "react";
import * as d3 from "d3";

export const useD3 = (renderChartFn: (d: SVGElement) => void, dependencies: number[]) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const simulation = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const sim = renderChartFn(d3.select(ref.current));

    
    simulation.current = sim;
    

    return () => {
      if (simulation.current) {
        simulation.current.stop();
      }
    };
  }, dependencies);

  return ref;
};
