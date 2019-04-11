
class BundleChart extends Chart {
    svg: any;
    linkElement: any;
    nodeElement: any;
    leaves: any;
    line: any;
    transTop : number;
    transLeft : number;
    constructor(){
        super();
        this.init();
        this.transTop = 203;
        this.transLeft = 273;
    }
    init(){
        this.lineFunction();
    }
    getParnet() : HybroChart{
        return super.getParent();
    }
    draw(rootData:any){
        this.svg = d3.select(".drawingArea")
        .attr("width", diameter)
        .attr("height", diameter)
        .insert('g', '#first + *');
        this.linkElement = this.svg.append("g").selectAll(".link");
        this.nodeElement = this.svg.append("g").attr("transform","translate(270,35)").selectAll(".node");

        
        var root =  this.getParent().tools.packageHierarchy(rootData.children)
        .sum(function(d: any) { return d.size; });

        cluster(root);
        // cluster(rootDeb);
        this.leaves = this.getParent().voronoiChart.hierarchy.descendants();
        // var leaves = root.descendants();
        var data =  this.getParent().tools.packageImports(this.leaves);
        let link = this.linkElement
        .data(data)
        .enter()
        .append("path")
        .attr("transform","translate("+this.transLeft+","+this.transTop+")")
        .each(function(d: any) { d.source = d[0], d.target = d[d.length - 1]; })
        .attr("class", "link")
        .attr("d", this.line)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray",4)
        .style("stroke", "#000000")
        .style('color', 'darkOrange')
        .on("mouseover", function(){
            alert("fde");
        })
        .on("mouseout", function(){
            alert("wirklich");
        })


        // this.drawNodeNames();
    }
    drawNodeNames(){
        let node = this.nodeElement
        .data(this.leaves)
        .enter()
        .append("text")
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
          // return "translate(0,0)"; 
          return "translate(" + x + "," +y+")"; 
          // return "rotate(" + (x- 90) + ")translate(" + (y + 8) + ",0)" + (x < 180 ? "" : "rotate(180)"); 
        
        })
        .attr("text-anchor", function(d:any ) { 
          var x = d.polygon[0][0];
          // var x = d.polygon.site.x;
          // var y = d.polygon.site.y;
          
          return x < 180 ? "start" : "end"; 
          // return "start"; 
        
        })
        .text(function(d:any) {
             return d.data.name;
             })
        // .on("mouseover", function(){
        //     alert("fde");
        // })
        // .on("mouseout", function(){
        //     alert("wirklich");
        // });
    }

    lineFunction(){
        let self = this;
        this.line = d3.line().curve(d3.curveBundle.beta(0.25)).x(
            function(d : any) {
                var x = d.polygon[0][0];
                x =   self.getParent().tools.compute2DPolygonCentroid(d.polygon);
                if(d.data && d.data.name == "Netherlands"){
                    x =   self.getParent().tools.compute2DPolygonCentroidDebug(d.polygon);
                }
                return x.x ;
            })
            .y(function(d: any) {
                var y =  d.polygon[0][1];     
                        y =  self.getParent().tools.compute2DPolygonCentroid(d.polygon);
                        return y.y;
                }    
            );
        }
    }