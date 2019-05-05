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
        this.initData();
    }
    getParent()  : HybroChart {
        return super.getParent();
    }
    draw(rootData:any) {
        if(!this.enable)
        return false;

        this.svg = this.getParent().voronoiChart.svg;
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
            .force('collision', d3.forceCollide().
            radius(function(d) {
                return 210
              }))
            .force("links", link_force);
        //add tick instructions: 
        let self = this;
        this.simulation.on("tick", function(){
            self.tickActions()}
            );

        this.g = this.getParent().voronoiChart.drawingArea
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
            .style('stroke', '#36fffdcf')
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
    initNode(){
        this.node = d3.selectAll(".drawingArea .treemap-container");
        this.node.data(this.nodes_data);
    }
    initNodeCells(){
        // this.nodeCells = this.getParent().svg.selectAll(".drawingArea .hoverers path");
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
        if (d.type == "A") {
            return "#a1dd00";
        } else {
            return "red";
        }
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

    // //Zoom functions 
    zoom_actions() {
        this.g.attr("transform", d3.event.transform)
    }

   
    initData(){
        this.nodes_data = [
            { "name": "Lillian", "sex": "F", "source": "Lillian", "target": "Lillian" , "type": "A"},
            { "name": "Gordon", "sex": "M", "source": "Gordon", "target": "America" , "type": "A"},
            { "name": "America", "sex": "M", "source": "America", "target": "Lillian" , "type": "A"}
        ]
        //type: A for Ally, E for Enemy
        this.links_data = [
            { "source": "America", "sourcePoint" : {"x":0,"y":0}, "target": "Gordon", "targetPoint" : {"x":0,"y":0}, "type": "A" },
            { "source": "Gordon", "sourcePoint" : {"x":0,"y":0}, "target": "America", "targetPoint" : {"x":0,"y":0}, "type": "A" },
            { "source": "Lillian", "sourcePoint" : {"x":0,"y":0}, "target": "Lillian", "targetPoint" : {"x":0,"y":0}, "type": "A" },
            { "source": "Lillian", "sourcePoint" : {"x":0,"y":0}, "target": "Gordon", "targetPoint" : {"x":0,"y":0}, "type": "E" },
            { "source": "Lillian", "sourcePoint" : {"x":70,"y":10}, "target": "Gordon", "targetPoint" : {"x":30,"y":10}, "type": "A" },
            { "source": "Lillian", "sourcePoint" : {"x":70,"y":50}, "target": "America", "targetPoint" : {"x":0,"y":10}, "type": "A" },
            { "source": "Lillian", "sourcePoint" : {"x":50,"y":30}, "target": "America", "targetPoint" : {"x":10,"y":15}, "type": "A" }
        ]
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