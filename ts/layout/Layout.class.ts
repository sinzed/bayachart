class Layout {


    layoutOption : LayoutOption;
    bayaChart : BayaChart;
    zoomInBtn:any;
    showDonutChartBtn:any;
    showBundleChartBtn:any;
    element: any;
    graphic : any;
    showForceChartBtn: any;
    treemapBtn: any;
    sourceBtn: any;
    editBtn: any;
    scale: number;
    xTranslate: number;
    yTranslate: number;
    iLinkBtn: any;
    eLinkBtn: any;
    interactiveBtn: any;
    constructor(bayaChart : BayaChart){
        this.bayaChart = bayaChart;
        this.layoutOption = new LayoutOption();
        this.initElement();
        this.addForceChartButton();
        this.addDonutChartButton();
        this.addBundleChartButton();
        this.addZoomInButton();
        this.addTreemap();
        this.addSourceBtn();
        this.addEditBtn();
        this.addElinksBtn();
        this.addIlinksBtn();
        this.addInteractiveBtn();
        this.init();
        




        // this.initZoom();

    }

    init(){
        // this.manageZoomIn();
        // this.toggleTreeMap();
        // this.toggleTreeMap();
        // this.toggleTreeMap();
    }

    initElement(){
        this.element = d3.select("body")
        .insert("div",":first-child")
        this.element.style("margin-left","20px");
        this.graphic = d3.select(".layout");
    }
    initZoom(){
        let g;
        g = this.bayaChart.svg.selectAll(".zoomable");
        let maxRadius = this.bayaChart.getMaxTreemapRadius();
        this.scale = 150/maxRadius;
        // this.xTranslate  =  maxRadius/10+this.scale* 150;
        // this.yTranslate  =  maxRadius/10+ this.scale* 50;
        this.xTranslate  =  -500 + maxRadius/2;
        this.yTranslate  =  -600 + maxRadius/2;
        g.attr("transform", "translate("+this.xTranslate+","+this.xTranslate+")  scale("+this.scale+")");
        this.manageZoomIn();
        // g.attr("transform", "translate(0.16)");
    }
    addTreemap(){
        let self = this;
        this.treemapBtn =  this.element.insert("button",":first-child");
        this.treemapBtn.text("treemap");
        this.treemapBtn.on("click",function(){self.toggleTreeMap()});
        return this.treemapBtn;

    }
    addSourceBtn(){
        let self = this;
        this.sourceBtn =  this.element.insert("button",":first-child");
        this.sourceBtn.text("source");
        this.sourceBtn.on("click",()=>{
            
            let dialog = new SourceDialog(this);
            dialog.init();
            // dialog.setInputJson("{sdfsdf}");
            this.showSourceDialog();
        
        });
        return this.sourceBtn;

    }
    addIlinksBtn() {
        let self = this;
        this.iLinkBtn =  this.element.insert("button",":first-child");
        this.iLinkBtn.text("I-links");
        this.iLinkBtn.on("click",()=>{
            self.toggleBundleChart();
        });
        return this.sourceBtn;
    }
    addElinksBtn() {
        let self = this;
        this.eLinkBtn =  this.element.insert("button",":first-child");
        this.eLinkBtn.text("E-links");
        this.eLinkBtn.on("click",()=>{
            self.toggleELinks();
        });
    }
    addInteractiveBtn() {
        let self = this;
        this.interactiveBtn =  this.element.insert("button",":first-child");
        this.interactiveBtn.text("Interactive");
        this.interactiveBtn.on("click",()=>{
            console.log("clicked",this.layoutOption.canShowInteractiveActions);
         this.toggleInteractive();
            
        });
    }
    toggleInteractive(){
        this.layoutOption.canShowInteractiveActions = !this.layoutOption.canShowInteractiveActions;
        this.interactiveBtn.classed("selected", this.layoutOption.canShowInteractiveActions);
        // this.bayaChart.forceChart.link.style("stroke","black");
        this.bayaChart.forceChart.link.style("opacity","0.3");
    }
    toggleELinks(){
        
        d3.selectAll(".links path").style("display",this.layoutOption.canShowElinks?"none":"block");
        this.layoutOption.canShowElinks = !this.layoutOption.canShowElinks;
        this.eLinkBtn.classed("selected", this.layoutOption.canShowElinks);
    }
    addEditBtn(){
        let self = this;
        this.editBtn =  this.element.insert("button",":first-child");
        this.editBtn.text("edit");
        this.editBtn.on("click",()=>{
            let dialog = new InputDialog(this);
            dialog.init();
            dialog.setInputJson(this.bayaChart.rawdata);
            this.showSourceDialog();
        
        });
        return this.sourceBtn;

    }
    showSourceDialog(){

        // let showDialog = function show () {
            _init();
           _showDialog();
        // };
        // showDialog();
        this.sourceBtn.classed("selected", this.layoutOption.canShowSource);
    }
    addZoomInButton(){
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
    toggleTreeMap(){
        this.treemapBtn.classed("selected", this.layoutOption.canShowTreeMap);
        for(let hybroChart of this.bayaChart.hybroCharts)
            hybroChart.voronoiChart.showTreeMapBorders(this.layoutOption.canShowTreeMap);
        this.layoutOption.canShowTreeMap = !this.layoutOption.canShowTreeMap;
    }
    toggleBundleChart(){
        this.layoutOption.canShowBundleChart = !this.layoutOption.canShowBundleChart;
        this.showBundleChartBtn.classed("selected", this.layoutOption.canShowBundleChart);
        this.iLinkBtn.classed("selected", this.layoutOption.canShowBundleChart);
        for(let hybroChart of this.bayaChart.hybroCharts)
            hybroChart.bundleChart.element.attr("display",this.layoutOption.canShowBundleChart?"block":"none");
    }
    toggleDonutChart(){
        this.layoutOption.canShowDonutChart = !this.layoutOption.canShowDonutChart;
        this.showDonutChartBtn.classed("selected", this.layoutOption.canShowDonutChart);
        let exteraRadius = this.layoutOption.canShowDonutChart?true:false;
        for(let hybroChart of this.bayaChart.hybroCharts)
            hybroChart.donutChart.element.attr("display",this.layoutOption.canShowDonutChart?"block":"none");
        // this.bayaChart.forceChart.simulation.force('collision', d3.forceCollide()
        this.bayaChart.forceChart.simulation.force('collision', d3.forceCollide().radius(function(d) {
            if(exteraRadius)
            return d.radius*1.6;
        }))
        // .radius(this.layoutOption.canShowDonutChart?310:210));
        this.bayaChart.forceChart.simulation.force('charge_force',d3.forceManyBody().strength(4000));
        this.bayaChart.forceChart.simulation.force('charge_force',d3.forceManyBody().strength(200));
    }
    toggleForceChart(){
        this.layoutOption.canShowForceChart = !this.layoutOption.canShowForceChart;
        this.showForceChartBtn.classed("selected", this.layoutOption.canShowForceChart);
        let enable = this.layoutOption.canShowForceChart;
        this.bayaChart.forceChart.simulation.force('collision', d3.forceCollide().radius(function(d) {
            return d.radius;
        }))
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

        let transform = d3.zoomIdentity.translate(this.xTranslate, this.yTranslate).scale(this.scale);
        var zoom_handler = d3.zoom().on("zoom", function(){self.zoom_actions()}).filter(function() {
            // Exclude wheel event unless zoomKey is set

            return self.layoutOption.canZoomIn || !(d3.event.type === "wheel");
        });
        zoom_handler(this.bayaChart.svg);
        this.bayaChart.svg.call(zoom_handler.transform,transform)


   
    }
    //Zoom functions 
    zoom_actions() {
        //error 
        let g;
        g = this.bayaChart.svg.selectAll(".zoomable");
        g.attr("transform", d3.event.transform);
    }
}