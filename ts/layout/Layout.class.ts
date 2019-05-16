class Layout {
    layoutOption : LayoutOption;
    bayaChart : BayaChart;
    zoomInBtn:any;
    showDonutChartBtn:any;
    showBundleChartBtn:any;
    element: any;
    graphic : any;
    showForceChartBtn: any;
    constructor(bayaChart : BayaChart){
        this.bayaChart = bayaChart;
        this.layoutOption = new LayoutOption();
        this.initElement();
        this.addForceChartButton();
        this.addDonutChartButton();
        this.addBundleChartButton();
        this.addZoomInButton();
        this.init();
        




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
    addForceChartButton(){
        let self = this;
        this.showForceChartBtn =  this.element.insert("button",":first-child");
        this.showForceChartBtn.text("force");
        this.showForceChartBtn.on("click",function(){self.toggleForceChart()});
        this.showForceChartBtn.classed("selected", this.layoutOption.canShowForceChart);
        return this.showForceChartBtn;
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
        this.bayaChart.forceChart.simulation.force('collision', d3.forceCollide()
        .radius(this.layoutOption.canShowDonutChart?310:210));
        this.bayaChart.forceChart.simulation.force('charge_force',d3.forceManyBody().strength(4000));
        this.bayaChart.forceChart.simulation.force('charge_force',d3.forceManyBody().strength(200));
    }
    toggleForceChart(){
        this.layoutOption.canShowForceChart = !this.layoutOption.canShowForceChart;
        this.showForceChartBtn.classed("selected", this.layoutOption.canShowForceChart);
        let enable = this.layoutOption.canShowForceChart;
        // for(let hybroChart of this.bayaChart.forceChart)
        if(enable)
            this.bayaChart.forceChart.run();
        else
            this.bayaChart.forceChart.unlink();
        // this.bayaChart.forceChart.simulation.force('collision', d3.forceCollide()
        // .radius(this.layoutOption.canShowDonutChart?310:210));
        // this.bayaChart.forceChart.simulation.force('charge_force',d3.forceManyBody().strength(4000));
        // this.bayaChart.forceChart.simulation.force('charge_force',d3.forceManyBody().strength(200));
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