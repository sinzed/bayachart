class Highlight {
        bayaChart : BayaChart;
        constructor(bayaChart : BayaChart){
            this.bayaChart = bayaChart;

        }
        init(){
            let self = this;            
            this.bayaChart.hybroCharts.forEach(hybroChart=>{
                // hybroChart.voronoiChart.cells.enter().on("click",function(){
                //     alert("hi");
                // })
                hybroChart.voronoiChart.treemapContainer
                .selectAll(".hoverers path")
                .data(hybroChart.voronoiChart.leaves).on("click",function(target:any){
                    document.querySelectorAll('pre code.sourceCode').forEach((block) => {
                        if(target.data.text) {
                              block.textContent = target.data.text;
                              hljs.highlightBlock(block);
                        }
                        else {
                            block.textContent = target.data.name;
                        }
                    });

                })
                // for(let cell of hybroChart.voronoiChart) {
                //         console.log(cell);
                // }
                // for(let leaf of hybroChart.bundleChart.leaves){
                    
                // }
            })
        }


}