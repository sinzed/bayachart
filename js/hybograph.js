"use strict";
var Tools = /** @class */ (function () {
    function Tools() {
    }
    ///mine
    Tools.prototype.compute2DPolygonCentroid = function (vertices) {
        var centroid = { x: 0, y: 0 };
        var signedArea = 0.0;
        var x0;
        var y0 = 0.0; // Current vertex Y
        var x1 = 0.0; // Next vertex X
        var y1 = 0.0; // Next vertex Y
        var a = 0.0; // Partial signed area
        // For all vertices except last
        var i = 0;
        for (i = 0; i < vertices.length - 1; ++i) {
            x0 = vertices[i][0];
            y0 = vertices[i][1];
            x1 = vertices[i + 1][0];
            y1 = vertices[i + 1][1];
            a = x0 * y1 - x1 * y0;
            signedArea += a;
            centroid.x += (x0 + x1) * a;
            centroid.y += (y0 + y1) * a;
        }
        // Do last vertex separately to avoid performing an expensive
        // modulus operation in each iteration.
        x0 = vertices[i][0];
        y0 = vertices[i][1];
        x1 = vertices[0][0];
        y1 = vertices[0][1];
        a = x0 * y1 - x1 * y0;
        signedArea += a;
        centroid.x += (x0 + x1) * a;
        centroid.y += (y0 + y1) * a;
        signedArea *= 0.5;
        centroid.x /= (6.0 * signedArea);
        centroid.y /= (6.0 * signedArea);
        return centroid;
    };
    Tools.prototype.compute2DPolygonCentroidDebug = function (vertices) {
        //  d="M257.14019840439454,80.91414836764234,277.13783911526855,78.7863751605477,290.5607718784939,56.565704038297,276.5190505577433,37.259487235030086,247.43348855899947,39.1178384237785,246.77060548288318,39.71569224813706z"
        var centroid = { x: 0, y: 0 };
        var signedArea = 0.0;
        var x0;
        var y0 = 0.0; // Current vertex Y
        var x1 = 0.0; // Next vertex X
        var y1 = 0.0; // Next vertex Y
        var a = 0.0; // Partial signed area
        // For all vertices except last
        var i = 0;
        for (i = 0; i < vertices.length - 1; ++i) {
            var x0_1 = vertices[i][0];
            y0 = vertices[i][1];
            x1 = vertices[i + 1][0];
            y1 = vertices[i + 1][1];
            a = x0_1 * y1 - x1 * y0;
            signedArea += a;
            centroid.x += (x0_1 + x1) * a;
            centroid.y += (y0 + y1) * a;
        }
        // Do last vertex separately to avoid performing an expensive
        // modulus operation in each iteration.
        x0 = vertices[i][0];
        y0 = vertices[i][1];
        x1 = vertices[0][0];
        y1 = vertices[0][1];
        a = x0 * y1 - x1 * y0;
        signedArea += a;
        centroid.x += (x0 + x1) * a;
        centroid.y += (y0 + y1) * a;
        signedArea *= 0.5;
        centroid.x /= (6.0 * signedArea);
        centroid.y /= (6.0 * signedArea);
        return centroid;
    };
    // Return a list of imports for the given array of nodes.
    Tools.prototype.packageImports = function (nodes) {
        var map = {}, imports = [];
        // Compute a map from name to node.
        nodes.forEach(function (d) {
            map[d.data.name] = d;
        });
        // For each import, construct a link from the source to target node.
        nodes.forEach(function (d) {
            if (d.data.imports)
                d.data.imports.forEach(function (i) {
                    imports.push(map[d.data.name].path(map[i]));
                });
        });
        return imports;
    };
    // Lazily construct the package hierarchy from class names.
    Tools.prototype.packageHierarchy = function (classes) {
        var map = {};
        function find(name, data) {
            var node = map[name], i;
            if (!node) {
                node = map[name] = data || { name: name, children: [] };
                if (name.length) {
                    node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                    node.parent.children.push(node);
                    // if(node.members)
                    //     packageHierarchy(node.members);
                    // node.key = name.substring(i + 1);
                }
            }
            return node;
        }
        // for( let index in classes){
        //   console.log(index);
        //   if(index == "children")
        //     find(classes[index].name,classes[index]);
        // }
        classes.forEach(function (d) {
            find(d.name, d);
        });
        return d3.hierarchy(map[""]);
    };
    return Tools;
}());
// import * as d3 from 'd3' ;
var Voronoi = /** @class */ (function () {
    function Voronoi() {
        this._2PI = 2 * Math.PI;
        //end: constants
        //begin: layout conf.
        this.svgWidth = 960;
        this.svgAreaHeight = 1500;
        this.svgHeight = 800;
        //begin: constants
        this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
        this.height = this.svgHeight - this.margin.top - this.margin.bottom;
        this.width = this.svgWidth - this.margin.left - this.margin.right;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
        this.quarterWidth = this.width / 4;
        this.quarterHeight = this.height / 4;
        this.titleY = 20;
        this.legendsMinY = this.height - 20;
        this.treemapRadius = 205;
        this.treemapCenter = [this.halfWidth, this.halfHeight + 5];
        this._voronoiTreemap = d3.voronoiTreemap();
        this.fontScale = d3.scaleLinear();
        //end: reusable d3Selection
    }
    Voronoi.prototype.initData = function () {
        this.circlingPolygon = this.computeCirclingPolygon(this.treemapRadius);
        this.fontScale.domain([3, 20]).range([8, 20]).clamp(true);
    };
    Voronoi.prototype.computeCirclingPolygon = function (radius) {
        var points = 60, increment = this._2PI / points, circlingPolygon = [];
        for (var a = 0, i = 0; i < points; i++, a += increment) {
            circlingPolygon.push([radius + radius * Math.cos(a), radius + radius * Math.sin(a)]);
        }
        return circlingPolygon;
    };
    ;
    Voronoi.prototype.initLayout = function (rootData) {
        this.svg = d3.select("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgAreaHeight);
        this.drawingArea = this.svg.append("g")
            .classed("drawingArea", true)
            .attr("transform", "translate(" + [this.margin.left, this.margin.top] + ")");
        this.treemapContainer = this.drawingArea.append("g")
            .classed("treemap-container", true)
            .attr("transform", "translate(" + this.treemapCenter + ")");
        this.treemapContainer.append("path")
            .classed("world", true)
            .attr("transform", "translate(" + [-this.treemapRadius, -this.treemapRadius] + ")")
            .attr("d", "M" + this.circlingPolygon.join(",") + "Z");
        this.drawTitle();
        this.drawFooter();
        this.drawLegends(rootData);
    };
    Voronoi.prototype.drawTitle = function () {
        this.drawingArea.append("text")
            .attr("id", "title")
            .attr("transform", "translate(" + [this.halfWidth, this.titleY] + ")")
            .attr("text-anchor", "middle")
            .text("The Global Economy by GDP (as of 01/2017)");
    };
    Voronoi.prototype.drawFooter = function () {
        this.drawingArea.append("text")
            .classed("tiny light", true)
            .attr("transform", "translate(" + [0, this.height] + ")")
            .attr("text-anchor", "start")
            .text("Remake of HowMuch.net's article 'The Global Economy by GDP'");
        this.drawingArea.append("text")
            .classed("tiny light", true)
            .attr("transform", "translate(" + [this.halfWidth, this.height] + ")")
            .attr("text-anchor", "middle")
            .text("by @_Kcnarf");
        this.drawingArea.append("text")
            .classed("tiny light", true)
            .attr("transform", "translate(" + [this.width, this.height] + ")")
            .attr("text-anchor", "end")
            .text("bl.ocks.org/Kcnarf/fa95aa7b076f537c00aed614c29bb568");
    };
    Voronoi.prototype.drawLegends = function (rootData) {
        var legendHeight = 13, interLegend = 4, colorWidth = legendHeight * 6, continents = rootData.children.reverse();
        var legendContainer = this.drawingArea.append("g")
            .classed("legend", true)
            .attr("transform", "translate(" + [0, this.legendsMinY] + ")");
        var legends = legendContainer.selectAll(".legend")
            .data(continents)
            .enter();
        var legend = legends.append("g")
            .classed("legend", true)
            .attr("transform", function (d, i) {
            return "translate(" + [0, -i * (legendHeight + interLegend)] + ")";
        });
        legend.append("rect")
            .classed("legend-color", true)
            .attr("y", -legendHeight)
            .attr("width", colorWidth)
            .attr("height", legendHeight)
            .style("fill", function (d) { return d.color; });
        legend.append("text")
            .classed("tiny", true)
            .attr("transform", "translate(" + [colorWidth + 5, -2] + ")")
            .text(function (d) { return d.name; });
        legendContainer.append("text")
            .attr("transform", "translate(" + [0, -continents.length * (legendHeight + interLegend) - 5] + ")")
            .text("Continents");
    };
    Voronoi.prototype.drawTreemap = function (hierarchy) {
        var leaves = hierarchy.leaves();
        var self = this;
        var appended = this.treemapContainer.append("g");
        var classed = appended.classed('cells', true);
        var attributed = classed.attr("transform", "translate(" + [-this.treemapRadius, -this.treemapRadius] + ")");
        var selectedAll = classed.selectAll(".cell");
        var datalized = selectedAll.data(leaves);
        var entered = datalized.enter();
        var appendedPath = entered.append("path");
        //   var classedcell = appendedPath.classed("cell", true);
        var attrd = appendedPath.attr("d", function (d) { return "M" + d.polygon.join(",") + "z"; });
        var cells = attrd.style("fill", function (d) {
            return d.parent.data.color;
        });
        var labels = this.treemapContainer.append("g")
            .classed('labels', true)
            .attr("transform", "translate(" + [-this.treemapRadius, -this.treemapRadius] + ")")
            .selectAll(".label")
            .data(leaves)
            .enter()
            .append("g")
            .classed("label", true)
            .attr("transform", function (d) {
            return "translate(" + [d.polygon.site.x, d.polygon.site.y] + ")";
        })
            .style("font-size", function (d) {
            return self.fontScale(d.data.weight);
        });
        labels.append("text")
            .classed("name", true)
            .html(function (d) {
            return (d.data.weight < 1) ? d.data.code : d.data.name;
        });
        labels.append("text")
            .classed("value", true)
            .text(function (d) { return d.data.weight + "%"; });
        var hoverers = this.treemapContainer.append("g")
            .classed('hoverers', true)
            .attr("transform", "translate(" + [-this.treemapRadius, -this.treemapRadius] + ")")
            .selectAll(".hoverer")
            .data(leaves)
            .enter()
            .append("path")
            .classed("hoverer", true)
            .attr("d", function (d) { return "M" + d.polygon.join(",") + "z"; });
        hoverers.append("title")
            .text(function (d) { return d.data.name + "\n" + d.value + "%"; });
    };
    return Voronoi;
}());
var diameter = 1260, radius = diameter / 2, innerRadius = radius - 120;
var cluster;
cluster = d3.cluster().size([360, innerRadius]);
var tools = new Tools();
var voronoiDiagram = new Voronoi();
// var line = d3.radialLine()
// .curve(d3.curveBundle.beta(0.85))
// .radius(function(d) {
//      return d.y / 180 * Math.PI;
//     })
// .angle(function(d) { 
//     return d.x / 180 * Math.PI;
// });
var line = d3.line()
    .curve(d3.curveBundle.beta(0.25)).x(function (d) {
    var x = d.polygon[0][0];
    console.log(d.polygon);
    // let centeroid;
    // if( d.polygon.site && d.polygon.site.x != undefined){
    //   x = d.polygon.site.x;
    // }
    // else {
    x = tools.compute2DPolygonCentroid(d.polygon);
    if (d.data && d.data.name == "Netherlands") {
        x = tools.compute2DPolygonCentroidDebug(d.polygon);
    }
    // }
    // var x = d.polygon.site.x;
    return x.x;
    return x;
})
    .y(function (d) {
    var y = d.polygon[0][1];
    // if(d.polygon.site && d.polygon.site.y != undefined){
    // y = d.polygon.site.y;
    // }
    // else {
    y = tools.compute2DPolygonCentroid(d.polygon);
    // }
    return y.y;
    return y;
    // return d.polygon.site.y;
});
// var line = d3.line()
// .curve(d3.curveBundle.beta(0.85)).x(function(d) { return d.x + d.dx / 2; })
// .y(function(d) { return d.y + d.dy / 2; })
// .angle(function(d) { return d.x / 180 * Math.PI; });
// var svg = d3.select("body").append("svg")
// .append("g")
// .attr("transform", "translate(" + radius + "," + radius + ")");
d3.json("../voronoi-bundle-donut.json", function (error, rootData) {
    if (error)
        throw error;
    voronoiDiagram.initData();
    voronoiDiagram.initLayout(rootData);
    voronoiDiagram.hierarchy = d3.hierarchy(rootData).sum(function (d) { return d.weight; });
    voronoiDiagram._voronoiTreemap.clip(voronoiDiagram.circlingPolygon)(voronoiDiagram.hierarchy);
    voronoiDiagram.drawTreemap(voronoiDiagram.hierarchy);
    var svg = d3.select(".drawingArea")
        .attr("width", diameter)
        .attr("height", diameter)
        .insert('g', '#first + *');
    var linkElement = svg.append("g").selectAll(".link"), node = svg.append("g").attr("transform", "translate(270,35)").selectAll(".node");
    var root = tools.packageHierarchy(rootData.children)
        .sum(function (d) { return d.size; });
    cluster(root);
    // cluster(rootDeb);
    var leaves = voronoiDiagram.hierarchy.descendants();
    // var leaves = root.descendants();
    var data = tools.packageImports(leaves);
    var link = linkElement
        .data(data)
        .enter().append("path").attr("transform", "translate(263,208)")
        .each(function (d) { d.source = d[0], d.target = d[d.length - 1]; })
        .attr("class", "link")
        .attr("d", line).attr("stroke-width", 2).attr("stroke-dasharray", 4);
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
        .attr("transform", function (d) {
        // var x = Math.abs(d.polygon[0][0]-d.polygon[d.polygon.length-1][0])/2;
        // var y = Math.abs(d.polygon[0][0]-d.polygon[d.polygon.length-1][0])/2;
        var x = d.polygon[0][0];
        var y = d.polygon[0][1];
        // console.log(d);
        if (d.polygon.site != undefined) {
            var x = d.polygon.site.x;
            var y = d.polygon.site.y;
        }
        // console.log("dis",d.polygon.site);
        return "translate(0,0)";
        // return "translate(" + x + "," +y+")"; 
        // return "rotate(" + (x- 90) + ")translate(" + (y + 8) + ",0)" + (x < 180 ? "" : "rotate(180)"); 
    })
        .attr("text-anchor", function (d) {
        var x = d.polygon[0][0];
        // var x = d.polygon.site.x;
        // var y = d.polygon.site.y;
        return x < 180 ? "start" : "end";
        // return "start"; 
    })
        .text(function (d) { return d.data.name; })
        .on("mouseover", mouseovered)
        .on("mouseout", mouseouted);
});
//# sourceMappingURL=hybograph.js.map