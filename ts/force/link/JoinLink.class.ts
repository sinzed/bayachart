class JoinLink {
    element : any;
    parent: any;
    mainSource : any;
    mainTarget : any;
    centerMargin : any;
    source : any;
    target : any;
    centerMarginTarget: any;
    constructor(linkData : any){
        this.mainSource = linkData.source;
        this.mainTarget = linkData.target;
        this.centerMargin = linkData.centerMargin;
        this.source = linkData.source;
        this.target = linkData.target;
    }
    getParent(){
        return this.parent;
    }
    setParent(parent : any){
        this.parent = parent;
    }
    draw(){
        this.element = this.getParent().g.append("g")
            .append("line")
            .attr("stroke-width", 6)
            .style("stroke", "green"); 
    }
    update(positionData : any){
        return true;
        if(positionData.source != this.mainSource || positionData.target != this.mainTarget)
            return false;
        this.element
        .attr("x1", positionData.source + this.centerMargin.x)
        .attr("y1", positionData.source + this.centerMargin.y)
        .attr("x2", positionData.target + this.centerMarginTarget.x)
        .attr("y2", positionData.target + this.centerMarginTarget.y);

    }
}