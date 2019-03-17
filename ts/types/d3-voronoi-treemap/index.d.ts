// Type definitions for D3JS d3-voronoi module 1.1
// Project: https://github.com/d3/d3-voronoi/, https://d3js.org/d3-voronoi
// Definitions by: Tom Wanzek <https://github.com/tomwanzek>
//                 Alex Ford <https://github.com/gustavderdrache>
//                 Boris Yankov <https://github.com/borisyankov>
//                 denisname <https://github.com/denisname>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3


// --------------------------------------------------------------------------
// voronoi Export
// --------------------------------------------------------------------------

/**
 * Creates a new Voronoi layout with default x- and y- accessors and a null extent.
 * x- and y-accessors may have to be set to correspond to the data type provided by the
 * generic.
 *
 * The generic refers to the type of the data for the corresponding element.
 * Without specifying a generic the layout is assumed to be based on data represented
 * by a two-dimensional coordinate `[number, number]` for x- and y-coordinate, respectively.
 */
export function voronoiTreemap<T = [number, number]>(): any;
