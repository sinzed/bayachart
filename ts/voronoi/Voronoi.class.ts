// import * as d3 from 'd3' ;

class Voronoi extends Chart {
    _2PI = 2*Math.PI;
    //end: constants
    
    //begin: layout conf.
    svgWidth = 980;
    svgAreaHeight = 700;
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
    backgroundColor: string = "whitesmoke";
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
    cells: Array<any>;
    leaves: any;
    _canShowHoverer: boolean = true;
    constructor(){
    //begin: constants
        super();
        this.margin = {top: 600, right: 300, bottom: 10, left: 600};
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
        this.cells = [];
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
    // this.svg = d3.select("svg")
    this.svg = this.getParent().svg
    .attr("width", this.svgWidth)
    .style("background-color",this.backgroundColor)
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
        .text("The graph of bad smells codes")
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
            .style("fill", function(d: { color: any; }){ 
                return d.color; 
            });
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
        this.leaves=this.hierarchy.leaves();
        
        let self = this;
        
        let appended = this.treemapContainer.append("g");
       
        let classed = appended.classed('cells', true);
        let attributed = classed.attr("transform", "translate("+[-this.treemapRadius,-this.treemapRadius]+")");
        let selectedAll =    classed.selectAll(".cell");
        let datalized = selectedAll.data(this.leaves);
        let entered = datalized.enter();
        let appendedPath = entered.append("path")
        .on("mouseover", function(){
            // d3.select(this).style("display","none");
            let element  = d3.select(this);

            // let translate = element.attr("trans")
            // element.attr("transform","scale(1.3) translate(-30,-39)");
            element.style("stroke-width","3px");
            element.style("stroke","white");
            element.style("stroke-dasharray","0");

        })
        .on("mouseout", function(){
            // d3.select(this).style("display","block");
            let element  = d3.select(this);
            element.style("stroke-width","0px");
            element.style("stroke","black");
            element.style("stroke-dasharray","9");;
        })
        .on("click", function(){
            // d3.select(this).style("filter","url(#dropshadow)");
            let element  = d3.select(this);
            // let translate = element.attr("trans")
            // element.attr("transform","scale(1.3) translate(-30,-39)");
        })
        .on("mousedown", function(){
            // d3.select(this).style("filter","url(#dropshadow)");
            let element  = d3.select(this);
            
            // let translate = element.attr("trans")
            // element.attr("transform","scale(1.3) translate(-30,-39)");
        });
      //   var classedcell = appendedPath.classed("cell", true);
        let attrd = appendedPath.attr("d", function(d: { polygon: { join: (arg0: string) => string; }; }){ return "M"+d.polygon.join(",")+"z"; });
        let cells  = attrd.style("fill", 
            function(d: { parent: { data: { color: any; }; }; }){
                    return d.parent.data.color;
            }
        );
        
        let labels = this.treemapContainer.append("g")
            .classed('labels', true)
            .attr("transform", "translate("+[-this.treemapRadius,-this.treemapRadius]+")")
            .selectAll(".label")
            .data(this.leaves)
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
        this.drawParents();
        if(this.canShowHoverer()){
            this.drawHoverers();
        }
        // else {
        // }
      }
    canShowHoverer() {
        return this._canShowHoverer;
        // throw new Error("Method not implemented.");
    }
    drawHoverers(){ 
        let hoverers = this.treemapContainer.append("g")
        .classed('hoverers', true)
        .attr("transform", "translate("+[-this.treemapRadius,-this.treemapRadius]+")")
        .selectAll(".hoverer")
        .data(this.leaves)
        .enter()
        .append("path")
        .classed("hoverer", true)
        .attr("d", function(d: { polygon: { join: (arg0: string) => string; }; }){ return "M"+d.polygon.join(",")+"z"; });
        hoverers.append("title")
        .text(function(d: { data: { name: string; }; value: string; }) { return d.data.name + "\n" + d.value+"%"; });
    }
    showTreeMapBorders(enable:boolean){
            d3.selectAll(".parents").style("display",enable?"block":"none");
    }
    drawParents(){ 
        // return false;
        let self = this;
        // let parentData = this.hierarchy.descendants();
        let parentData = this.hierarchy.descendants().filter(function (leaf) {
            if(leaf.children)
                return leaf;
        });

        let parents = this.treemapContainer.append("g")
        .classed('parents', true)
        .attr("transform", "translate("+[-this.treemapRadius,-this.treemapRadius]+")")
        .selectAll(".parents")
        .data(parentData)
        .enter()
        .append("path")
        .style("fill",function(d){
            if(d.parent && d.parent.color)
                return d.parent.color
            else
                return "transparent";
        })
        .style("opacity",1)
        .style("stroke-width",function(d){
            return self.getWidthByDepth(d);
        })
        .style("stroke",function(d){
            return self.getColorByDepth(d);
        })
        // .on("mouseover", function(){
        //     let element  = d3.select(this);
        //     element.style("stroke-width","3px");
        //     element.style("stroke","white");

        // })
        // .on("mouseout", function(d){
        //     let element  = d3.select(this);
        //     element.style("stroke-width",self.getWidthByDepth(d));
        //     element.style("stroke",self.getColorByDepth(d));
        // })
        // .attr("transform","scale(0.99) translate(5,5)")
        .classed("parents", true)
        .attr("d", function(d: { polygon: { join: (arg0: string) => string; }; }){ return "M"+d.polygon.join(",")+"z"; });
        parents.append("title")
        .text(function(d: { data: { name: string; }; value: string; }) { return d.data.name + "\n" + d.value+"%"; });
    }
    getColorByDepth(leaf:any){
        let parent : HybroChart = this.getParent();
        let depth = 0;
        while(leaf.parent != null){
            leaf = leaf.parent;      
            depth++;
        }
        let color = new Color(320/(depth%3),100,30,1);
        return color.value;
    }
    getWidthByDepth(leaf:any){
        let parent : HybroChart = this.getParent();
        let max = 10;
        let depth = 0;
        while(leaf.parent != null){
            leaf = leaf.parent;      
            depth+=2;
        }
        return max-depth+"px";
    }
    buildColors(rootData : any,parentColor?:Color){
        let colors : Array<Color> =[];
        // colors.push("hsla(120,100%,0%,1)");
        for(let i = 0;i<rootData.children.length;i++){
            let color :Color;
            if(!parentColor)
                 color = new Color((360/rootData.children.length)*i,100,45);
            else
              color= new Color(parentColor.h,parentColor.s-Math.random()*60,parentColor.l+10);
            
            colors.push(color);
        }
        for ( let leaf of rootData.children){
            let color  : any = colors.pop();
            leaf.color = color.value;
            if(leaf.children){
                this.buildColors(leaf,color);
            }
        }

        return rootData;
    }
      draw(rootData:any){
          let rootDataColorized = this.buildColors(rootData);
          this.initData(rootData);
          this.drawTreemap();
      }
}