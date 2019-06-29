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
                            //   block.textContent.replace("1111highlight1111"","<span class='highlight'","</span>")
                              let newText = block.innerHTML.replace(/1111highlight1111/ig,"<span class='highlight'>");
                              let newText2 = newText.replace(/1111endhighlight1111/ig,"</span>");
                              block.innerHTML = newText2;

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
                    let sortedSmells =  this.sortCodeSmells(leaf.data.cs);
                    for(let smell of sortedSmells){
                        // let firstParts = leaf.text.split(smell.boffset);
                        // let secondParts = firstParts[1].split(smell.eoffset);
                        let finalText : string = "";
                        if(leaf.data.text != "" && leaf.data.text != undefined) {
                            finalText = leaf.data.text.slice(0, smell.position.boffset) 
                            + "1111highlight1111" + leaf.data.text.slice(smell.position.boffset,smell.position.eoffset)+"1111endhighlight1111"
                            + leaf.data.text.slice(smell.position.eoffset);
  
                            leaf.data.text = finalText;
                        } 
                    }
                }
            }
        }
        private sortCodeSmells(codeSmells : Array<any>){
           return codeSmells.sort((a, b) => (a.position.boffset < b.position.boffset) ? 1 : -1)
        }


}