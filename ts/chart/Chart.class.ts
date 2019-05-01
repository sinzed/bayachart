class Chart {
    parent: any;
    enable: boolean = true;
    constructor(){
        // this.parent = null
    }
    setParent(chart : Chart){
        this.parent = chart;
    }
    getParent(){
        return this.parent;
    }
    disable(){
        this.enable = false;
    }
}