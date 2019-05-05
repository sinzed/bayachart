class BayaChart extends Chart {
    hybroCharts : Array<HybroChart>;
    forceChart : ForceChart;
    jsonData : any;
    nodesData : Array<any>;
    svg : any;
    public layout: Layout;
    constructor(){
        super();
        this.nodesData = [];
        this.hybroCharts = [];
        // this.svg = d3.select("svg");
        this.init();
        this.layout = new Layout(this);

        this.forceChart = new ForceChart();
        this.forceChart.setParent(this);
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
    draw(){
        // let hybroChart2 = new HybroChart();
        // this.hybroCharts.push(hybroChart2);
        for(let nodeGraphData in this.jsonData){

            let hybroChart = new HybroChart();
            this.nodesData.push(this.jsonData[nodeGraphData]);
            hybroChart.setParent(this);
            this.hybroCharts.push(hybroChart);
            hybroChart.draw(this.jsonData[nodeGraphData]);
            // this.layout.toggleDonutChart();
          }
          // hybroChart2.voronoiChart.setMarginLeft(Math.random()*-500);
          // hybroChart2.forceChart.disable();
        //   hybroChart2.setParent(this);
        //   hybroChart2.draw(this.jsonData["controllers"]);
          this.forceChart.draw(this.jsonData);
          this.layout.toggleDonutChart();
    }

}