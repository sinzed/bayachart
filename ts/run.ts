
var diameter = 1260,
radius = diameter / 2,
innerRadius = radius - 120;
let readDataByD3 = true;
var cluster : d3.ClusterLayout<any>;
cluster = d3.cluster().size([360, innerRadius]);

let bayaChart = new BayaChart();

// hybroChart2.voronoiChart.setMarginLeft(500);

if(!readDataByD3){
  // bayaChart.jsonData = graphsData;
      if(localStorage.getItem("jsonData") == null){
        bayaChart.setJsonData(spoonDataDependencies);
        // bayaChart.jsonData = spoonDataDependencies;
      }
      else {
        bayaChart.setJsonData(JSON.parse(<string>localStorage.getItem("jsonData")));
        // bayaChart.jsonData = JSON.parse(<string>localStorage.getItem("jsonData"));
        localStorage.clear();
      }
      // d3.select("textarea").text(JSON.stringify( spoonDataDependencies, null, 2));
      bayaChart.draw();
  }
else {

    //  d3.json("ts/inputs/spoon.json", function(error:any, graphsData:any) {

    d3.json("voronoi-bundle-donut.json", function(error:any, graphsData:any) {
          if (error) throw error;
      // });
      bayaChart.setJsonData(graphsData);
      // bayaChart.jsonData = graphsData;
      bayaChart.draw();
      });
    }
  
  // var textArea = document.getElementById("graphsData");
  // textArea.addEventListener('keyup',function(){
  //   bayaChart.jsonData = JSON.parse(textArea.value);
  //  bayaChart.delete();
  //  bayaChart.draw();
  // });

  function IsJson(str : string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return true;
    }
    return false;
}