class Highlight {
        bayaChart : BayaChart;
        constructor(bayaChart : BayaChart){
            this.bayaChart = bayaChart;

        }
        init(){
            let self = this;            
            this.bayaChart.hybroCharts.forEach(hybroChart=>{
                self.colorizeSmells(hybroChart);
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
        private colorizeSmells(hybroChart : HybroChart){
            for(let leaf of hybroChart.bundleChart.leaves){
                if(leaf.data.cs != undefined){
                    for(let smell of leaf){
                        // let firstParts = leaf.text.split(smell.boffset);
                        // let secondParts = firstParts[1].split(smell.eoffset);
                        let finalText = leaf.text.slice(0, smell.boffset) + "<span class='smell'>" + leaf.text.slice(smell.boffset,smell.eoffset)+"</span>"+ leaf.text.slice(smell.eoffset);

                    }
                }
            }
        }


}