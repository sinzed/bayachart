class Dialog {
    layout : Layout;
    element : any;
    contentHtml: string;
    contentDiv: any;
    title: any;
    hasOkBtn : boolean = true;
    divButtonSet: any;
    constructor(layout : Layout){
        this.layout = layout;
        this.contentHtml = "";
    }
    setContent(contentHtml : string){
        this.contentHtml = contentHtml;
        this.contentDiv.html(contentHtml);
    }
    init(){
        // let div = this.layout.element.insert("div");
        // let  dialogHtml =       `<div class="dialog" style="width:580px; height:240px;     z-index: 99999;">
              
        //     </div>`;
        d3.selectAll(".dialog").remove();
        let div = this.layout.element.insert("div");
        this.element = div;
        div.style("width","500px");
        div.classed("dialog",true);
        div.style("height","240px");
        div.style("z-index",99999);

        let title = div.insert("div");
        title.classed("titlebar",true);
        title.text(this.title);

        let closeBtn = div.insert("button");
        closeBtn.text("Close");
        this.contentDiv = div.insert("div");
        this.contentDiv.classed("content",true);
        // let  contentHtml =` 
        //     <pre><code class="java">
        //     </code>
        //     </pre>
        // `;
        this.setContent(this.contentHtml);
        let subPane = div.insert("div");
        subPane.classed("buttonpane", true);
        this.divButtonSet = subPane.insert("div");
        this.divButtonSet.classed("buttonset",true);
        if(this.hasOkBtn) {
            let okBtn = this.divButtonSet.insert("button");
            okBtn.text("ok");
            okBtn.on("click",()=>{
                this.element.remove()
            });
        }
            let cancelBtn = this.divButtonSet.insert("button");
        cancelBtn.text("cancel");
        cancelBtn.on("click",()=>{
            this.element.remove()
        });
        closeBtn.on("click",()=>{
            this.element.remove()
        });

        // div.html(dialogHtml);
    }

}