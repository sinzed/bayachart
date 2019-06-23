class InputDialog extends Dialog {
    preElement : any;
    codeElement : any;
    constructor(layout : Layout){
      super(layout);
      this.title = "JSON data";

    //   this.setContent(" <pre><code class="java">
      //     </code>
      //     </pre>")
    }
    init(){
        super.init();
        this.preElement = this.contentDiv.insert("pre");
        this.codeElement = this.preElement.insert("code");
        // this.codeElement = this.preElement.insert("textarea");
        this.codeElement.attr("contenteditable",true);
        this.codeElement.classed("json",true);
        let rebuild = this.divButtonSet.insert("button");
        rebuild.text("rebuild");
        rebuild.on("click",()=>{
            this.redraw();
            this.element.remove()
        });
    }
    redraw(){
        let jsonString = this.codeElement.text();
        this.layout.bayaChart.delete();
        this.layout.bayaChart.setJsonData(JSON.parse(jsonString));
        this.layout.bayaChart.draw();
    }
    setInputJson(jsonString : string){
        this.codeElement.text(jsonString);
    }
}