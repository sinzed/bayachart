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
        var map = {};
        var imports = [];
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
        this.canDrawLegends = false;
        this.canDrawTitle = false;
        this.canDrawFooter = false;
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
    Voronoi.prototype.initData = function (rootData) {
        this.circlingPolygon = this.computeCirclingPolygon(this.treemapRadius);
        this.fontScale.domain([3, 20]).range([8, 20]).clamp(true);
        this.initLayout(rootData);
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
        this.hierarchy = d3.hierarchy(rootData).sum(function (d) { return d.weight; });
        this._voronoiTreemap.clip(voronoiChart.circlingPolygon)(voronoiChart.hierarchy);
    };
    Voronoi.prototype.drawTitle = function () {
        if (!this.canDrawTitle)
            return true;
        this.drawingArea.append("text")
            .attr("id", "title")
            .attr("transform", "translate(" + [this.halfWidth, this.titleY] + ")")
            .attr("text-anchor", "middle")
            .text("The Global Economy by GDP (as of 01/2017)");
    };
    Voronoi.prototype.drawFooter = function () {
        if (!this.canDrawFooter)
            return true;
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
        if (!this.canDrawLegends)
            return true;
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
    Voronoi.prototype.drawTreemap = function () {
        var leaves = this.hierarchy.leaves();
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
    Voronoi.prototype.draw = function (rootData) {
        this.initData(rootData);
        this.drawTreemap();
    };
    return Voronoi;
}());
var BundleChart = /** @class */ (function () {
    function BundleChart() {
        this.init();
    }
    BundleChart.prototype.init = function () {
        this.lineFunction();
    };
    BundleChart.prototype.draw = function (rootData) {
        this.svg = d3.select(".drawingArea")
            .attr("width", diameter)
            .attr("height", diameter)
            .insert('g', '#first + *');
        this.linkElement = this.svg.append("g").selectAll(".link");
        this.nodeElement = this.svg.append("g").attr("transform", "translate(270,35)").selectAll(".node");
        var root = tools.packageHierarchy(rootData.children)
            .sum(function (d) { return d.size; });
        cluster(root);
        // cluster(rootDeb);
        this.leaves = voronoiChart.hierarchy.descendants();
        // var leaves = root.descendants();
        var data = tools.packageImports(this.leaves);
        var link = this.linkElement
            .data(data)
            .enter().append("path").attr("transform", "translate(263,208)")
            .each(function (d) { d.source = d[0], d.target = d[d.length - 1]; })
            .attr("class", "link")
            .attr("d", this.line).attr("stroke-width", 2).attr("stroke-dasharray", 4);
        // this.drawNodeNames();
    };
    BundleChart.prototype.drawNodeNames = function () {
        var node = this.nodeElement
            .data(this.leaves)
            .enter()
            .append("text")
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
            // return "translate(0,0)"; 
            return "translate(" + x + "," + y + ")";
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
    };
    BundleChart.prototype.lineFunction = function () {
        this.line = d3.line()
            .curve(d3.curveBundle.beta(0.25)).x(function (d) {
            var x = d.polygon[0][0];
            x = tools.compute2DPolygonCentroid(d.polygon);
            if (d.data && d.data.name == "Netherlands") {
                x = tools.compute2DPolygonCentroidDebug(d.polygon);
            }
            return x.x;
        })
            .y(function (d) {
            var y = d.polygon[0][1];
            y = tools.compute2DPolygonCentroid(d.polygon);
            return y.y;
        });
    };
    return BundleChart;
}());
var DonutChart = /** @class */ (function () {
    function DonutChart() {
        this.canDrawPipeLables = false;
        this._margin = { top: 10, right: 10, bottom: 10, left: 10 };
        this.colorize = d3.scaleOrdinal(d3.schemeCategory20c); // colour scheme
        this.floatFormat = d3.format('.4r');
        this.percentFormat = d3.format(',.2%');
        this._width = 300;
        // getter and setter functions. See Mike Bostocks post "Towards Reusable Charts" for a tutorial on how this works.
        // this.width = function(value: any) {
        //     if (!arguments.length) return this.width;
        //     this.width = value;
        //     return this;
        // };
    }
    DonutChart.prototype.getWidth = function () {
        return this._width;
    };
    DonutChart.prototype.setWidth = function (value) {
        this._width = value;
        return this;
    };
    DonutChart.prototype.setHeight = function (value) {
        this._height = value;
        return this;
    };
    DonutChart.prototype.height = function (value) {
        if (!arguments.length)
            return this._height;
        this._height = value;
        return this;
    };
    ;
    DonutChart.prototype.setMargin = function (value) {
        this._margin = value;
        return this;
    };
    ;
    DonutChart.prototype.getMargin = function () {
        return this._margin;
    };
    ;
    DonutChart.prototype.setRadius = function (value) {
        this._radius = value;
        return this;
    };
    ;
    DonutChart.prototype.getRadius = function () {
        return this._radius;
    };
    ;
    DonutChart.prototype.setPadAngle = function (value) {
        this._padAngle = value;
        return this;
    };
    ;
    DonutChart.prototype.getPadAngle = function (value) {
        return this._padAngle;
    };
    ;
    DonutChart.prototype.setCornerRadius = function (value) {
        this._cornerRadius = value;
        return this;
    };
    ;
    DonutChart.prototype.getCornerRadius = function (value) {
        return this._cornerRadius;
    };
    ;
    DonutChart.prototype.setColour = function (value) {
        this._colour = value;
        return this;
    };
    ;
    DonutChart.prototype.getColour = function (value) {
        return this._colour;
    };
    ;
    DonutChart.prototype.setVariable = function (value) {
        this._variable = value;
        return this;
    };
    ;
    DonutChart.prototype.getVariable = function (value) {
        return this._variable;
    };
    ;
    DonutChart.prototype.setCategory = function (value) {
        this._category = value;
        return this;
    };
    ;
    DonutChart.prototype.getCategory = function (value) {
        return this._category;
    };
    ;
    DonutChart.prototype.draw = function (leaves) {
        // d3.select('.drawingArea')
        var selection = d3.select('svg').datum(leaves); // bind data to the div
        donutChart.chart(selection);
        // .call(donutChart.chart); // draw chart in div
        // bundleChart.drawNodeNames();
    };
    DonutChart.prototype.chart = function (selection) {
        var self = this;
        selection.each(function (data) {
            // generate chart
            // ===========================================================================================
            // Set up constructors for making donut. See https://github.com/d3/d3-shape/blob/master/README.md
            var radius = Math.min(self._width, self._height) / 2;
            // creates a new pie generator
            var pie = d3.pie()
                .value(function (d) { return self.floatFormat(d[self._variable]); })
                .sort(null);
            // contructs and arc generator. This will be used for the donut. The difference between outer and inner
            // radius will dictate the thickness of the donut
            var arc = d3.arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.6)
                .cornerRadius(self._cornerRadius)
                .padAngle(self._padAngle);
            // this arc is used for aligning the text labels
            var outerArc = d3.arc()
                .outerRadius(radius * 0.9)
                .innerRadius(radius * 0.9);
            // ===========================================================================================
            // ===========================================================================================
            // append the svg object to the selection
            var svg = selection.append('svg')
                .attr('width', self._width + self._margin.left + self._margin.right)
                .attr('height', self._height + self._margin.top + self._margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + self._width / 2 + ',' + self._height / 2 + ')');
            // ===========================================================================================
            // ===========================================================================================
            // g elements to keep elements within svg modular
            svg.append('g').attr('class', 'slices');
            svg.append('g').attr('class', 'labelName');
            svg.append('g').attr('class', 'lines');
            // ===========================================================================================
            // ===========================================================================================
            // add and colour the donut slices
            var path = svg.select('.slices')
                .datum(data).selectAll('path')
                .data(pie)
                .enter().append('path')
                .attr('fill', function (d) {
                //  return colour(d.data[category]);
                return self.colorize(d.data.data.name);
            })
                .attr('d', arc);
            // ===========================================================================================
            if (self.canDrawPipeLables) {
                // ===========================================================================================
                // add text labels
                var label = svg.select('.labelName').selectAll('text')
                    .data(pie)
                    .enter().append('text')
                    .attr('dy', '.35em')
                    .html(function (d) {
                    // add "key: value" for given category. Number inside tspan is bolded in stylesheet.
                    return d.data.data.name + ': <tspan>' + self.percentFormat(d.data[self._variable]) + '</tspan>';
                    // return d.data[category] + ': <tspan>' + percentFormat(d.data[variable]) + '</tspan>';
                })
                    .attr('transform', function (d) {
                    // effectively computes the centre of the slice.
                    // see https://github.com/d3/d3-shape/blob/master/README.md#arc_centroid
                    var pos = outerArc.centroid(d);
                    // changes the point to be on left or right depending on where label is.
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return 'translate(' + pos + ')';
                })
                    .style('text-anchor', function (d) {
                    // if slice centre is on the left, anchor text to start, otherwise anchor to end
                    return (midAngle(d)) < Math.PI ? 'start' : 'end';
                });
                // ===========================================================================================
                // ===========================================================================================
                // add lines connecting labels to slice. A polyline creates straight lines connecting several points
                var polyline = svg.select('.lines')
                    .selectAll('polyline')
                    .data(pie)
                    .enter().append('polyline')
                    .attr('points', function (d) {
                    // see label transform function for explanations of these three lines.
                    var pos = outerArc.centroid(d);
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return [arc.centroid(d), outerArc.centroid(d), pos];
                });
                // ===========================================================================================
            }
            // ===========================================================================================
            // add tooltip to mouse events on slices and labels
            d3.selectAll('.labelName text, .slices path').call(toolTip);
            // ===========================================================================================
            // ===========================================================================================
            // Functions
            // calculates the angle for the middle of a slice
            function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }
            // function that creates and adds the tool tip to a selected element
            function toolTip(selection) {
                // add tooltip (svg circle element) when mouse enters label or slice
                selection.on('mouseenter', function (data) {
                    svg.append('text')
                        .attr('class', 'toolCircle')
                        .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                        .html(toolTipHTML(data)) // add text to the circle.
                        .style('font-size', '.9em')
                        .style('text-anchor', 'middle'); // centres text in tooltip
                    svg.append('circle')
                        .attr('class', 'toolCircle')
                        .attr('r', radius * 0.55) // radius of tooltip circle
                        .style('fill', self.setColour(data.data.name)) // colour based on category mouse is over
                        // .style('fill', colour(data.data[category])) // colour based on category mouse is over
                        .style('fill-opacity', 0.35);
                });
                // remove the tooltip when mouse leaves the slice/label
                selection.on('mouseout', function () {
                    d3.selectAll('.toolCircle').remove();
                });
            }
            // function to create the HTML string for the tool tip. Loops through each key in data object
            // and returns the html string key: value
            function toolTipHTML(data) {
                var tip = '', i = 0;
                for (var key in data.data) {
                    // if value is a number, format it as a percentage
                    var value = (!isNaN(parseFloat(data.data[key]))) ? self.percentFormat(data.data[key]) : data.data[key];
                    // leave off 'dy' attr for first tspan so the 'dy' attr on text element works. The 'dy' attr on
                    // tspan effectively imitates a line break.
                    if (i === 0)
                        tip += '<tspan x="0">' + key + ': ' + value + '</tspan>';
                    else
                        tip += '<tspan x="0" dy="1.2em">' + key + ': ' + value + '</tspan>';
                    i++;
                }
                return tip;
            }
            // ===========================================================================================
        });
    };
    return DonutChart;
}());
var diameter = 1260, radius = diameter / 2, innerRadius = radius - 120;
var cluster;
cluster = d3.cluster().size([360, innerRadius]);
var tools = new Tools();
var voronoiChart = new Voronoi();
var donutChart = new DonutChart();
var bundleChart = new BundleChart();
d3.json("../voronoi-bundle-donut.json", function (error, rootData) {
    if (error)
        throw error;
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
//# sourceMappingURL=hybograph.js.map