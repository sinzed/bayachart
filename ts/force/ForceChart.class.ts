class ForceChart extends Chart {
    link: any;
    node: any;
    svg: any;
    width: number;
    height: number;
    simulation: any;
    g: any;
    links_data: any;
    nodes_data: any;
    nodeCells: any;
    constructor() {
        super();
        this.width = 0;
        this.height = 0;
        // this.initData();
    }
    getParent()  : BayaChart {
        return super.getParent();
    }
    run(){
                     
        let link_force = d3.forceLink(this.links_data)
        .id(function (d:any) { 
            return d.name;
         });
        let charge_force = d3.forceManyBody().strength(0.1);
        // let center_force = d3.forceCenter(this.width / 3, this.height / 5);
        let center_force = d3.forceCenter(0, 0);
       
        this.simulation
        .force("charge_force", charge_force)
        .force("center_force", center_force)
        // .force("colide", d3.forceCollide( function(d){return d.radius + 8 }).iterations(16) )
        .force("forceX", d3.forceX().strength(0))
        .force("forceY", d3.forceY().strength(0))
        .force("links", link_force);
    }
    unlink(){
        this.simulation
        .force("charge_force", null)
        .force("center_force", null)
        .force("forceX", null)
        .force("forceY", null)
        .force("links", null);
    }
    destroy(){
        this.unlink();
        // return true;
        // let link_force = d3.forceLink([])
        // .id(function (d:any) { 
        //     return d.name;
        //  });
        //  this.simulation = d3.forceSimulation()
        //  .nodes([]);
        //  this.simulation
        //  .force("forceX", d3.forceX().strength(0.01))
        //  .force("forceY", d3.forceY().strength(0.01))
        //  .force("links", []);
        // this.simulation
        // .force("charge_force", charge_force)
        // .force("center_force", center_force)
        // .force("forceX", d3.forceX().strength(0.01))
        // .force("forceY", d3.forceY().strength(0.01))
        // .force("links", link_force);
    }
    draw(rootData:any) {
        if(!this.enable)
        return false;
        this.initData();
        this.svg = this.getParent().svg;
        this.width = +this.svg.attr("width");
        this.height = +this.svg.attr("height");

        let charge_force = d3.forceManyBody().strength(0.1);
        let center_force = d3.forceCenter(this.width / 3, this.height / 5);
       


        //set up the simulation and add forces  
        this.simulation = d3.forceSimulation()
            .nodes(this.nodes_data);

            this.simulation
            .force("charge_force", charge_force)
            .force("center_force", center_force)
            // .force("forceX", d3.forceX().strength(0.05))
            // .force("forceY", d3.forceY().strength(0.05));
        let link_force = d3.forceLink(this.links_data)
        .id(function (d:any) { 
            return d.name;
            });
        // let force_colide = d3.forceCollide();
        this.simulation
            // .force("charge_force", charge_force)
            // .force("center_force", center_force)
        .force('collision', d3.forceCollide().radius(function(d) {
            return d.radius;
          }))
        // .radius(this.radius))
        .force("links", link_force);
        //add tick instructions: 
        let self = this;
        this.simulation.on("tick", function(){
            
            // for (let i = 0; i < 500; i++) {
                //         self.tickActions()
                //   }
                self.tickActions()
            }
        );
            
        this.g = this.getParent().layout.graphic.append("g")
        .classed("class", "everything");
        
        //draw lines for the links 
        this.link =  this.g.append("g")
        .attr("class", "links")
        .selectAll("path")
        .data(this.links_data)
        .enter()
        
        .append("svg:path")
        .attr("customdata",function(d:any){
            // give the reference of the elinks to data
            // in order to activate it by interactions like hover
            if(d.ref.data.elinkElements == undefined){
                d.ref.data.elinkElements = [];
            }
            d.ref.data.elinkElements.push(d3.select(this));

            if(d.targetRef.data == undefined)
            return true;
            if(d.targetRef.data.elinkElements == undefined){
                d.targetRef.data.elinkElements = [];
            }
            d.targetRef.data.elinkElements.push(d3.select(this));
        })
        // .style("filter","url(#dropshadow)")
        .attr("stroke-width", function(d:any) { return 1 });
        
        this.link.style('fill', 'none')
        // .style('stroke', '#36fffdcf')
        .style('stroke', this.linkColour)
        .style("stroke-width", '4px');
        this.link.append("title").text(function(d){
            return "elink \n from: "+d.ref.data.name+ " \nto: "+d.targetRef.data.name;
        });
        this.link.on("mouseover", function(d){
            if(!self.getParent().layout.layoutOption.canShowInteractiveActions)
                return true;
            d.ref.element.style("display","none");
            d.targetRef.element.style("display","none");
            d3.select(this).style("opacity","1");
        })
        .on("mouseout", function(d){
            // just work if the interactive button is on
            if(!self.getParent().layout.layoutOption.canShowInteractiveActions)
                return true;
                d.ref.element.style("display","block");
                d.targetRef.element.style("display","block");
            // should not work if it is selected as showLink by click
            if(d.ref.showLink || d.targetRef.showLink)
                return true;
            d3.select(this).style("opacity","0.3");
        })
        
        //draw circles for the nodes 
        // this.initNode1();
        this.initNodeCells();
        
        var drag_handler = d3.drag()
        .on("start", function(d){
            
            self.drag_start(d)
            
        })
        .on("drag", function(d){self.drag_drag(d)})
        .on("end", function(d){self.drag_end(d)});
        
        // drag_handler(this.node);
        drag_handler(this.nodeCells);
        
        this.unlink();
    }
    radius(d){
        const world = d3.select(d);
        const radius = world.attr("treemapradius");
        return radius;
    }
    initNode(){
        this.node = d3.selectAll(".drawingArea .treemap-container");
        this.node.data(this.nodes_data);
    }
    initNodeCells(){
        this.nodeCells = this.getParent().svg.selectAll(".drawingArea .treemap-container");
        this.nodeCells.data(this.nodes_data);

    }
    circleColour(d:any) {
        if (d.sex == "M") {
            return "blue";
        } else {
            return "pink";
        }
    }

    linkColour(d:any) {
        return '#'+(Math.random()*0xFFFFFF<<0).toString(16); 
        
    }
    linkColour2(d:any) {
        return "yellow";
    }

    drag_start(d:any) {

        if (!d3.event.active) this.simulation.alphaTarget(0.9).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    //make sure you can't drag the circle outside the box
    drag_drag(d:any) {
        
        d.fx = d3.event.x ;
        d.fy = d3.event.y;
    }

    drag_end(d:any) {
        if (!d3.event.active) this.simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
    }
   
    initData(){

        this.nodes_data = this.getParent().nodesData;
        //type: A for Ally, E for Enemy
        this.buildLinkData();
    }
    buildLeavesWithParentName(){
        // this.h
    }
    buildLinkData(){
        this.links_data = [];
        for(let hybroChart of this.getParent().hybroCharts){
            if(hybroChart.bundleChart == undefined || hybroChart.bundleChart.leaves == undefined )
                continue;
            for(let leaf of hybroChart.bundleChart.leaves){
                if(leaf && leaf.data.dependencies && !leaf.data.elinks){
                    leaf.data.elinks = leaf.data.dependencies;
                }
                if(leaf.data.elinks && leaf.data.elinks.length > 0){
                    let link = {};
                    for(let target of leaf.data.elinks){
                        let mainSource = this.findMainSource(leaf);
                        let sourceMargin = this.findSourceMargin(leaf,mainSource);
                        let mainTarget = this.findMainTarget(target);
                        if(!mainTarget)
                            continue;
                        let targetMargin = this.findTargetMargin(mainTarget);
                        // let mainTargetName = {"name": target.split("/")[0]};
                        // this.addLink(mainSource,sourceMargin,mainTargetName,targetMargin, leaf);
                        this.addLink(mainSource,sourceMargin,target,targetMargin, leaf,mainTarget);
                    }
                }
            }
            
        }
        this.links_data;
    }
    findMainSource(leaf : any){
        // let mainSource = null;
        while(leaf.parent != null){
            leaf = leaf.parent;            
        }
        return leaf;
    }
    /*
        find the root of target
    */
    findMainTarget(target :any){
        
        for(let hybridChart of this.getParent().hybroCharts){
            if(hybridChart.voronoiChart.hierarchy == undefined)
                continue;
            if(hybridChart.voronoiChart.hierarchy.data.name == target.split("/")[0] )
                return this.followToFindleaf(hybridChart.voronoiChart.hierarchy, target)
        }
    }
    followToFindleaf(hierarchy : any, target: string) :any {
        let part1 = target.split("/")[0];
        let part2 = target.split("/")[1];

        let nextPath = target.substring(target.indexOf('/')+1);
        if(part2 == undefined)
            return hierarchy;

        let foundLeaf = null;
        for(let leaf of hierarchy.children) {
            if(leaf.data.name == part2)
                foundLeaf = leaf;
        }
        if(foundLeaf)
            return this.followToFindleaf(foundLeaf, nextPath);
    }
    
    findSourceMargin(leaf : any,mainSource:any){
        if(leaf.polygon.site == undefined)
            return {"x":0,"y":0};
            mainSource;
        let hybroLeft = this.getParent().hybroCharts[0].voronoiChart.margin.left - mainSource.data.radius;
        let hybroTop = this.getParent().hybroCharts[0].voronoiChart.margin.top - mainSource.data.radius;
        let x = leaf.polygon.site.x+ hybroLeft ;
        let y = leaf.polygon.site.y+ hybroTop ;
        // let x = leaf.polygon.site.x + this.getParent().hybroCharts[0].voronoiChart.margin.left - 100;
        // let y = leaf.polygon.site.y + this.getParent().hybroCharts[0].voronoiChart.margin.top - 100 ;
        return {"x":x,"y":y};
    }
    findTargetMargin(leaf : any){
        if(leaf.polygon == undefined)
            return {"x":0,"y":0};
        let mainSourceOfTarget = this.findMainSource(leaf);
        let x = leaf.polygon.site.x + this.getParent().hybroCharts[0].voronoiChart.margin.left - mainSourceOfTarget.data.radius;
        let y = leaf.polygon.site.y + this.getParent().hybroCharts[0].voronoiChart.margin.top  - mainSourceOfTarget.data.radius ;
        return {"x":x,"y":y};
    }
    // addLink(mainSource: any, sourceMargin: any, mainTarget: any, targetMargin: any, leaf: any) {
    addLink(mainSource: any, sourceMargin: any, target: any, targetMargin: any, leaf: any,targetLeaf:any) {
        let mainTarget = {"name": target.split("/")[0]};
        this.links_data.push(
            {"source":mainSource.data.name,
            "sourcePoint":sourceMargin,
            "target":mainTarget.name,
            "targetRef":targetLeaf,
            "targetPoint":targetMargin,
            "ref":leaf});
    }
 
    tickActions() {
        this.nodeCells.attr("transform", function (d:any) {

            // if(d.x == undefined || d.y == undefined ){
                
            //     //  return "translate("+Math.random()*3100+","+Math.random()*3100+")"; 
            // }
            // else {

                return "translate("+d.x+","+d.y+")"; 
            // }
        })

        //update link positions 
        // this.link
        //     .attr("x1", function (d:any) { 
        //         return d.source.x+d.sourcePoint.x; 
        //     }).attr("y1", function (d:any) { 
        //         return d.source.y+d.sourcePoint.y;
        //     })
        //     .attr("x2", function (d:any) {
        //         return d.target.x+d.targetPoint.x; 
        //     })
        //     .attr("y2", function (d:any) { 
        //         return d.target.y+d.targetPoint.y; 
        //     })

            this.link.attr("d", function(d:any) {
                var dx = d.target.x - d.targetPoint.x + - d.source.x + d.sourcePoint.x ,
                    dy = d.target.y - d.targetPoint.y - d.source.y + d.sourcePoint.y,
                    dr = Math.sqrt(0);
                    // dr = Math.sqrt(dx * dx + dy * dy);
                    let prop = "M" + 
                    (d.source.x + d.sourcePoint.x) + "," + 
                    (d.source.y + d.sourcePoint.y) + "A" + 
                    dr + "," + dr + " 0 0,1 " + 
                    (d.target.x + d.targetPoint.x) + "," + 
                    (d.target.y + d.targetPoint.y);
                    return prop;
            });



    }

}