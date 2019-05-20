class LayoutOption {
    private _zoomIn : boolean = false;
    private _donutChart : boolean = true;
    private _bundleChart : boolean = true;
    canShowForceChart: boolean = false;
    canShowTreeMap: boolean = false;
    canShowSource: any;
    constructor(){
        this.canZoomIn = false;
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