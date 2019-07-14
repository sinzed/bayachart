class HistoryDialog extends Dialog {
    preElement : any;
    histories : Array<any>;
    selectedItem: any;
    selectedInput: any;
    constructor(layout : Layout){
      super(layout);
      this.title = "Load from history";
       this.histories= []
       this.histories.push({});
       this.histories.push({});
       this.histories.push({});
       this.histories.push({});
    //   this.setContent(" <pre><code class="java">
      //     </code>
      //     </pre>")
    }
    init(){
        super.init();
        // let ul = this.contentDiv.insert("ul");
        this.loadHistory();

        // this.preElement = this.contentDiv.insert("pre");
        // this.codeElement = this.preElement.insert("code");
        // this.codeElement = this.preElement.insert("textarea");
        // this.codeElement.attr("contenteditable",true);
        // this.codeElement.classed("json",true);
        let loadBtn = this.divButtonSet.insert("button");
        loadBtn.text("load");
        loadBtn.on("click",()=>{
            this.redraw();
            this.element.remove()
        });
    }
    redraw(){
        // let jsonString = this.codeElement.text();
        let url = "http://tasks.towist.com/api/chartapi.php";
        d3.request(url)
        .header("X-Requested-With", "XMLHttpRequest")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .post("action=getHistory&historyID="+this.selectedInput.id,  (error, response)=>{
            let receivedResult = JSON.parse(response['response']);
            let result = JSON.parse(receivedResult);
            let data= JSON.parse(result['history']);
            let jsonString = data['content'];
            console.log("result",jsonString);
            this.layout.bayaChart.delete();
            this.layout.bayaChart.setJsonData(JSON.parse(jsonString));
            this.layout.bayaChart.draw();
        });

    }
    setInputJson(jsonString : string){
        // this.codeElement.text(jsonString);
    }
    loadHistory(){
        // let url = "http://tasks.towist.com/api/chartapi.php";
        let url = "http://tasks.towist.com/api/chartapi.php";
        d3.request(url)
        .header("X-Requested-With", "XMLHttpRequest")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .post("action=getAllVersions",  (error, response)=>{
            let receivedResult = response;
            let result = JSON.parse(response['response']);
            result = JSON.parse(result);
            this.histories = result.histories;
            console.log(this.histories);
            this.showHistories();
            // Now use response to do some d3 magic
        });
    }
    showHistories(){
        for(let input of this.histories){
            let item = this.contentDiv.insert("div").classed("historyItem",true);
            item.data(input);
            item.on("click", ()=>{
                d3.selectAll(".historyItem").classed("selected",false);
                item.classed("selected",true);
                this.selectedInput = input;
            })
            let name = item.insert("div");
            let timestamp = item.insert("div");
            name.text(input.name);
            timestamp.text(input.timestamp);
        
        }
    }
}