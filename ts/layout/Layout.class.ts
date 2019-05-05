class Layout {
    layoutOption : LayoutOption;
    bayaChart : BayaChart;
    zoomInBtn:any;
    showDonutChartBtn:any;
    showBundleChartBtn:any;
    element: any;
    graphic : any;
    constructor(bayaChart : BayaChart){
        this.bayaChart = bayaChart;
        this.layoutOption = new LayoutOption();
        // this.init();
        this.initElement();
        this.addDonutChartButton();
        this.addBundleChartButton();
        this.addZoomInButton();




        this.initZoom();

    }

    init(){
        this.manageZoomIn();
    }
    initElement(){
        this.element = d3.select("body").insert("div",":first-child");
        this.graphic = d3.select(".layout");
    }
    initZoom(){
        let g;
        g = this.bayaChart.svg.selectAll(".zoomable");
        g.attr("transform", "scale(0.6)");
    }
    addZoomInButton(){
        //alternative way
//         var parentEl = d3.select("div").node();
// parentEl.insertBefore(document.createElement("div"), parentEl.childNodes[0]);
        let self = this;
        this.zoomInBtn =  this.element.insert("button",":first-child");
        this.zoomInBtn.text("zoomable");
        this.zoomInBtn.on("click",function(){self.manageZoomIn()});
        return this.zoomInBtn;

    }
    addDonutChartButton(){
        let self = this;
        this.showDonutChartBtn =  this.element.insert("button",":first-child");
        this.showDonutChartBtn.text("donut");
        this.showDonutChartBtn.on("click",function(){self.toggleDonutChart()});
        this.showDonutChartBtn.classed("selected", this.layoutOption.canShowDonutChart);
        return this.showDonutChartBtn;
    }
    addBundleChartButton(){
        let self = this;
        this.showBundleChartBtn =  this.element.insert("button",":first-child");
        this.showBundleChartBtn.text("bundles");
        this.showBundleChartBtn.on("click",function(){self.toggleBundleChart()});
        this.showBundleChartBtn.classed("selected", this.layoutOption.canShowBundleChart);
        return this.showBundleChartBtn;
    }
    toggleBundleChart(){
        this.layoutOption.canShowBundleChart = !this.layoutOption.canShowBundleChart;
        this.showBundleChartBtn.classed("selected", this.layoutOption.canShowBundleChart);
        for(let hybroChart of this.bayaChart.hybroCharts)
            hybroChart.bundleChart.element.attr("display",this.layoutOption.canShowBundleChart?"block":"none");
    }
    toggleDonutChart(){
        this.layoutOption.canShowDonutChart = !this.layoutOption.canShowDonutChart;
        this.showDonutChartBtn.classed("selected", this.layoutOption.canShowDonutChart);
        for(let hybroChart of this.bayaChart.hybroCharts)
            hybroChart.donutChart.element.attr("display",this.layoutOption.canShowDonutChart?"block":"none");
    }
    manageZoomIn(){
        this.layoutOption.canZoomIn = !this.layoutOption.canZoomIn;
        this.zoomInBtn.classed("selected", this.layoutOption.canZoomIn);
        let self = this;
        //add zoom capabilities 
        var zoom_handler = d3.zoom().on("zoom", function(){self.zoom_actions()}).filter(function() {
            // Exclude wheel event unless zoomKey is set
            return self.layoutOption.canZoomIn || !(d3.event.type === "wheel");
        });
        zoom_handler(this.bayaChart.svg);
    }
    //Zoom functions 
    zoom_actions() {
        //error 
        let g;
        g = this.bayaChart.svg.selectAll(".zoomable");
        g.attr("transform", d3.event.transform);
    }
}