
var diameter = 1260,
radius = diameter / 2,
innerRadius = radius - 120;

var cluster : d3.ClusterLayout<any>;
cluster = d3.cluster().size([360, innerRadius]);

let bayaChart = new BayaChart();

// hybroChart2.voronoiChart.setMarginLeft(500);

// d3.json("../voronoi-bundle-donut.json", function(error:any, graphsData:any) {
//     if (error) throw error;
bayaChart.jsonData = graphsData;
d3.select("textarea").text(JSON.stringify( graphsData, null, 2));
var textArea = document.getElementById("graphsData");
textArea.addEventListener('keyup',function(){
  bayaChart.jsonData = JSON.parse(textArea.value);
 bayaChart.delete();
 bayaChart.draw();
});
    // d3.select("textarea").on("change",function(){
      // bayaChart.delete();
      bayaChart.draw();
    // });
    // bayaChart.draw();
    // d3.select("textarea").text("sfsdfsdf");
    // hybroChart3.draw(graphsData[0]);
  // });
  
