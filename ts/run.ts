
var diameter = 1260,
radius = diameter / 2,
innerRadius = radius - 120;

var cluster : d3.ClusterLayout<any>;
cluster = d3.cluster().size([360, innerRadius]);

let tools = new Tools();
let voronoiChart = new Voronoi();
let donutChart = new DonutChart();
let bundleChart = new BundleChart();


d3.json("../voronoi-bundle-donut.json", function(error:any, rootData:any) {
    if (error) throw error;
    
    voronoiChart.draw(rootData);
    bundleChart.draw(rootData);
    donutChart.setWidth(940)
    .setHeight(790)
    .setCornerRadius(3) // sets how rounded the corners are on each slice
    .setPadAngle(0.015) // effectively dictates the gap between slices
    .setVariable('value')
    .setCategory('data.data.name');
    donutChart.draw(bundleChart.leaves);

    

  });
  
