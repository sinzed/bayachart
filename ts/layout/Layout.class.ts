class Layout {
    layoutOption : LayoutOption;
    hybroChart : HybroChart;
    constructor(hybroChart : HybroChart){
        this.hybroChart = hybroChart;
        this.layoutOption = new LayoutOption();
        this.init();
    }
    init(){
        this.manageZoomIn();
    }
    manageZoomIn(){
        if(!this.layoutOption.canZoomIn)
            return false;
        
        alert("lets manage zoom  in");
        
    }
    //Zoom functions 
    zoom_actions() {
        this.g.attr("transform", d3.event.transform)
    }
}