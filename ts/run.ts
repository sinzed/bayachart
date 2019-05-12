
var diameter = 1260,
radius = diameter / 2,
innerRadius = radius - 120;

var cluster : d3.ClusterLayout<any>;
cluster = d3.cluster().size([360, innerRadius]);

let bayaChart = new BayaChart();

// hybroChart2.voronoiChart.setMarginLeft(500);


d3.json("../voronoi-bundle-donut.json", function(error:any, graphsData:any) {
    if (error) throw error;
    bayaChart.jsonData = graphsData;
    
    bayaChart.draw();
    // hybroChart3.draw(graphsData[0]);
  });
  
