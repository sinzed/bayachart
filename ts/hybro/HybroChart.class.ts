class HybroChart extends Chart {
    tools: Tools;
    voronoiChart: Voronoi;
    donutChart: DonutChart;
    bundleChart: BundleChart;
    svg: any;
    forceChart: ForceChart;


    constructor(){
        super();
        this.tools = new Tools();
        this.voronoiChart = new Voronoi();
        this.voronoiChart.setParent(this);
        this.donutChart = new DonutChart();
        this.bundleChart = new BundleChart();
        this.forceChart = new ForceChart();
        this.forceChart.setParent(this);
        
        this.bundleChart.setParent(this);
        this.donutChart.setParent(this);
        
    }


    draw(rootData:any){
        this.svg = this.getParent().svg;

        if(!this.enable)
        return false;
        
        this.voronoiChart.draw(rootData);
        return true;
        this.bundleChart.draw(rootData);
        this.donutChart.setWidth(940)
        .setHeight(790)
        .setCornerRadius(3) // sets how rounded the corners are on each slice
        .setPadAngle(0.015) // effectively dictates the gap between slices
        .setVariable('value')
        .setCategory('data.data.name');
        this.donutChart.draw(this.bundleChart.leaves);
        // this.forceChart.draw(rootData);




    }

}