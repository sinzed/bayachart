class ForceChart {
    link: any;
    node: any;
    svg: any;
    width: number;
    height: number;
    simulation: any;
    g: any;
    constructor() {
        this.width = 0;
        this.height = 0;
    }
    draw() {
        //create somewhere to put the force directed graph
        // var svg = d3.select(".drawingArea"),
        //     width = +svg.attr("width"),
        //     height = +svg.attr("height");
        this.svg = d3.select("svg");
        this.width = +this.svg.attr("width");
        this.height = +this.svg.attr("height");

        var radius = 10;

        var nodes_data = [
            { "name": "Lillian", "sex": "F" },
            { "name": "Gordon", "sex": "M" },
            { "name": "Sylvester", "sex": "M" },
            { "name": "Mary", "sex": "F" },
            { "name": "Helen", "sex": "F" },
            { "name": "Jamie", "sex": "M" },
            { "name": "Jessie", "sex": "F" },
            { "name": "Ashton", "sex": "M" },
            { "name": "Duncan", "sex": "M" },
            { "name": "Evette", "sex": "F" },
            { "name": "Mauer", "sex": "M" },
            { "name": "Fray", "sex": "F" },
            { "name": "Duke", "sex": "M" },
            { "name": "Baron", "sex": "M" },
            { "name": "Infante", "sex": "M" },
            { "name": "Percy", "sex": "M" },
            { "name": "Cynthia", "sex": "F" },
            { "name": "Feyton", "sex": "M" },
            { "name": "Lesley", "sex": "F" },
            { "name": "Yvette", "sex": "F" },
            { "name": "Maria", "sex": "F" },
            { "name": "Lexy", "sex": "F" },
            { "name": "Peter", "sex": "M" },
            { "name": "Ashley", "sex": "F" },
            { "name": "Finkler", "sex": "M" },
            { "name": "Damo", "sex": "M" },
            { "name": "Imogen", "sex": "F" }
        ]

        //Sample links data 
        //type: A for Ally, E for Enemy
        var links_data = [
            { "source": "Sylvester", "target": "Gordon", "type": "A" },
            { "source": "Sylvester", "target": "Lillian", "type": "A" },
            { "source": "Sylvester", "target": "Mary", "type": "A" },
            { "source": "Sylvester", "target": "Jamie", "type": "A" },
            { "source": "Sylvester", "target": "Jessie", "type": "A" },
            { "source": "Sylvester", "target": "Helen", "type": "A" },
            { "source": "Helen", "target": "Gordon", "type": "A" },
            { "source": "Mary", "target": "Lillian", "type": "A" },
            { "source": "Ashton", "target": "Mary", "type": "A" },
            { "source": "Duncan", "target": "Jamie", "type": "A" },
            { "source": "Gordon", "target": "Jessie", "type": "A" },
            { "source": "Sylvester", "target": "Fray", "type": "E" },
            { "source": "Fray", "target": "Mauer", "type": "A" },
            { "source": "Fray", "target": "Cynthia", "type": "A" },
            { "source": "Fray", "target": "Percy", "type": "A" },
            { "source": "Percy", "target": "Cynthia", "type": "A" },
            { "source": "Infante", "target": "Duke", "type": "A" },
            { "source": "Duke", "target": "Gordon", "type": "A" },
            { "source": "Duke", "target": "Sylvester", "type": "A" },
            { "source": "Baron", "target": "Duke", "type": "A" },
            { "source": "Baron", "target": "Sylvester", "type": "E" },
            { "source": "Evette", "target": "Sylvester", "type": "E" },
            { "source": "Cynthia", "target": "Sylvester", "type": "E" },
            { "source": "Cynthia", "target": "Jamie", "type": "E" },
            { "source": "Mauer", "target": "Jessie", "type": "E" },
            { "source": "Duke", "target": "Lexy", "type": "A" },
            { "source": "Feyton", "target": "Lexy", "type": "A" },
            { "source": "Maria", "target": "Feyton", "type": "A" },
            { "source": "Baron", "target": "Yvette", "type": "E" },
            { "source": "Evette", "target": "Maria", "type": "E" },
            { "source": "Cynthia", "target": "Yvette", "type": "E" },
            { "source": "Maria", "target": "Jamie", "type": "E" },
            { "source": "Maria", "target": "Lesley", "type": "E" },
            { "source": "Ashley", "target": "Damo", "type": "A" },
            { "source": "Damo", "target": "Lexy", "type": "A" },
            { "source": "Maria", "target": "Feyton", "type": "A" },
            { "source": "Finkler", "target": "Ashley", "type": "E" },
            { "source": "Sylvester", "target": "Maria", "type": "E" },
            { "source": "Peter", "target": "Finkler", "type": "E" },
            { "source": "Ashley", "target": "Gordon", "type": "E" },
            { "source": "Maria", "target": "Imogen", "type": "E" }

        ]

        //set up the simulation and add forces  
        this.simulation = d3.forceSimulation()
            .nodes(nodes_data);

        var link_force = d3.forceLink(links_data)
            .id(function (d:any) { return d.name; });

        var charge_force = d3.forceManyBody()
            .strength(-100);

        var center_force = d3.forceCenter(this.width / 2, this.height / 2);

        this.simulation
            .force("charge_force", charge_force)
            .force("center_force", center_force)
            .force("links", link_force)
            ;


        //add tick instructions: 
        let self = this;
        this.simulation.on("tick", function(){self.tickActions()});

        //add encompassing group for the zoom 
        // this.g = this.svg.append("g")
        //     .attr("class", "everything");
        //add encompassing group for the zoom 
        this.g = this.svg.select(".drawingArea")
            .attr("class", "everything");

        //draw lines for the links 
        this.link = this.g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links_data)
            .enter().append("line")
            .attr("stroke-width", 2)
            .style("stroke", this.linkColour);

        //draw circles for the nodes 
        this.node = this.g.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes_data)
            .enter()
            .append("circle")
            .attr("r", radius)
            .attr("fill", this.circleColour);


        //add drag capabilities  
        var drag_handler = d3.drag()
            .on("start", function(d){self.drag_start(d)})
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
        if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
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

    //Zoom functions 
    zoom_actions() {
        this.g.attr("transform", d3.event.transform)
    }

    tickActions() {
        //update circle positions each tick of the simulation 
        this.node
            .attr("cx", function (d:any) { return d.x; })
            .attr("cy", function (d:any) { return d.y; });

        //update link positions 
        this.link
            .attr("x1", function (d:any) { return d.source.x; })
            .attr("y1", function (d:any) { return d.source.y; })
            .attr("x2", function (d:any) { return d.target.x; })
            .attr("y2", function (d:any) { return d.target.y; });
    }

}