class SearchPanel {
    layout : Layout;
    panel: Element;
    elements: Array<any>;
    items: Array<any>;
    originalItems: any;
    constructor(layout : Layout){
        this.layout = layout; 
        // this.panel = new Element();
        this.items = [];
        this.originalItems = [];
        this.init();
        
    }
    init(){
        this.panel = d3.select(".js-cd-panel-main");
        // this.panel = document.getElementsByClassName("js-cd-panel-main")[0];
        this.initCloseEvent();
        this.initElements();
    }
    initCloseEvent(){
        let self = this;
        this.panel.select(".js-cd-close").on("click",()=>{
            this.panel.classed("cd-panel--is-visible",false);
        });
        d3.select(".js-cd-panel-main").on("click",()=>{
            this.panel.classed("cd-panel--is-visible",false);
        });
        this.panel.select("header input").on("click",(target,event)=>{
            d3.event.preventDefault();
            d3.event.stopPropagation() 
        });
        this.panel.select("header input").on("input",function(target,event){
            let inputSpace = this;
            self.items = self.originalItems.filter(function(el,nex){
                if(el.data.name.indexOf(inputSpace.value)>=0){
                    return el;
                }
                else {
                    return null;
                }
            });
            self.draw();
            // console.log("new items",newItems);
        });
        // this.panel.on('click', function(event){
            // if( self.layout.tools.hasClass(event.target, 'js-cd-close') || self.layout.tools.hasClass(event.target,  "js-cd-panel-main")) {
                //     event.preventDefault();
                //     self.layout.tools.removeClass(self.panel, 'cd-panel--is-visible');
                // }
                
                // });
    }
    initElements(){
            // this.panel.appendChild("hallo")
        for(let hybroChart of this.layout.bayaChart.hybroCharts){
            for(let leaf of hybroChart.bundleChart.leaves){
                this.items.push(leaf);
                this.originalItems.push(leaf);
            }
        }
        this.draw();
                
    }
    initElementsOld(){
            // this.panel.appendChild("hallo")
        let panelContent = this.panel.select(".cd-panel__content");
        for(let hybroChart of this.layout.bayaChart.hybroCharts){
            let ul = panelContent.insert("ul",":first-child");
            let groupName = panelContent.insert("li",":first-child");
            groupName.text(hybroChart.rootData.name);
            for(let leaf of hybroChart.bundleChart.leaves){
                let li = ul.insert("li",":first-child");
                console.log("leaf",leaf.data.name);
                li.text(leaf.data.name);
            }
        }
                
    }
    open(){
        this.panel.classed("cd-panel--is-visible",true);
        this.initElements();
        // this.layout.tools.addClass(this.panel, 'cd-panel--is-visible');
        
    }
    draw(){
        this.panel.selectAll("ul").remove();
        let panelContent = this.panel.select(".cd-panel__content");
        let ul = panelContent.insert("ul",":first-child");
        for(let item of this.items){
            // let item = ul.insert("li",":first-child");
            let li = ul.insert("li",":first-child");
            li.text(item.data.name);
            li.on("click", function(){
                // item.element.classed("searched", false);
                // item.element.classed("searched", true);
                item.element.transition()
                .duration(300)
                .transition()
                .style("fill", "yellowgreen")
                .duration(300)
                .transition()
                .style("fill", "rgb(221, 221, 221)")
                .duration(300)
                .transition()
                .style("fill", "yellowgreen")
                .duration(300)
                .transition()
                .style("fill", "rgb(221, 221, 221)")
                .duration(300)
                .transition()
                .style("fill", "yellowgreen")
                .duration(300)
                .transition()
                .style("fill", "rgb(221, 221, 221)")
                console.log(item);

            });
            // this.initItemClickEvent(item);
        }


    }
    

}