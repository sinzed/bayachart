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
    draw(rootData:any) {
        if(!this.enable)
        return false;
        this.initData();
        this.svg = this.getParent().svg;
        this.width = +this.svg.attr("width");
        this.height = +this.svg.attr("height");

        //set up the simulation and add forces  
        this.simulation = d3.forceSimulation()
            .nodes(this.nodes_data);
        let link_force = d3.forceLink(this.links_data)
            .id(function (d:any) { 
                return d.name;
             });
             
        let charge_force = d3.forceManyBody().strength(200);
        let center_force = d3.forceCenter(this.width / 2, this.height / 4);
        // let force_colide = d3.forceCollide();
        this.simulation
            .force("charge_force", charge_force)
            .force("center_force", center_force)
            .force('collision', d3.forceCollide()
            .radius(this.radius))
            .force("links", link_force);
        //add tick instructions: 
        let self = this;
        this.simulation.on("tick", function(){
            self.tickActions()}
            );

        this.g = this.getParent().layout.graphic.append("g")
            .classed("class", "everything");

        

        // //draw lines for the links 
        // this.link = this.g.append("g")
        //     .attr("class", "links")
        //     .selectAll("line")
        //     .data(this.links_data)
        //     .enter()
        //     .append("line")
        //     .attr("stroke-width", 6)
        //     .style("stroke", this.linkColour);
        //draw lines for the links 
        this.link =  this.g.append("g")
            .attr("class", "links")
            .selectAll("path")
            .data(this.links_data)
            .enter().append("svg:path")
            .attr("stroke-width", function(d) { return 1 });
      
        this.link.style('fill', 'none')
            // .style('stroke', '#36fffdcf')
            .style('stroke', this.linkColour)
            .style("stroke-width", '4px');

  
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

    }
    radius(){
        return 210;
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
        this.nodes_data = [
            { "name": "controllers"},
            { "name": "hybrograph"},
            { "name": "providers"}
        ];
        this.nodes_data = this.getParent().nodesData;
        //type: A for Ally, E for Enemy
        this.buildLinkData();
        console.log(this.links_data);
        // this.links_data = [
        //     { "source": "controllers", "sourcePoint" : {"x":0,"y":0}, "target": "hybrograph", "targetPoint" : {"x":0,"y":0}, "type": "A" },
        //     { "source": "controllers", "sourcePoint" : {"x":0,"y":0}, "target": "hybrograph", "targetPoint" : {"x":0,"y":0}, "type": "A" },
        //     // { "source": "Lillian", "sourcePoint" : {"x":0,"y":0}, "target": "Lillian", "targetPoint" : {"x":0,"y":0}, "type": "A" },
        //     // { "source": "Lillian", "sourcePoint" : {"x":0,"y":0}, "target": "Gordon", "targetPoint" : {"x":0,"y":0}, "type": "E" },
        //     // { "source": "Lillian", "sourcePoint" : {"x":70,"y":10}, "target": "Gordon", "targetPoint" : {"x":30,"y":10}, "type": "A" },
        //     // { "source": "Lillian", "sourcePoint" : {"x":70,"y":50}, "target": "America", "targetPoint" : {"x":0,"y":10}, "type": "A" },
        //     // { "source": "Lillian", "sourcePoint" : {"x":50,"y":30}, "target": "America", "targetPoint" : {"x":10,"y":15}, "type": "A" }
        // ]
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
                if(leaf.data.targets){
                    let link = {};
                    for(let target of leaf.data.targets){
                        let mainSource = this.findMainSource(leaf);
                        let sourceMargin = this.findSourceMargin(leaf);
                        let mainTarget = this.findMainTarget(target);
                        let targetMargin = this.findTargetMargin(mainTarget);
                        let mainTargetName = {"name": target.split(".")[0]};
                        this.addLink(mainSource,sourceMargin,mainTargetName,targetMargin);
                    }
                }
            }
            
        }
    }
    findMainSource(leaf : any){
        // let mainSource = null;
        while(leaf.parent != null){
            leaf = leaf.parent;            
        }
        return leaf;
    }
    findMainTarget(target :any){
        for(let hybridChart of this.getParent().hybroCharts){
            if(hybridChart.voronoiChart.hierarchy == undefined)
                continue;
            if(hybridChart.voronoiChart.hierarchy.data.name == target.split(".")[0] )
            return this.followToFindleaf(hybridChart.voronoiChart.hierarchy, target)
        }
    }
    followToFindleaf(hierarchy : any, target: string) :any {
        let part1 = target.split(".")[0];
        let part2 = target.split(".")[1];
        if(part2 == undefined)
            return hierarchy;

        let foundLeaf = null;
        for(let leaf of hierarchy.children) {
            if(leaf.data.name == part2)
                foundLeaf = leaf;
        }
        if(foundLeaf)
            return this.followToFindleaf(foundLeaf, part2);
    }
    
    findSourceMargin(leaf){
        if(leaf.polygon.site == undefined)
            return {"x":0,"y":0};
        let x = leaf.polygon.site.x;
        let y = leaf.polygon.site.y;
        return {"x":x-200,"y":y+100};
    }
    findTargetMargin(leaf){
        if(leaf.polygon == undefined)
            return {"x":0,"y":0};
        let x = leaf.polygon.site.x;
        let y = leaf.polygon.site.y;
        return {"x":x-200,"y":y+100};
    }
    addLink(mainSource: any, sourceMargin: any, mainTarget: any, targetMargin: any) {
        this.links_data.push({"source":mainSource.data.name,"sourcePoint":sourceMargin,"target":mainTarget.name,"targetPoint":targetMargin});
    }
 
    tickActions() {
        this.nodeCells.attr("transform", function (d:any) {
            return "translate("+d.x+","+d.y+")"; 
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

            this.link.attr("d", function(d) {
                var dx = d.target.x - d.targetPoint.x + - d.source.x + d.sourcePoint.x ,
                    dy = d.target.y - d.targetPoint.y - d.source.y + d.sourcePoint.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
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