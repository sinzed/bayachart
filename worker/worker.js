importScripts('https://d3js.org/d3.v4.min.js');
importScripts("../js/d3-vornoi-wheightend-build.js");
importScripts("../js/d3-vornoi-map-build.js");
importScripts("../js/d3-voronoi-treemap.js");

onmessage = function(e) {
    // var workerResult = 'Result: ' + (e.data[0] * e.data[1],e);
    let voronoiTreemap = d3.voronoiTreemap();
    let circlingPolygon = e.data[0];
    let hierarchy = e.data[1];
    let result = voronoiTreemap.clip(circlingPolygon)(hierarchy);
    
    postMessage(hierarchy);
  }


//   self.onmessage = function(e){
//     let msg = e.data;
  
//     let voronoi = d3.voronoi().extent(msg.extent);
  
//     self.postMessage({
//       polygons: voronoi.polygons(msg.data)
//     });
  
//   };
  
//   onmessage =  function recurse(clippingPolygon, node) {
//     var voronoiMapRes;

//     //assign polygon to node
//     node.polygon = clippingPolygon;

//     if (node.height != 0) {
//       //compute one-level Voronoi map of children
//       voronoiMapRes = _voronoiMap.clip(clippingPolygon)(node.children);
//       //begin: recurse on children
//       voronoiMapRes.polygons.forEach(function (cp) {
//         recurse(cp, cp.site.originalObject.data.originalData);
//       })
//       //end: recurse on children
//     }
//   };