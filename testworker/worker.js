importScripts('https://d3js.org/d3.v4.min.js');

self.onmessage = function(e){
  let msg = e.data;
  let voronoi = d3.voronoi().extent(msg.extent);

  self.postMessage({
    polygons: voronoi.polygons(msg.data)
  });

};