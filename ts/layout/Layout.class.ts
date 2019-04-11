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
}