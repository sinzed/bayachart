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
    }
    setInputJson(jsonString : string){
        this.codeElement.text(jsonString);
    }
}