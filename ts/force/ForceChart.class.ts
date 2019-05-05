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
    link2: any;
    _links: Array<JoinLink>;
    constructor() {
        super();
        this.width = 0;
        this.height = 0;
        this._links = [];
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

        //draw lines for the links 
        this.link = this.g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.links_data)
            .enter()
            .append("line")
            .attr("stroke-width", 6)
            .style("stroke", this.linkColour);

        //draw lines for the links 
        this.link2 = this.g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.links_data)
            .enter()
            .append("line")
            .attr("stroke-width", 6)
            .style("stroke", this.linkColour2);

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
        // this.nodes_data = [
        //     { "name": "Lillian", "sex": "F","source": "Lillian", "target": "Lillian", "type": "A" },
        //     { "name": "Gordon", "sex": "M", "source": "Gordon", "target": "Lillian", "type": "A"},
        //     { "name": "America", "sex": "M", "source": "America", "target": "Lillian", "type": "A"}
        // ]
        this.nodes_data = [
            { "name": "Lillian", "sex": "F", "source": "Lillian", "target": "Lillian" , "type": "A",
                joints : [
                    {
                        "source": {"name" :"part2" ,"CenterMargin":{"x":10,"y":10}},
                        "target": {"name":"America.Lillian","CenterMargin":{"x":30,"y":30}},
                        "type": "A"
                    },
                    {
                        "source": {"name" :"part3" ,"CenterMargin":{"x":0,"y":0}},
                        "target": {"name":"America.Lillian","CenterMargin":{"x":40,"y":40}},
                        "type": "A"
                    }
                ]
            },
            { "name": "Gordon", "sex": "M", "source": "Gordon", "target": "America" , "type": "A",
                joints : [
                        {
                            "source": {"name" :"part2" ,"CenterMargin":{"x":30,"y":30}},
                            "target": {"name":"America.Lillian","CenterMargin":{"x":30,"y":30}},
                            "type": "A"
                        },
                        {
                            "source": {"name" :"part3" ,"CenterMargin":{"x":50,"y":50}},
                            "target": {"name":"America.Lillian","CenterMargin":{"x":40,"y":40}},
                            "type": "A"
                        }
                ]
            },
            { "name": "America", "sex": "M", "source": "America", "target": "Lillian" , "type": "A",
                joints : [
                    {
                        "source": {"name" :"part2" ,"CenterMargin":{"x":70,"y":30}},
                        "target": {"name":"America.Lillian","CenterMargin":{"x":30,"y":30}},
                        "type": "A"
                    },
                    {
                        "source": {"name" :"part3" ,"CenterMargin":{"x":60,"y":50}},
                        "target": {"name":"America.Lillian","CenterMargin":{"x":30,"y":40}},
                        "type": "A"
                    }
                ]
            }
        ]
        // nodes_data = hybroChart.bundleChart.leaves;
        //Sample links data 
        //type: A for Ally, E for Enemy
        this.links_data = [
            { "source": "America", "sourcePoint" : {"x":0,"y":0}, "target": "Gordon", "targetPont" : {"x":0,"y":0}, "type": "A" },
            { "source": "Gordon", "sourcePoint" : {"x":0,"y":0}, "target": "America", "targetPont" : {"x":0,"y":0}, "type": "A" },
            { "source": "Lillian", "sourcePoint" : {"x":0,"y":0}, "target": "Lillian", "targetPont" : {"x":0,"y":0}, "type": "A" },
            { "source": "Lillian", "sourcePoint" : {"x":0,"y":0}, "target": "Gordon", "targetPont" : {"x":0,"y":0}, "type": "E" },
            { "source": "Lillian", "sourcePoint" : {"x":70,"y":100}, "target": "Gordon", "targetPont" : {"x":-50,"y":105}, "type": "A" },
            { "source": "Lillian", "sourcePoint" : {"x":70,"y":-100}, "target": "Gordon", "targetPont" : {"x":-50,"y":105}, "type": "A" },
            { "source": "Lillian", "sourcePoint" : {"x":50,"y":200}, "target": "Gordon", "targetPont" : {"x":-150,"y":15}, "type": "A" }
        ]
        // this.links_data = this.nodes_data;
        // this.links = this.links_data;
    }
    get links() : Array<JoinLink> {
        return this._links;
    }
    set links(links_data){
        for(let joint of links_data){
            let joinLine = new JoinLink(joint.joints);
            joinLine.setParent(this);
            this._links.push(joinLine);
        }
    }
    tickActions() {
        let positionData= null;
        this.nodeCells.attr("transform", function (d:any) {
            positionData = d;
            return "translate("+d.x+","+d.y+")"; 
        })

        //update link positions 
        this.link
            .attr("x1", function (d:any) { 
                return d.source.x+d.sourcePoint.x; 
            }).attr("y1", function (d:any) { 
                return d.source.y+d.sourcePoint.y;
            })
            .attr("x2", function (d:any) {
                return d.target.x+d.targetPont.x; 
            })
            .attr("y2", function (d:any) { 
                return d.target.y+d.targetPont.y; 
            })
            // console.log(positionData.source.name,positionData.target.name);
            for(let link of this.links) {
                // all the lines are added before but now its time to find the source and 
                if(link.mainSource == positionData.source && link.mainTarget == positionData.target)
                    link.update(positionData);
            }


    }

}