// import * as d3 from 'd3' ;

class Voronoi extends Chart {
    _2PI = 2*Math.PI;
    //end: constants
    
    //begin: layout conf.
    svgWidth = 980;
    svgAreaHeight = 1500;
    svgHeight = 820;
    margin : any;
    height : any;
    width : any;
    halfWidth : any;
    halfHeight: number;
    quarterWidth: number;
    quarterHeight: number;
    titleY: number;
    legendsMinY: number;
    treemapRadius: number;
    treemapCenter: any[];
    //end: layout conf.

//begin: treemap conf.
    _voronoiTreemap: any;
    hierarchy : any;
    circlingPolygon: any;
    //end: treemap conf.
    
    //begin: drawing conf.
     fontScale: any;
    //end: drawing conf.
    
    //begin: reusable d3Selection
    svg: any;
    drawingArea: any;
    treemapContainer: any;
    canDrawLegends: boolean = false;
    canDrawTitle: boolean = false;
    canDrawFooter: boolean = false;
    constructor(){
    //begin: constants
        super();
        this.margin = {top: 10, right: 10, bottom: 10, left: 10};
        this.height = this.svgHeight - this.margin.top - this.margin.bottom;
        this.width = this.svgWidth - this.margin.left - this.margin.right;
        this.halfWidth = this.width/2;
        this.halfHeight = this.height/2;
        this.quarterWidth = this.width/4;
        this.quarterHeight = this.height/4;
        this.titleY = 20;
        this.legendsMinY = this.height - 20;
        this.treemapRadius = 205;
        this.treemapCenter = [this.halfWidth, this.halfHeight+5];
        this._voronoiTreemap = d3.voronoiTreemap();
        this.fontScale = d3.scaleLinear();
    //end: reusable d3Selection
    }
    initData(rootData:any) {
        this.circlingPolygon = this.computeCirclingPolygon(this.treemapRadius);
        this.fontScale.domain([3, 20]).range([8, 20]).clamp(true);
        this.initLayout(rootData);
    }
    setMarginLeft(marginLeft : number){
        this.margin.left = marginLeft;
    }

 computeCirclingPolygon(radius: number) {
  var points = 60,
      increment = this._2PI/points,
      circlingPolygon = [];
  
  for (var a=0, i=0; i<points; i++, a+=increment) {
    circlingPolygon.push(
      [radius + radius*Math.cos(a), radius + radius*Math.sin(a)]
    )
  }
  
    return circlingPolygon;
};

 initLayout(rootData: any) {
    this.svg = d3.select("svg")
    .attr("width", this.svgWidth)
    .style("background-color","black")
    .attr("height", this.svgAreaHeight);
  
    this.drawingArea = this.svg.select(".layout").append("g")
      .classed("drawingArea", true)
      .attr("transform", "translate("+[this.margin.left,this.margin.top]+")");
  
      this.treemapContainer = this.drawingArea.append("g")
      .classed("treemap-container", true)
      .attr("transform", "translate("+this.treemapCenter+")");
  
      this.treemapContainer.append("path")
      .classed("world", true)
      .attr("fill","transparent")
      .attr("transform", "translate("+[-this.treemapRadius,-this.treemapRadius]+")")
      .attr("d", "M"+this.circlingPolygon.join(",")+"Z");
  
      this.drawTitle();
      this.drawFooter();
      this.drawLegends(rootData);

      this.hierarchy = d3.hierarchy(rootData).sum(function(d){ return d.weight; });
      this._voronoiTreemap.clip(this.circlingPolygon)(this.hierarchy);
}

     drawTitle() {
        if(!this.canDrawTitle)
            return true;
        this.drawingArea.append("text")
        .attr("id", "title")
        .attr("transform", "translate("+[this.halfWidth, this.titleY]+")")
        .attr("text-anchor", "middle")
        .text("The Global Economy by GDP (as of 01/2017)")
    }

     drawFooter() {
        if(!this.canDrawFooter)
            return true;
        this.drawingArea.append("text")
        .classed("tiny light", true)
        .attr("transform", "translate("+[0, this.height]+")")
        .attr("text-anchor", "start")
        .text("Remake of HowMuch.net's article 'The Global Economy by GDP'")
        this.drawingArea.append("text")
        .classed("tiny light", true)
        .attr("transform", "translate("+[this.halfWidth, this.height]+")")
        .attr("text-anchor", "middle")
        .text("by @_Kcnarf")
        this.drawingArea.append("text")
        .classed("tiny light", true)
        .attr("transform", "translate("+[this.width, this.height]+")")
        .attr("text-anchor", "end")
        .text("bl.ocks.org/Kcnarf/fa95aa7b076f537c00aed614c29bb568")
    }

