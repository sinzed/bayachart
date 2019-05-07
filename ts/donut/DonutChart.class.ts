class DonutChart extends Chart {
    // width: any;
    _height: any;
    _margin: any;
    _colour: any;
    _variable: any; // value in data that will dictate proportions on chart
    _category: any; // compare data by
    _padAngle: any; // effectively dictates the gap between slices
    floatFormat: any;
    _cornerRadius: any | number; // sets how rounded the corners are on each slice
    percentFormat: any | number;
    colorize: Function;
    _radius: any;
    _width: number;
    canDrawPipeLables: boolean = false;
    selection: any;
    element : any;
    constructor(){
        super();
        this._margin = {top: 10, right: 10, bottom: 10, left: 10};
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
    getParent() : HybroChart{
        return super.getParent();
    }
    getWidth () : any {
            return this._width;
        
    }
    setWidth (value: any) : DonutChart {
        this._width = value;
        return this;
    }
    setHeight (value: any) : DonutChart {
        this._height = value;
        return this;
    }

    height(value: any) {
        if (!arguments.length) return this._height;
        this._height = value;
        return this;
    };
    
    setMargin (value: any) {
        this._margin = value;
        return this;
    };
    getMargin () {
        return this._margin;
    };
    
    setRadius (value: any) {
        this._radius = value;
        return this;
    };
    getRadius () {
        return this._radius;
    };
    
    setPadAngle (value: any) {
        this._padAngle = value;
        return this;
    };
    getPadAngle (value: any) {
        return this._padAngle;
    };
    
    setCornerRadius (value: any) {
        this._cornerRadius = value;
        return this;
    };
    getCornerRadius (value: any) {
      return this._cornerRadius;
    };
    
    setColour (value: any) {
        this._colour = value;
        return this;
    };
    getColour (value: any) {
        return this._colour;
    };
    
    setVariable (value: any) {
        this._variable = value;
        return this;
    };
    getVariable (value: any) {
        return this._variable;
    };
    
    setCategory (value: any) {
        this._category = value;
        return this;
    };
    
    getCategory (value: any) {
        return this._category;
    };
    draw(leaves:any){
            // d3.select('.drawingArea')
    // this.selection = d3.select('svg g').datum(leaves); // bind data to the div
    this.selection = this.getParent().voronoiChart.drawingArea.select(".treemap-container").datum(leaves); // bind data to the div
    this.chart(this.selection);
    
    // .call(donutChart.chart); // draw chart in div

  // bundleChart.drawNodeNames();
    }
    chart(selection: any){
        let self =this;
        self.element = selection.append('g').classed("donut",true);
        selection.each(function(data:any) {
            // generate chart

            // ===========================================================================================
            // Set up constructors for making donut. See https://github.com/d3/d3-shape/blob/master/README.md
            var radius = Math.min(self._width, self._height) / 2;

            // creates a new pie generator
            var pie = d3.pie()
                .value(function(d: any) { return self.floatFormat(d[self._variable]); })
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
            // self.element = selection.append('g').classed("donut",true);
            var svg =  self.element
                .attr('width', self._width + self._margin.left + self._margin.right)
                .attr('height', self._height + self._margin.top + self._margin.bottom)
              .append('g')
                // .style('transform', 'translate(50%,50%)');
                // .attr('transform', 'translate(' + self._width / 2 + ',' + self._height / 2 + ')');
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
                .datum(data)
                .selectAll('path')
                .data(pie)
                .enter()
                .append('path')
                .attr('fill', function (d: any) {
                    //  return colour(d.data[category]);
                    return self.colorize(d.data.data.name);
                })
                .attr('d', arc);
            // ===========================================================================================

           if(self.canDrawPipeLables){

               // ===========================================================================================
               // add text labels
               var label = svg.select('.labelName').selectAll('text')
               .data(pie)
              .enter().append('text')
              .attr('dy', '.35em')
              .html(function(d:any) {
                  // add "key: value" for given category. Number inside tspan is bolded in stylesheet.
                  return d.data.data.name + ': <tspan>' + self.percentFormat(d.data[self._variable]) + '</tspan>';
                    // return d.data[category] + ': <tspan>' + percentFormat(d.data[variable]) + '</tspan>';
                })
                .attr('transform', function(d:any) {

                    // effectively computes the centre of the slice.
                    // see https://github.com/d3/d3-shape/blob/master/README.md#arc_centroid
                    var pos = outerArc.centroid(d);
                    
                    // changes the point to be on left or right depending on where label is.
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return 'translate(' + pos + ')';
                })
                .style('text-anchor', function(d:any) {
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
            .attr('points', function(d:any) {
                
                // see label transform function for explanations of these three lines.
                var pos = outerArc.centroid(d);
                pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                return [arc.centroid(d), outerArc.centroid(d), pos]
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
            function midAngle(d:any) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

            // function that creates and adds the tool tip to a selected element
            function toolTip(selection:any) {

                // add tooltip (svg circle element) when mouse enters label or slice
                selection.on('mouseenter', function (data:any) {

                    svg.append('text')
                        .attr('class', 'toolCircle')
                        .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                        // .html(toolTipHTML(data.data.name)) // add text to the circle.
                        .html(data.data.name) // add text to the circle.
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
            function toolTipHTML(data:any) {

                var tip = '',
                    i   = 0;

                for (var key in data.data) {

                    // if value is a number, format it as a percentage
                    var value = (!isNaN(parseFloat(data.data[key]))) ? self.percentFormat(data.data[key]) : data.data[key];

                    // leave off 'dy' attr for first tspan so the 'dy' attr on text element works. The 'dy' attr on
                    // tspan effectively imitates a line break.
                    if (i === 0) tip += '<tspan x="0">' + key + ': ' + value + '</tspan>';
                    else tip += '<tspan x="0" dy="1.2em">' + key + ': ' + value + '</tspan>';
                    i++;
                }

                return tip;
            }
            // ===========================================================================================

        });
    }
}