
var diameter = 1260,
radius = diameter / 2,
innerRadius = radius - 120;

var cluster : d3.ClusterLayout<any>;
cluster = d3.cluster().size([360, innerRadius]);

let tools = new Tools();
let voronoiDiagram = new Voronoi();
voronoiDiagram.canDrawLegends = false;
voronoiDiagram.canDrawTitle = false;
voronoiDiagram.canDrawFooter = false;
let donut = new DonutChart();
donut.canDrawPipeLables= false;

// var line = d3.radialLine()
// .curve(d3.curveBundle.beta(0.85))
// .radius(function(d) {
//      return d.y / 180 * Math.PI;
    
//     })
// .angle(function(d) { 
//     return d.x / 180 * Math.PI;

// });
var line = d3.line()
.curve(d3.curveBundle.beta(0.25)).x(function(d : any) {
    var x = d.polygon[0][0];
    console.log(d.polygon);
    // let centeroid;
    // if( d.polygon.site && d.polygon.site.x != undefined){
    //   x = d.polygon.site.x;


    // }
    // else {
    x =  tools.compute2DPolygonCentroid(d.polygon);

    if(d.data && d.data.name == "Netherlands"){
      x =  tools.compute2DPolygonCentroidDebug(d.polygon);
    }
    // }
    // var x = d.polygon.site.x;
    return x.x ;
    return x ;
 })
.y(function(d: any) {
  var y =  d.polygon[0][1];
  // if(d.polygon.site && d.polygon.site.y != undefined){
    // y = d.polygon.site.y;
  // }
  // else {

    y = tools.compute2DPolygonCentroid(d.polygon);
  // }
  return y.y;
  return y;
  // return d.polygon.site.y;
 }
  
  );
// var line = d3.line()
// .curve(d3.curveBundle.beta(0.85)).x(function(d) { return d.x + d.dx / 2; })
// .y(function(d) { return d.y + d.dy / 2; })
// .angle(function(d) { return d.x / 180 * Math.PI; });

// var svg = d3.select("body").append("svg")

// .append("g")
// .attr("transform", "translate(" + radius + "," + radius + ")");
d3.json("../voronoi-bundle-donut.json", function(error:any, rootData:any) {
    if (error) throw error;
    
    voronoiDiagram.initData();
    voronoiDiagram.initLayout(rootData);
    
    voronoiDiagram.hierarchy = d3.hierarchy(rootData).sum(function(d){ return d.weight; });
    voronoiDiagram._voronoiTreemap.clip(voronoiDiagram.circlingPolygon)(voronoiDiagram.hierarchy);
    
    voronoiDiagram.drawTreemap(voronoiDiagram.hierarchy);

    var svg = d3.select(".drawingArea")
    .attr("width", diameter)
    .attr("height", diameter)
    .insert('g', '#first + *');
    var linkElement = svg.append("g").selectAll(".link"),
    nodeElement = svg.append("g").attr("transform","translate(270,35)").selectAll(".node");
    

    var root = tools.packageHierarchy(rootData.children)
    .sum(function(d: any) { return d.size; });

    cluster(root);
    // cluster(rootDeb);
    var leaves = voronoiDiagram.hierarchy.descendants();
    // var leaves = root.descendants();
    var data = tools.packageImports(leaves);
    let link = linkElement
    .data(data)
    .enter().append("path").attr("transform","translate(263,208)")
    .each(function(d: any) { d.source = d[0], d.target = d[d.length - 1]; })
    .attr("class", "link")
    .attr("d", line).attr("stroke-width", 2).attr("stroke-dasharray",4);


    // var donut = donutChart()
    donut.setWidth(940).
    setHeight(790)
    .setCornerRadius(3) // sets how rounded the corners are on each slice
    .setPadAngle(0.015) // effectively dictates the gap between slices
    .setVariable('value')
    .setCategory('data.data.name');

    // d3.select('.drawingArea')
    let selection = d3.select('svg')
    .datum(leaves) // bind data to the div
    ;
  donut.chart(selection);
    // .call(donut.chart); // draw chart in div

    let node = nodeElement
    .data(leaves)
    .enter().append("text")
    .attr("class", "node")
    .attr("dy", "0.31em")
    .attr("transform", function(d:any) {
      // var x = Math.abs(d.polygon[0][0]-d.polygon[d.polygon.length-1][0])/2;
      // var y = Math.abs(d.polygon[0][0]-d.polygon[d.polygon.length-1][0])/2;
      var x = d.polygon[0][0];
      var y = d.polygon[0][1];
      // console.log(d);
      if(d.polygon.site != undefined){
        var x = d.polygon.site.x;
        var y = d.polygon.site.y;
      }
      // console.log("dis",d.polygon.site);
      return "translate(0,0)"; 
      // return "translate(" + x + "," +y+")"; 
      // return "rotate(" + (x- 90) + ")translate(" + (y + 8) + ",0)" + (x < 180 ? "" : "rotate(180)"); 
    
    })
    .attr("text-anchor", function(d:any ) { 
      var x = d.polygon[0][0];
      // var x = d.polygon.site.x;
      // var y = d.polygon.site.y;
      
      return x < 180 ? "start" : "end"; 
      // return "start"; 
    
    })
    .text(function(d:any) { return d.data.name; })
    .on("mouseover", mouseovered)
    .on("mouseout", mouseouted);
    

  });
  
