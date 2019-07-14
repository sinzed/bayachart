class InputDialog extends Dialog {
    preElement : any;
    codeElement : any;
    jsonString: any;
    nameInput: any;
    constructor(layout : Layout){
      super(layout);
      this.title = "JSON data";

    //   this.setContent(" <pre><code class="java">
      //     </code>
      //     </pre>")
    }
    init(){
        super.init();
        this.nameInput = this.divButtonSet.insert("input");
        this.nameInput.style("width","200px");
        this.nameInput.style("height","20px").style("margin-left","5px");
        
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
            this.saveOnline();
        });
    }
    redraw(){
        this.jsonString = this.codeElement.text();
        this.layout.bayaChart.delete();
        this.layout.bayaChart.setJsonData(JSON.parse(this.jsonString));
        this.layout.bayaChart.draw();
    }
    setInputJson(jsonString : string){
        this.codeElement.text(jsonString);
    }
    saveOnline(){
        let url = "http://tasks.towist.com/api/chartapi.php";
        let data = {name: this.nameInput.property("value"),
                    content: JSON.parse(this.jsonString)};
        d3.request(url)
        .header("X-Requested-With", "XMLHttpRequest")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .post("action=save&data="+JSON.stringify(data),  (error, response)=>{
            let receivedResult = response;
            console.log("result",response,error);
        });
    }
}