declare class Chart {
    parent: any;
    enable: boolean;
    constructor();
    setParent(chart: Chart): void;
    getParent(): any;
    disable(): void;
}
declare class ForceChart extends Chart {
    link: any;
    node: any;
    svg: any;
    width: number;
    height: number;
    simulation: any;
    g: any;
    links_data: any;
    nodes_data: any;
    nodeCells: any;
    constructor();
    getParent(): HybroChart;
    draw(rootData: any): false | undefined;
    initNode(): void;
    initNodeCells(): void;
    initNode1(): void;
    /** Functions **/
    circleColour(d: any): "blue" | "pink";
    linkColour(d: any): "green" | "red";
    drag_start(d: any): void;
    drag_drag(d: any): void;
    drag_end(d: any): void;
    zoom_actions(): void;
    tickActions(): void;
    initData(): void;
}
declare class LayoutOption {
    private _zoomIn;
    private _donutChart;
    private _bundleChart;
    constructor();
    canZoomIn: boolean;
    canShowBundleChart: boolean;
    canShowDonutChart: boolean;
}
declare class Layout {
    layoutOption: LayoutOption;
    hybroChart: HybroChart;
    zoomInBtn: any;
    showDonutChartBtn: any;
    showBundleChartBtn: any;
    constructor(hybroChart: HybroChart);
    init(): void;
    addZoomInButton(): any;
    addDonutChartButton(): any;
    addBundleChartButton(): any;
    toggleBundleChart(): void;
    toggleDonutChart(): void;
    manageZoomIn(): void;
    zoom_actions(): void;
}
declare class Tools {
    constructor();
    compute2DPolygonCentroid(vertices: any): {
        x: number;
        y: number;
    };
    compute2DPolygonCentroidDebug(vertices: any): {
        x: number;
        y: number;
    };
    packageImports(nodes: any): any;
    packageHierarchy(classes: any): d3.HierarchyNode<any>;
}
declare class Voronoi extends Chart {
    _2PI: number;
    svgWidth: number;
    svgAreaHeight: number;
    svgHeight: number;
    margin: any;
    height: any;
    width: any;
    halfWidth: any;
    halfHeight: number;
    quarterWidth: number;
    quarterHeight: number;
    titleY: number;
    legendsMinY: number;
    treemapRadius: number;
    treemapCenter: any[];
    _voronoiTreemap: any;
    hierarchy: any;
    circlingPolygon: any;
    fontScale: any;
    svg: any;
    drawingArea: any;
    treemapContainer: any;
    canDrawLegends: boolean;
    canDrawTitle: boolean;
    canDrawFooter: boolean;
    constructor();
    initData(rootData: any): void;
    setMarginLeft(marginLeft: number): void;
    computeCirclingPolygon(radius: number): number[][];
    initLayout(rootData: any): void;
    drawTitle(): true | undefined;
    drawFooter(): true | undefined;
    drawLegends(rootData: {
        children: {
            reverse: () => Array<any>;
        };
    }): true | undefined;
    drawTreemap(): void;
    draw(rootData: any): void;
}
declare class BundleChart extends Chart {
    svg: any;
    linkElement: any;
    nodeElement: any;
    leaves: any;
    line: any;
    transTop: number;
    transLeft: number;
    element: any;
    constructor();
    init(): void;
    getParnet(): HybroChart;
    draw(rootData: any): void;
    drawNodeNames(): void;
    lineFunction(): void;
}
declare class DonutChart extends Chart {
    _height: any;
    _margin: any;
    _colour: any;
    _variable: any;
    _category: any;
    _padAngle: any;
    floatFormat: any;
    _cornerRadius: any | number;
    percentFormat: any | number;
    colorize: Function;
    _radius: any;
    _width: number;
    canDrawPipeLables: boolean;
    selection: any;
    element: any;
    constructor();
    getParent(): HybroChart;
    getWidth(): any;
    setWidth(value: any): DonutChart;
    setHeight(value: any): DonutChart;
    height(value: any): any;
    setMargin(value: any): this;
    getMargin(): any;
    setRadius(value: any): this;
    getRadius(): any;
    setPadAngle(value: any): this;
    getPadAngle(value: any): any;
    setCornerRadius(value: any): this;
    getCornerRadius(value: any): any;
    setColour(value: any): this;
    getColour(value: any): any;
    setVariable(value: any): this;
    getVariable(value: any): any;
    setCategory(value: any): this;
    getCategory(value: any): any;
    draw(leaves: any): void;
    chart(selection: any): void;
}
declare class HybroChart extends Chart {
    tools: Tools;
    voronoiChart: Voronoi;
    donutChart: DonutChart;
    bundleChart: BundleChart;
    svg: any;
    forceChart: ForceChart;
    private layout;
    constructor();
    init(): void;
    initLayout(): void;
    draw(rootData: any): false | undefined;
}
declare var diameter: number, radius: number, innerRadius: number;
declare var cluster: d3.ClusterLayout<any>;
declare let hybroChart2: HybroChart;
