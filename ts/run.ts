
var diameter = 1260,
radius = diameter / 2,
innerRadius = radius - 120;
let readDataByD3 = false;
var cluster : d3.ClusterLayout<any>;
cluster = d3.cluster().size([360, innerRadius]);

let bayaChart = new BayaChart();

// hybroChart2.voronoiChart.setMarginLeft(500);

if(!readDataByD3){
  // bayaChart.jsonData = graphsData;
  bayaChart.jsonData = spoonDataDependencies;
  d3.select("textarea").text(JSON.stringify( spoonDataDependencies, null, 2));
  bayaChart.draw();
}
else {

   d3.json("../inputs/spoon.json", function(error:any, graphsData:any) {
         if (error) throw error;
    // });
    bayaChart.jsonData = graphsData;
    bayaChart.draw();
     });
  }
  
  var textArea = document.getElementById("graphsData");
  textArea.addEventListener('keyup',function(){
    bayaChart.jsonData = JSON.parse(textArea.value);
   bayaChart.delete();
   bayaChart.draw();
  });