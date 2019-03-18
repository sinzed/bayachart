class Chart {
    parent: any;
    constructor(){
        // this.parent = null
    }
    setParent(chart : Chart){
        this.parent = chart;
    }
    getParent(){
        return this.parent;
    }
}