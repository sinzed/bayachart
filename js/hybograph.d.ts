declare var spoonData: {
    "hybrograph": {
        "name": string;
        "children": {
            "name": string;
            "children": {
                "name": string;
                "weight": number;
                "text": string;
            }[];
        }[];
    };
};
declare var graphsData: {
    "hybrograph": {
        "name": string;
        "imports": never[];
        "children": ({
            "name": string;
            "imports": never[];
            "text": string;
            "children": ({
                "name": string;
                "weight": number;
                "code": string;
                "imports": never[];
                "targets": string[];
                "text": string;
            } | {
                "name": string;
                "weight": number;
                "code": string;
                "imports"?: undefined;
                "targets"?: undefined;
                "text"?: undefined;
            } | {
                "name": string;
                "weight": number;
                "code": string;
                "imports": never[];
                "targets"?: undefined;
                "text"?: undefined;
            })[];
        } | {
            "name": string;
            "imports": string[];
            "children": ({
                "name": string;
                "weight": number;
                "code": string;
                "cs": {
                    "GodClass": number;
                    "UnusedImport": number;
                    "warnings": number;
                    "errors": number;
                };
                "imports"?: undefined;
            } | {
                "name": string;
                "weight": number;
                "code": string;
                "imports": string[];
                "cs"?: undefined;
            } | {
                "name": string;
                "weight": number;
                "code": string;
                "cs"?: undefined;
                "imports"?: undefined;
            })[];
            "text"?: undefined;
        } | {
            "name": string;
            "imports": never[];
            "children": ({
                "name": string;
                "weight": number;
                "code": string;
                "imports": string[];
                "text": string;
            } | {
                "name": string;
                "weight": number;
                "code": string;
                "imports"?: undefined;
                "text"?: undefined;
            })[];
            "text"?: undefined;
        } | {
            "name": string;
            "imports": never[];
            "children": ({
                "name": string;
                "weight": number;
                "code": string;
                "targets"?: undefined;
            } | {
                "name": string;
                "weight": number;
                "code": string;
                "targets": string[];
            })[];
            "text"?: undefined;
        })[];
    };
    "controllers": {
        "name": string;
        "imports": never[];
        "children": ({
            "name": string;
            "imports": never[];
            "children": ({
                "name": string;
                "code": string;
                "imports": never[];
                "source": string;
                "target": string;
                "color": string;
                "type": string;
                "children": {
                    "name": string;
                    "weight": number;
                    "code": string;
                    "imports": never[];
                    "color": string;
                    "type": string;
                }[];
                "weight"?: undefined;
            } | {
                "name": string;
                "code": string;
                "weight": number;
                "imports": never[];
                "color": string;
                "type": string;
                "children": ({
                    "name": string;
                    "weight": number;
                    "code": string;
                    "imports": never[];
                    "color": string;
                    "type": string;
                    "children"?: undefined;
                } | {
                    "name": string;
                    "weight": number;
                    "code": string;
                    "imports": never[];
                    "color": string;
                    "type": string;
                    "children": ({
                        "name": string;
                        "weight": number;
                        "code": string;
                        "imports": never[];
                        "color": string;
                        "type": string;
                        "children"?: undefined;
                    } | {
                        "name": string;
                        "weight": number;
                        "code": string;
                        "imports": never[];
                        "color": string;
                        "type": string;
                        "children": ({
                            "name": string;
                            "weight": number;
                            "code": string;
                            "imports": never[];
                            "color": string;
                            "type": string;
                            "children": {
                                "name": string;
                                "weight": number;
                                "code": string;
                                "imports": never[];
                                "color": string;
                                "type": string;
                            }[];
                        } | {
                            "name": string;
                            "weight": number;
                            "code": string;
                            "imports": never[];
                            "color": string;
                            "type": string;
                            "children"?: undefined;
                        })[];
                    })[];
                })[];
                "source"?: undefined;
                "target"?: undefined;
            })[];
        } | {
            "name": string;
            "imports": string[];
            "children": {
                "name": string;
                "weight": number;
                "code": string;
                "cs": {
                    "GodClass": number;
                    "UnusedImport": number;
                };
                "type": string;
            }[];
        })[];
    };
    "providers": {
        "name": string;
        "imports": never[];
        "children": ({
            "name": string;
            "imports": never[];
            "targets": string[];
            "children": {
                "name": string;
                "weight": number;
                "code": string;
                "imports": never[];
                "type": string;
            }[];
        } | {
            "name": string;
            "imports": string[];
            "children": {
                "name": string;
                "weight": number;
                "code": string;
                "cs": {
                    "GodClass": number;
                    "UnusedImport": number;
                };
                "type": string;
            }[];
            "targets"?: undefined;
        } | {
            "name": string;
            "imports": never[];
            "children": ({
                "name": string;
                "weight": number;
                "code": string;
                "cs"?: undefined;
                "imports"?: undefined;
            } | {
                "name": string;
                "weight": number;
                "code": string;
                "cs": {
                    "GodClass": number;
                    "UnusedImport": number;
                    "warnings": number;
                    "features": number;
                    "points": number;
                };
                "imports"?: undefined;
            } | {
                "name": string;
                "weight": number;
                "code": string;
                "imports": string[];
                "cs"?: undefined;
            })[];
            "targets"?: undefined;
        })[];
    };
};
declare class Color {
    value: string;
    h: number;
    s: number;
    l: number;
    a: number;
    constructor(h: number, s: number, l: number, a?: number);
}
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
    getParent(): BayaChart;
    run(): void;
    unlink(): void;
    draw(rootData: any): false | undefined;
    radius(): number;
    initNode(): void;
    initNodeCells(): void;
    circleColour(d: any): "blue" | "pink";
    linkColour(d: any): string;
    linkColour2(d: any): string;
    drag_start(d: any): void;
    drag_drag(d: any): void;
    drag_end(d: any): void;
    initData(): void;
    buildLeavesWithParentName(): void;
    buildLinkData(): void;
    findMainSource(leaf: any): any;
    findMainTarget(target: any): any;
    followToFindleaf(hierarchy: any, target: string): any;
    findSourceMargin(leaf: any): {
        "x": number;
        "y": number;
    };
    findTargetMargin(leaf: any): {
        "x": number;
        "y": number;
    };
    addLink(mainSource: any, sourceMargin: any, mainTarget: any, targetMargin: any): void;
    tickActions(): void;
}
declare class JoinLink {
    element: any;
    parent: any;
    mainSource: any;
    mainTarget: any;
    centerMargin: any;
    source: any;
    target: any;
    centerMarginTarget: any;
    constructor(linkData: any);
    getParent(): any;
    setParent(parent: any): void;
    draw(): void;
    update(positionData: any): void;
}
declare class LayoutOption {
    private _zoomIn;
    private _donutChart;
    private _bundleChart;
    canShowForceChart: boolean;
    canShowTreeMap: boolean;
    canShowSource: any;
    constructor();
    canZoomIn: boolean;
    canShowBundleChart: boolean;
    canShowDonutChart: boolean;
}
declare class Layout {
    layoutOption: LayoutOption;
    bayaChart: BayaChart;
    zoomInBtn: any;
    showDonutChartBtn: any;
    showBundleChartBtn: any;
    element: any;
    graphic: any;
    showForceChartBtn: any;
    treemapBtn: any;
    sourceBtn: any;
    constructor(bayaChart: BayaChart);
    init(): void;
    initElement(): void;
    initZoom(): void;
    addTreemap(): any;
    addSourceBtn(): any;
    showSourceDialog(): void;
    addZoomInButton(): any;
    addForceChartButton(): any;
    addDonutChartButton(): any;
    addBundleChartButton(): any;
    toggleTreeMap(): void;
    toggleBundleChart(): void;
    toggleDonutChart(): void;
    toggleForceChart(): void;
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
    backgroundColor: string;
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
    cells: Array<any>;
    leaves: any;
    _canShowHoverer: boolean;
    canDrawlables: boolean;
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
    canShowHoverer(): boolean;
    drawHoverers(): void;
    showTreeMapBorders(enable: boolean): void;
    drawParents(): void;
    getColorByDepth(leaf: any): string;
    getWidthByDepth(leaf: any): string;
    buildColors(rootData: any, parentColor?: Color): any;
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
    colors: Array<Color>;
    constructor();
    init(): void;
    getParnet(): HybroChart;
    draw(rootData: any): void;
    buildColors(): void;
    getColor(): any;
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
    slices: any;
    slicesObject: any;
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
    buildData(leaves: Array<any>): any;
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
    constructor();
    draw(rootData: any): false | undefined;
}
declare class BayaChart extends Chart {
    hybroCharts: Array<HybroChart>;
    forceChart: ForceChart;
    jsonData: any;
    nodesData: Array<any>;
    svg: any;
    highlight: Highlight;
    layout: Layout;
    constructor();
    init(): void;
    initLayout(): void;
    delete(): void;
    draw(): void;
}
declare class Highlight {
    bayaChart: BayaChart;
    constructor(bayaChart: BayaChart);
    init(): void;
}
declare var diameter: number, radius: number, innerRadius: number;
declare let readDataByD3: boolean;
declare var cluster: d3.ClusterLayout<any>;
declare let bayaChart: BayaChart;
declare var textArea: HTMLElement | null;
