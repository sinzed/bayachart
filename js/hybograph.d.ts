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
declare class Voronoi {
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
    initData(): void;
    computeCirclingPolygon(radius: number): number[][];
    initLayout(rootData: any): void;
    drawTitle(): true | undefined;
    drawFooter(): true | undefined;
    drawLegends(rootData: {
        children: {
            reverse: () => Array<any>;
        };
    }): true | undefined;
    drawTreemap(hierarchy: any): void;
}
declare class DonutChart {
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
    constructor();
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
    chart(selection: any): void;
}
declare var diameter: number, radius: number, innerRadius: number;
declare var cluster: d3.ClusterLayout<any>;
declare let tools: Tools;
declare let voronoiDiagram: Voronoi;
declare let donut: DonutChart;
declare var line: d3.Line<[number, number]>;
