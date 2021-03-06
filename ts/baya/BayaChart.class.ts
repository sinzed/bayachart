class BayaChart extends Chart {
    hybroCharts : Array<HybroChart>;
    forceChart : ForceChart;
    jsonData : any;
    rawdata : any;
    nodesData : Array<any>;
    svg : any;
    highlight : Highlight;
    public layout: Layout;
    legend: Legend;
    constructor(){
        super();
        this.nodesData = [];
        this.hybroCharts = [];
        // this.svg = d3.select("svg");
        this.init();
        this.layout = new Layout(this);

        this.forceChart = new ForceChart();
        this.forceChart.setParent(this);
        this.highlight = new Highlight(this);
        this.legend = new Legend(this);
        
    }
    init(){
        this.initLayout();
    }
    initLayout(){
        this.svg = d3.select("svg")
        .style("margin","0 auto 0 auto")
        .style("position","relative")
        .style("display","block");
    }
    delete(){
        this.layout.bayaChart.forceChart.destroy();
        this.layout.graphic.selectAll("g").remove();
    }
    setJsonData(jsonData : any){
        this.jsonData = jsonData;
        this.rawdata = JSON.stringify(jsonData, null, 2);
    }
    getMaxTreemapRadius(){
        let maxRadius = 0;
        for (let hybroChart of this.hybroCharts ){
            if(hybroChart.voronoiChart.treemapRadius> maxRadius)
                maxRadius =  hybroChart.voronoiChart.treemapRadius
        }
        return maxRadius;
    }
    draw(){
        // let hybroChart2 = new HybroChart();
        // this.hybroCharts.push(hybroChart2);
        this.nodesData = [];
        this.hybroCharts = [];
        let promiseList = [];
        for(let nodeGraphData of this.jsonData.children){
            let hybroChart = new HybroChart();
            this.nodesData.push(nodeGraphData);
            hybroChart.setParent(this);
            this.hybroCharts.push(hybroChart);
            let promise = hybroChart.draw(nodeGraphData);
            promise.then(()=>{
                hybroChart.donutChart.toggle();
                this.layout.toggleTreeMap();

            });
            promiseList.push(promise);
          }
          this.forceChart.draw(this.jsonData);
          this.legend.draw();
          this.layout.initZoom();
        //   for ( let hybroChart of this.hybroCharts ){
        //       hybroChart.voronoiChart.handleWorker();
        //   }
          Promise.all(promiseList).then(() => {
            
            this.forceChart.unlink();
            this.forceChart.draw(this.jsonData);
            this.highlight.init();
            
          });
          // hybroChart2.voronoiChart.setMarginLeft(Math.random()*-500);
          // hybroChart2.forceChart.disable();
        //   hybroChart2.setParent(this);
        //   hybroChart2.draw(this.jsonData["controllers"]);
    }

}