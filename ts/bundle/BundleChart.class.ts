
class BundleChart extends Chart {
    svg: any;
    linkElement: any;
    nodeElement: any;
    leaves: any;
    line: any;
    transTop : number;
    transLeft : number;
    element: any;
    colors: Array<Color>;
    constructor(){
        super();
        this.init();
        this.transTop = 203;
        this.transLeft = 273;
        this.colors = [];
    }
    init(){
        this.lineFunction();
    }
    getParnet() : HybroChart{
        return super.getParent();
    }
    draw(rootData:any){
        this.element = this.getParent().voronoiChart.drawingArea.select(".treemap-container")
        .insert('g', '#first + *');
        let treemapRadius = this.getParent().voronoiChart.treemapRadius;
        let xTranslae =-273 - treemapRadius;
        let yTranslate = -205 - treemapRadius;
        this.linkElement = this.element.append("g").attr("id","bundleElements").attr("transform","translate("+xTranslae+","+yTranslate+")").selectAll(".link");
        this.nodeElement = this.element.append("g").attr("id","bundleNodes").selectAll(".node");
        if(!rootData.children){
            return true;
        }
        var root =  this.getParent().tools.packageHierarchy(rootData.children)
        .sum(function(d: any) { return d.size; });
        let self = this;

        cluster(root);
        // cluster(rootDeb);
        this.leaves = this.getParent().voronoiChart.hierarchy.descendants();
        this.buildColors();

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
        .style("stroke", this.getColor())
        // .style("stroke", 
        //      this.getColor(); 
        // )
        .style('color', 'darkOrange')
        // let self = this;
        d3.selectAll(".link").each(function(d,i){
            console.log(d);
            d3.select(this).style("stroke",self.getColor());
            // d3.select(this).append("circle").attr("cx",d.source.polygon.site.x).attr("cy",d.source.polygon.site.y).attr("r","20px");

            // d.style("stroke","red");
            //
        })
        .on("mouseover", function(){
            alert("fde");
        })
        .on("mouseout", function(){
            alert("wirklich");
        })

        // this.linkElement.style("stroke", self.getColor());
        
        // this.drawNodeNames();
    }
    buildColors(){
        this.colors = [];
        for(let i=0; i<this.leaves.length;i++){
            let color =  new Color((360/(i%7)),100,20);
            this.colors.push(color);
        }
    }
    getColor(){
        let color : any= this.colors.pop();
        return color.value;
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
                let x = d.polygon[0][0];
                x =   self.getParent().tools.compute2DPolygonCentroid(d.polygon);
                
                // if(d.data && d.data.name == "Netherlands"){
                //     x =   self.getParent().tools.compute2DPolygonCentroidDebug(d.polygon);
                // }
                return x.x ;
            })
            .y(function(d: any) {
                let y =  d.polygon[0][1];     
                y =  self.getParent().tools.compute2DPolygonCentroid(d.polygon);
                return y.y;
                }    
            )
        }
    }