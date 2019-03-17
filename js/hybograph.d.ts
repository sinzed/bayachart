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
    packageImports(nodes: any): any[];
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
    constructor();
    initData(): void;
    computeCirclingPolygon(radius: number): number[][];
    initLayout(rootData: any): void;
    drawTitle(): void;
    drawFooter(): void;
    drawLegends(rootData: {
        children: {
            reverse: () => Array<any>;
        };
    }): void;
    drawTreemap(hierarchy: any): void;
}
declare var diameter: number, radius: number, innerRadius: number;
declare var cluster: d3.ClusterLayout<any>;
declare let tools: Tools;
declare let voronoiDiagram: Voronoi;
declare var line: d3.Line<[number, number]>;
