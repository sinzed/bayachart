class HybroChart extends Chart {
    tools: Tools;
    voronoiChart: Voronoi;
    donutChart: DonutChart;
    bundleChart: BundleChart;
    svg:any;
    private layout: Layout;
    constructor(){
        super();
        this.init();
        this.tools = new Tools();
        this.voronoiChart = new Voronoi();
        this.donutChart = new DonutChart();
        this.bundleChart = new BundleChart();
        this.layout = new Layout(this);

        this.bundleChart.setParent(this);
        this.donutChart.setParent(this);
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
    draw(rootData:any){
        this.voronoiChart.draw(rootData);
        this.bundleChart.draw(rootData);
        this.donutChart.setWidth(940)
        .setHeight(790)
        .setCornerRadius(3) // sets how rounded the corners are on each slice
        .setPadAngle(0.015) // effectively dictates the gap between slices
        .setVariable('value')
        .setCategory('data.data.name');
        this.donutChart.draw(this.bundleChart.leaves);

    }

}