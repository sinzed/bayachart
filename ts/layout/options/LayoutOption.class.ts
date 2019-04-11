class LayoutOption {
    private _zoomIn : boolean = false;
    constructor(){
        this.canZoomIn = true;
    }
    get canZoomIn(){
        return this._zoomIn;
    }
    set canZoomIn(enable){
        this._zoomIn = enable;
    }

}