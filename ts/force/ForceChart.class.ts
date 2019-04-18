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
        //create somewhere to put the force directed graph
        // var svg = d3.select(".drawingArea"),
        //     width = +svg.attr("width"),
        //     height = +svg.attr("height");
        this.svg = this.getParent().voronoiChart.svg;
        this.width = +this.svg.attr("width");
        this.height = +this.svg.attr("height");

        var radius = 15;
     

        //set up the simulation and add forces  
        this.simulation = d3.forceSimulation()
            // .nodes(this.getParent().bundleChart.leaves);
            .nodes(this.nodes_data);

        var link_force = d3.forceLink(this.links_data)
        // var link_force = d3.forceLink(this.getParent().bundleChart.leaves)
            .id(function (d:any) { 
                return d.name;
             });

        var charge_force = d3.forceManyBody()
            .strength(-100);

        var center_force = d3.forceCenter(this.width / 2, this.height / 4);

        this.simulation
            .force("charge_force", charge_force)
            .force("center_force", center_force)
            .force("links", link_force)
            ;


        //add tick instructions: 
        let self = this;
        this.simulation.on("tick", function(){
            self.tickActions()}
            );

        //add encompassing group for the zoom 
        // this.g = this.svg.append("g")
        //     .attr("class", "everything");
        //add encompassing group for the zoom 
        this.g = this.getParent().voronoiChart.drawingArea
            .classed("class", "everything");

        //draw lines for the links 
        this.link = this.g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.links_data)
            // .data(this.getParent().bundleChart.leaves)
            .enter()
            .append("line")
            .attr("stroke-width", 3)
            .style("stroke", this.linkColour);

        //draw circles for the nodes 
        // let nodes = this.getParent().voronoiChart.treemapContainer.selectAll("path")
    
        this.node = this.g
            .append("g")
            .attr("class", "nodes")
            // .selectAll("circle")
        // this.node = this.getParent().voronoiChart.treemapContainer
            // .append("g")
            .selectAll("circle")
            .data(this.nodes_data)
            // .data(this.getParent().bundleChart.leaves)
            .enter()
            .append("circle")
            .attr("r", radius)
            // .attr("fill", this.circleColour);


        //add drag capabilities  
        var drag_handler = d3.drag()
            .on("start", function(d){
                
                self.drag_start(d)
            
            })
            .on("drag", function(d){self.drag_drag(d)})
            .on("end", function(d){self.drag_end(d)});

        drag_handler(this.node);

        //add zoom capabilities 
        var zoom_handler = d3.zoom()
            .on("zoom", function(){self.zoom_actions()});

        zoom_handler(this.svg);
    }



    /** Functions **/

    //Function to choose what color circle we have
    //Let's return blue for males and red for females
    circleColour(d:any) {
        if (d.sex == "M") {
            return "blue";
        } else {
            return "pink";
        }
    }

    //Function to choose the line colour and thickness 
    //If the link type is "A" return green 
    //If the link type is "E" return red 
    linkColour(d:any) {
        if (d.type == "A") {
            return "green";
        } else {
            return "red";
        }
    }

    //Drag functions 
    //d is the node 
    drag_start(d:any) {

        if (!d3.event.active) this.simulation.alphaTarget(0.9).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    //make sure you can't drag the circle outside the box
    drag_drag(d:any) {
        d.fx = d3.event.x;
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

    tickActions() {
        //update circle positions each tick of the simulation 
        this.node
            .attr("cx", function (d:any) {
                 return d.x; 
                })
            .attr("cy", function (d:any) { 
                return d.y; 
            });
        this.node
            .attr("cx", function (d:any) {
                 return d.x; 
                })
            .attr("cy", function (d:any) { 
                return d.y; 
            });

        //update link positions 
        this.link
            .attr("x1", function (d:any) { 
                
                return d.source.x; 
            
            })
            .attr("y1", function (d:any) { return d.source.y; })
            .attr("x2", function (d:any) { return d.target.x; })
            .attr("y2", function (d:any) { return d.target.y; });
    }
    initData(){
        this.nodes_data = [
            { "name": "Lillian", "sex": "F","source": "Lillian", "target": "Gordon", "type": "A" },
            { "name": "Gordon", "sex": "M", "source": "Gordon", "target": "Gordon", "type": "A"}
        ]
        
        // nodes_data = hybroChart.bundleChart.leaves;
        //Sample links data 
        //type: A for Ally, E for Enemy
        // this.links_data = [
        //     { "source": "Sylvester", "target": "Gordon", "type": "A" },
        //     { "source": "Gordon", "target": "Sylvester", "type": "A" },
        //     { "source": "Sylvester", "target": "Lillian", "type": "A" },
        //     { "source": "Sylvester", "target": "Maria", "type": "E" }
        // ]
        this.links_data = this.nodes_data;
    }

}