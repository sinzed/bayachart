// if you double click on a graph a new webpage will open and rebuild the sub graph
class HtmlManager {
    part2Html: string;
    part1Html: string;
    middlePartHtml : string;
    constructor(){
      this.part1Html = "";
      this.part2Html = "";
      this.middlePartHtml = "";
      this.init();

    }
    addScript(script : string){
        this.middlePartHtml+= "<script>"+script+"</script>";
        return this;
    }    
    getHtml(){
        return this.part1Html+this.middlePartHtml+this.part2Html;
    }
    init(){

        
        this.part1Html = `<!DOCTYPE html>
        <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>d3-voronoi-treemap usage</title>
        <meta name="description" content="d3-voronoi-treemap plugin to remake 'The bad smells of codes'">
        <script src="js/d3.v4.min.js" charset="utf-8"></script>
        <script src="js/d3-vornoi-wheightend-build.js"></script>
        <script src="js/d3-vornoi-map-build.js"></script>
        <script src="js/d3-voronoi-treemap.js"></script>
        
        
        <link  rel="stylesheet" type="text/css" media="all" href="css/style.css"/>
        <!-- <link  rel="stylesheet" type="text/css" media="all" href="css/donut.css"/>
        <link  rel="stylesheet" type="text/css" media="all" href="css/button.css"/> -->
          <link rel="stylesheet" href="css/draggable-resizable-dialog.css" />
          <link rel="stylesheet" href="libs/highlight/styles/dracula.css">
          <script src="libs/highlight/highlight.pack.js"></script>
          </head>
        <body>
    
        <!-- <div class="col panel"> -->
        
              <!-- <pre><code class="java">
              public static void main(String arr[]) throws FileNotFoundException 
                { 
                    // Creating a File object that represents the disk file. 
                  PrintStream o = new PrintStream(new File("A.txt")); 
                  
                  // Store current System.out before assigning a new value 
                  PrintStream console = System.out; 
                  
                  // Assign o to output stream 
                  System.setOut(o); 
                  System.out.println("This will be written to the text file"); 
                  
                  // Use stored value for output stream 
                  System.setOut(console); 
                  System.out.println("This will be written on the console!"); 
                } 
              </code></pre> -->
              <!-- </div> -->
              <div class="col view">
              <svg>
              <filter id="dropshadow" height="190%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/> <!-- stdDeviation is how much to blur -->
                  <feOffset dx="2" dy="2" result="offsetblur"/> <!-- how much to offset -->
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3"/> <!-- slope is the opacity of the shadow -->
                    </feComponentTransfer>
                    <feMerge> 
                    <feMergeNode/> <!-- this contains the offset blurred image -->
                    <feMergeNode in="SourceGraphic"/> <!-- this contains the element that the filter is applied to -->
                  </feMerge>
                </filter>
                <g class="layout zoomable">
                  
                </g>
              </svg>
            </div>
            <div id="chart">
            <textarea id="graphsData" style="width : 100%; height: 500px;">
            </textarea>
            </div>
            <div class="dialog" style="width:580px; height:240px;     z-index: 99999;">
            <div class="titlebar">Source Code</div>
            <button>Close</button>
            <div class="content">
            <pre><code class="java">
            </code>
            </pre>
            </div>
            <div class="buttonpane">
            <div class="buttonset">
            <button>OK</button>
                <button>Cancel</button>
                </div>
                </div>
        </div>
        </body>
      <script>hljs.initHighlightingOnLoad();</script>
      <script>document.addEventListener('DOMContentLoaded', (event) => {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
      });</script>
      `;

      this.part2Html = `  <script src="js/hybograph.js"></script>
        <!-- <script src="js/force.js"></script> -->
        <script type="text/javascript" src="js/draggable-resizable-dialog.js"></script>
        <script></script>
        
        </html>`;
    }
}