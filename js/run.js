
var diameter = 1260,
radius = diameter / 2,
innerRadius = radius - 120;

var cluster = d3.cluster()
.size([360, innerRadius]);

// var line = d3.radialLine()
// .curve(d3.curveBundle.beta(0.85))
// .radius(function(d) {
//      return d.y / 180 * Math.PI;
    
//     })
// .angle(function(d) { 
//     return d.x / 180 * Math.PI;

// });
var line = d3.line()
.curve(d3.curveBundle.beta(0.25)).x(function(d) {
    var x = d.polygon[0][0];
    console.log(d.polygon);
    // let centeroid;
    // if( d.polygon.site && d.polygon.site.x != undefined){
    //   x = d.polygon.site.x;


    // }
    // else {
    x =  compute2DPolygonCentroid(d.polygon);

    if(d.data && d.data.name == "Netherlands"){
      x =  compute2DPolygonCentroidDebug(d.polygon);
    }
    // }
    // var x = d.polygon.site.x;
    return x.x ;
    return x ;
 })
.y(function(d) {
  var y =  d.polygon[0][1];
  // if(d.polygon.site && d.polygon.site.y != undefined){
    // y = d.polygon.site.y;
  // }
  // else {

    y = compute2DPolygonCentroid(d.polygon);
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

d3.json("../voronoi-bundle-donut.json", function(error, rootData) {
    if (error) throw error;
    
    initData();
    initLayout(rootData);
    
    hierarchy = d3.hierarchy(rootData).sum(function(d){ return d.weight; });
    _voronoiTreemap.clip(circlingPolygon)(hierarchy);
    
    drawTreemap(hierarchy);

    var svg = d3.select(".drawingArea")
    .attr("width", diameter)
    .attr("height", diameter)
    .insert('g', '#first + *');
    var link = svg.append("g").selectAll(".link"),
    node = svg.append("g").attr("transform","translate(270,35)").selectAll(".node");
    

    var root = packageHierarchy(rootData.children)
    .sum(function(d) { return d.size; });

    cluster(root);
    // cluster(rootDeb);
    var leaves = hierarchy.descendants();
    // var leaves = root.descendants();
    var data = packageImports(leaves);
    link = link
    .data(data)
    .enter().append("path").attr("transform","translate(263,208)")
    .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
    .attr("class", "link")
    .attr("d", line).attr("stroke-width", 2).attr("stroke-dasharray",4);


    var donut = donutChart()
    .width(940)
    .height(790)
    .cornerRadius(3) // sets how rounded the corners are on each slice
    .padAngle(0.015) // effectively dictates the gap between slices
    .variable('value')
    .category('data.data.name');

    

    // d3.select('.drawingArea')
    d3.select('svg')
    .datum(leaves) // bind data to the div
        .call(donut); // draw chart in div

    node = node
    .data(leaves)
    .enter().append("text")
    .attr("class", "node")
    .attr("dy", "0.31em")
    .attr("transform", function(d) {
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
    .attr("text-anchor", function(d) { 
      var x = d.polygon[0][0];
      // var x = d.polygon.site.x;
      // var y = d.polygon.site.y;
      
      return x < 180 ? "start" : "end"; 
      // return "start"; 
    
    })
    .text(function(d) { return d.data.name; })
    .on("mouseover", mouseovered)
    .on("mouseout", mouseouted);
    

  });
  


  ///mine
function compute2DPolygonCentroid(vertices)
{
    centroid = {x:0,y:0};
    let signedArea = 0.0;
    let y0 = 0.0; // Current vertex Y
    let x1 = 0.0; // Next vertex X
    let y1 = 0.0; // Next vertex Y
    let a = 0.0;  // Partial signed area

    // For all vertices except last
    let i=0;
    for (i=0; i<vertices.length-1; ++i)
    {
        x0 = vertices[i][0];
        y0 = vertices[i][1];
        x1 = vertices[i+1][0];
        y1 = vertices[i+1][1];
        a = x0*y1 - x1*y0;
        signedArea += a;
        centroid.x += (x0 + x1)*a;
        centroid.y += (y0 + y1)*a;
    }

    // Do last vertex separately to avoid performing an expensive
    // modulus operation in each iteration.
    x0 = vertices[i][0];
    y0 = vertices[i][1];
    x1 = vertices[0][0];
    y1 = vertices[0][1];
    a = x0*y1 - x1*y0;
    signedArea += a;
    centroid.x += (x0 + x1)*a;
    centroid.y += (y0 + y1)*a;

    signedArea *= 0.5;
    centroid.x /= (6.0*signedArea);
    centroid.y /= (6.0*signedArea);


    return centroid;
}
function compute2DPolygonCentroidDebug(vertices)
{

//  d="M257.14019840439454,80.91414836764234,277.13783911526855,78.7863751605477,290.5607718784939,56.565704038297,276.5190505577433,37.259487235030086,247.43348855899947,39.1178384237785,246.77060548288318,39.71569224813706z"
    centroid = {x:0,y:0};
    let signedArea = 0.0;
    let y0 = 0.0; // Current vertex Y
    let x1 = 0.0; // Next vertex X
    let y1 = 0.0; // Next vertex Y
    let a = 0.0;  // Partial signed area

    // For all vertices except last
    let i=0;
    for (i=0; i<vertices.length-1; ++i)
    {
        x0 = vertices[i][0];
        y0 = vertices[i][1];
        x1 = vertices[i+1][0];
        y1 = vertices[i+1][1];
        a = x0*y1 - x1*y0;
        signedArea += a;
        centroid.x += (x0 + x1)*a;
        centroid.y += (y0 + y1)*a;
    }

    // Do last vertex separately to avoid performing an expensive
    // modulus operation in each iteration.
    x0 = vertices[i][0];
    y0 = vertices[i][1];
    x1 = vertices[0][0];
    y1 = vertices[0][1];
    a = x0*y1 - x1*y0;
    signedArea += a;
    centroid.x += (x0 + x1)*a;
    centroid.y += (y0 + y1)*a;

    signedArea *= 0.5;
    centroid.x /= (6.0*signedArea);
    centroid.y /= (6.0*signedArea);

    return centroid;
}