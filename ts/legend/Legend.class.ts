class Legend {
    bayaChart : BayaChart;
    element : any;
    constructor(bayaChart : BayaChart){
        this.bayaChart = bayaChart;
    }
    draw(){
        if(!this.bayaChart.jsonData.sliceColors)
            return true;
        let legends = this.bayaChart.svg.append("g")
        .classed("legends", true);
        this.element = legends;
        let legend = legends.append("g").classed("legend",true);
        let marginTop = 0;
        for(let slice of this.bayaChart.jsonData.sliceColors ) {
            marginTop+=25;
            legend.append("text")
            .attr("transform","translate(40,"+marginTop+")")
            .attr("y", 12)
            .style("font-weight", "bold")
            .text(slice.name)
            .attr("fill", "black");
            legend.append("rect")
            .attr("transform","translate(40,"+marginTop+")")
            .classed("legend-color", true)
                .attr("y", 0)
                .attr("x", 100)
                .attr("width", 150)
                .attr("height", 20)
                .style("fill",slice.color );
        }
        this.element.attr("display","none");
    
    }
}