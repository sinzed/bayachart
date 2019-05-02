
var diameter = 1260,
radius = diameter / 2,
innerRadius = radius - 120;

var cluster : d3.ClusterLayout<any>;
cluster = d3.cluster().size([360, innerRadius]);



let hybroChart2 = new HybroChart();
hybroChart2.voronoiChart.setMarginLeft(500);


d3.json("../voronoi-bundle-donut.json", function(error:any, graphsData:any) {
    if (error) throw error;
    for(let graphData in graphsData){
      if(graphData=="hybrograph")
        continue;
      let hybroChart = new HybroChart();
      // hybroChart.voronoiChart.setMarginLeft(Math.random()*-500);
      hybroChart.draw(graphsData[graphData]);
    }
    hybroChart2.forceChart.disable();
    hybroChart2.voronoiChart.setMarginLeft(Math.random()*-500);
    hybroChart2.draw(graphsData[graphData]);
  });
  
