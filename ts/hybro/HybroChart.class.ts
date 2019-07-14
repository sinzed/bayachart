class HybroChart extends Chart {
    tools: Tools;
    voronoiChart: Voronoi;
    donutChart: DonutChart;
    bundleChart: BundleChart;
    svg: any;
    forceChart: ForceChart;
    rootData : any;
    copyRootOFData : any;
    stringData: string;
    showPerformance: boolean = false;
    


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
        this.rootData = rootData;
        this.copyRootOFData = [...[this.rootData]];
        this.stringData = JSON.stringify(rootData);
        let before  = performance.now();

        return new Promise((resolve,reject)=>{
            this.svg = this.getParent().svg;
            if(!this.enable)
            return false;
            
            this.voronoiChart.draw(rootData).then(
                ()=>{
                    this.bundleChart.draw(rootData);
                    this.donutChart.setWidth(940)
                    .setHeight(790)
                    .setCornerRadius(3) // sets how rounded the corners are on each slice
                    .setPadAngle(0.015) // effectively dictates the gap between slices
                    .setVariable('value')
                    .setCategory('data.data.name');
                    
                    this.donutChart.draw(this.bundleChart.leaves);
                    if(this.showPerformance){

                        let after = performance.now();
                        let time = after - before;
                        this.voronoiChart.treemapContainer.append("g").append("text")
                        .classed("performance", true)
                        .attr("text-anchor", "middle")
                        .text("performance: "+Math.round(time)+"ms")
                    }
                    this.addDbClickHandler();
                    // localStorage.clear();
                    resolve(true);
                    
            });
        // this.forceChart.draw(rootData);
    })
        
        
    }
    addDbClickHandler(){
        this.voronoiChart.hoverers.on("dblclick", (d)=>{
            // let win = window.open("", "Title", "toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=780,height=200,top="+(screen.height-400)+",left="+(screen.width-840));
            // win.document.body.innerHTML = "HTML";
            var win = window.open("", '_blank');
            // win.focus();
            let htmlManager = new HtmlManager();
            let mainSource = this.forceChart.findMainSource(d);
            const data = this.findJsonDataSource(mainSource.data);
            // let jsonString = JSON.stringify((this.rootData, getCircularReplacer());
            // let newGrahData = {name: 'newtab', children : mainSource.data};
            
            // localStorage.setItem("jsonData",JSON.stringify(this.copyRootOFData[0] ));
            localStorage.setItem("jsonData",this.stringData);
            // let newData = "var spoonDataDependencies = '"+jsonString+"';";
            // htmlManager.addScript(newData);
            const html = htmlManager.getHtml();
            win.document.write( html);

    
            })
    }
    findJsonDataSource(source){
        for ( let data of this.rootData.children) {
            if (data.name == source.name){
                return data;
            }
        }
    }

}