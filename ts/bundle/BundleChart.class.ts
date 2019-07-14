
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
    curveBundle : number = 0.1;
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
        .attr("bdata",function(d){
            console.log("path data",d   );
        })
        .attr("transform","translate("+this.transLeft+","+this.transTop+")")
        .each(function(d: any) { 
           
            d.source = d[0], d.target = d[d.length - 1]; 

            if(d.source.data.ilinkElements == undefined) {
                d.source.data.ilinkElements = [];
            }
            d.source.data.ilinkElements.push(d3.select(this));
            if(d.target.data.ilinkElements == undefined) {
                d.target.data.ilinkElements = [];
            }
            d.target.data.ilinkElements.push(d3.select(this));

        })
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
        d3.selectAll(".link").each(
            function(d:any,i){  
                d3.select(this).style("stroke",self.getColor());
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
        this.colors.unshift(color);
        return color.value;
    }
   

    lineFunction(){
        let self = this;
        // this.line = d3.line().curve(d3.curveBundle.beta(0.25)).x(
        this.line = d3.line().curve(d3.curveBundle.beta(this.curveBundle)).x(
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