
var diameter = 1260,
radius = diameter / 2,
innerRadius = radius - 120;

var cluster : d3.ClusterLayout<any>;
cluster = d3.cluster().size([360, innerRadius]);


let hybroChart = new HybroChart();


d3.json("../voronoi-bundle-donut.json", function(error:any, rootData:any) {
    if (error) throw error;
    hybroChart.draw(rootData);
  });
  
