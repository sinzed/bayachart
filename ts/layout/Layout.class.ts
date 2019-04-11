class Layout {
    layoutOption : LayoutOption;
    hybroChart : HybroChart;
    constructor(hybroChart : HybroChart){
        this.hybroChart = hybroChart;
        this.layoutOption = new LayoutOption();
        // this.init();
    }
    init(){
        this.manageZoomIn();
    }
    manageZoomIn(){
        if(!this.layoutOption.canZoomIn)
            return false;
        let self = this;
        //add zoom capabilities 
        var zoom_handler = d3.zoom().on("zoom", function(){self.zoom_actions()});
    
        zoom_handler(this.hybroChart.svg);
    }
    //Zoom functions 
    zoom_actions() {
        //error 
        let g;
        g = this.hybroChart.svg.select("g");
        g.attr("transform", d3.event.transform);
    }
}