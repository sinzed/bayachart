class LayoutOption {
    private _zoomIn : boolean = false;
    private _donutChart : boolean = false;
    private _bundleChart : boolean = true;
    canShowForceChart: boolean = false;
    canShowTreeMap: boolean = false;
    canShowSource: any;
    canShowElinks: boolean = true;
    canShowInteractiveActions: boolean = false;
    layout: Layout;
    constructor(layout: Layout){
        this.layout = layout;
        this.canZoomIn = false;
    }
    init(){
        this.layout.interactiveBtn.classed("selected", this.layout.layoutOption.canShowInteractiveActions);
    }
    get canZoomIn(){
        return this._zoomIn;
    }
    set canZoomIn(enable){
        this._zoomIn = enable;
    }
    get canShowBundleChart(){
        return this._bundleChart;
    }
    set canShowBundleChart(enable){
        this._bundleChart = enable;
    }
    get canShowDonutChart(){
        return this._donutChart;
    }
    set canShowDonutChart(enable){
        this._donutChart = enable;
    }

}