    drawLegends(rootData: { children: { reverse: () => Array<any>; }; }) {
        if(!this.canDrawLegends)
            return true;
        var legendHeight = 13,
            interLegend = 4,
            colorWidth = legendHeight*6,
            continents = rootData.children.reverse();
        
        var legendContainer = this.drawingArea.append("g")
            .classed("legend", true)
            .attr("transform", "translate("+[0, this.legendsMinY]+")");
        
        var legends = legendContainer.selectAll(".legend")
            .data(continents)
            .enter();
        
        var legend = legends.append("g")
            .classed("legend", true)
            .attr("transform", function(d: any,i: number){
            return "translate("+[0, -i*(legendHeight+interLegend)]+")";
            })
            
        legend.append("rect")
            .classed("legend-color", true)
            .attr("y", -legendHeight)
            .attr("width", colorWidth)
            .attr("height", legendHeight)
            .style("fill", function(d: { color: any; }){ return d.color; });
        legend.append("text")
            .classed("tiny", true)
            .attr("transform", "translate("+[colorWidth+5, -2]+")")
            .text(function(d: { name: any; }){ return d.name; });
        
        legendContainer.append("text")
            .attr("transform", "translate("+[0, -continents.length*(legendHeight+interLegend)-5]+")")
            .text("Continents");
    }
    drawTreemap() {
        var leaves=this.hierarchy.leaves();
        
        let self = this;
        
        var appended = this.treemapContainer.append("g");
       
        var classed = appended.classed('cells', true);
        var attributed = classed.attr("transform", "translate("+[-this.treemapRadius,-this.treemapRadius]+")");
        var selectedAll =    classed.selectAll(".cell");
        var datalized = selectedAll.data(leaves);
        var entered = datalized.enter();
        var appendedPath = entered.append("path");
      //   var classedcell = appendedPath.classed("cell", true);
        var attrd = appendedPath.attr("d", function(d: { polygon: { join: (arg0: string) => string; }; }){ return "M"+d.polygon.join(",")+"z"; });
        var cells  = attrd.style("fill", function(d: { parent: { data: { color: any; }; }; }){
                return d.parent.data.color;
                  });
        
        var labels = this.treemapContainer.append("g")
            .classed('labels', true)
            .attr("transform", "translate("+[-this.treemapRadius,-this.treemapRadius]+")")
            .selectAll(".label")
            .data(leaves)
            .enter()
                .append("g")
                    .classed("label", true)
                    .attr("transform", function(d: { polygon: { site: { x: any; y: any; }; }; }){
                      return "translate("+[d.polygon.site.x, d.polygon.site.y]+")";
              })
                    .style("font-size", function(d : any){
                         return self.fontScale(d.data.weight); 
                        });
        
        labels.append("text")
            .classed("name", true)
            .html(function(d: { data: { weight: number; code: any; name: any; }; }){
              return (d.data.weight<1)? d.data.code : d.data.name;
            });
        labels.append("text")
            .classed("value", true)
            .text(function(d: { data: { weight: string; }; }){ return d.data.weight+"%"; });
        if(this.canShowHoverer()){

            var hoverers = this.treemapContainer.append("g")
            .classed('hoverers', true)
            .attr("transform", "translate("+[-this.treemapRadius,-this.treemapRadius]+")")
            .selectAll(".hoverer")
            .data(leaves)
            .enter()
            .append("path")
            .classed("hoverer", true)
            .attr("d", function(d: { polygon: { join: (arg0: string) => string; }; }){ return "M"+d.polygon.join(",")+"z"; });
            
            hoverers.append("title")
            .text(function(d: { data: { name: string; }; value: string; }) { return d.data.name + "\n" + d.value+"%"; });
        }
      }
    canShowHoverer() {
        return false;
        // throw new Error("Method not implemented.");
    }
      draw(rootData:any){
          this.initData(rootData);
          this.drawTreemap();
      }
}