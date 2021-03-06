(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-polygon'), require('d3-weighted-voronoi')) : typeof define === 'function' && define.amd ? define(['exports', 'd3-polygon', 'd3-weighted-voronoi'], factory) : (factory((global.d3 = global.d3 || {}), global.d3, global.d3));
}(this, function(exports, d3Polygon, d3WeightedVoronoi) {
    'use strict';

    function FlickeringMitigation() {
        this.growthChangesLength = DEFAULT_LENGTH;
        this.totalAvailableArea = NaN;
        this.lastAreaError = NaN;
        this.lastGrowth = NaN;
        this.growthChanges = [];
        this.growthChangeWeights = generateGrowthChangeWeights(this.growthChangesLength);
        this.growthChangeWeightsSum = computeGrowthChangeWeightsSum(this.growthChangeWeights);
    }
    var DEFAULT_LENGTH = 10;

    function direction(h0, h1) {
        return (h0 >= h1) ? 1 : -1;
    }

    function generateGrowthChangeWeights(length) {
        var initialWeight = 3;
        var weightDecrement = 1;
        var minWeight = 1;
        var weightedCount = initialWeight;
        var growthChangeWeights = [];
        for (var i = 0; i < length; i++) {
            growthChangeWeights.push(weightedCount);
            weightedCount -= weightDecrement;
            if (weightedCount < minWeight) {
                weightedCount = minWeight;
            }
        }
        return growthChangeWeights;
    }

    function computeGrowthChangeWeightsSum(growthChangeWeights) {
        var growthChangeWeightsSum = 0;
        for (var i = 0; i < growthChangeWeights.length; i++) {
            growthChangeWeightsSum += growthChangeWeights[i];
        }
        return growthChangeWeightsSum;
    }
    FlickeringMitigation.prototype.reset = function() {
        this.lastAreaError = NaN;
        this.lastGrowth = NaN;
        this.growthChanges = [];
        this.growthChangesLength = DEFAULT_LENGTH;
        this.growthChangeWeights = generateGrowthChangeWeights(this.growthChangesLength);
        this.growthChangeWeightsSum = computeGrowthChangeWeightsSum(this.growthChangeWeights);
        this.totalAvailableArea = NaN;
        return this;
    };
    FlickeringMitigation.prototype.clear = function() {
        this.lastAreaError = NaN;
        this.lastGrowth = NaN;
        this.growthChanges = [];
        return this;
    };
    FlickeringMitigation.prototype.length = function(_) {
        if (!arguments.length) {
            return this.growthChangesLength;
        }
        if (parseInt(_) > 0) {
            this.growthChangesLength = Math.floor(parseInt(_));
            this.growthChangeWeights = generateGrowthChangeWeights(this.growthChangesLength);
            this.growthChangeWeightsSum = computeGrowthChangeWeightsSum(this.growthChangeWeights);
        } else {
            console.warn("FlickeringMitigation.length() accepts only positive integers; unable to handle " + _);
        }
        return this;
    };
    FlickeringMitigation.prototype.totalArea = function(_) {
        if (!arguments.length) {
            return this.totalAvailableArea;
        }
        if (parseFloat(_) > 0) {
            this.totalAvailableArea = parseFloat(_);
        } else {
            console.warn("FlickeringMitigation.totalArea() accepts only positive numbers; unable to handle " + _);
        }
        return this;
    };
    FlickeringMitigation.prototype.add = function(areaError) {
        var secondToLastAreaError, secondToLastGrowth;
        secondToLastAreaError = this.lastAreaError;
        this.lastAreaError = areaError;
        if (!isNaN(secondToLastAreaError)) {
            secondToLastGrowth = this.lastGrowth;
            this.lastGrowth = direction(this.lastAreaError, secondToLastAreaError);
        }
        if (!isNaN(secondToLastGrowth)) {
            this.growthChanges.unshift(this.lastGrowth != secondToLastGrowth);
        }
        if (this.growthChanges.length > this.growthChangesLength) {
            this.growthChanges.pop();
        }
        return this;
    };
    FlickeringMitigation.prototype.ratio = function() {
        var weightedChangeCount = 0;
        var ratio;
        if (this.growthChanges.length < this.growthChangesLength) {
            return 0;
        }
        if (this.lastAreaError > this.totalAvailableArea / 10) {
            return 0;
        }
        for (var i = 0; i < this.growthChangesLength; i++) {
            if (this.growthChanges[i]) {
                weightedChangeCount += this.growthChangeWeights[i];
            }
        }
        ratio = weightedChangeCount / this.growthChangeWeightsSum;
        if (ratio > 0) {
            // console.log("flickering mitigation ratio: " + Math.floor(ratio * 1000) / 1000);
        }
        return ratio;
    };

    function randomInitialPosition() {
        var clippingPolygon, extent, minX, maxX, minY, maxY, dx, dy;

        function _random(d, i, arr, voronoiMap) {
            console.log("data is ",voronoiMap);
            var shouldUpdateInternals = false;
            var x, y;
            if (clippingPolygon !== voronoiMap.clip()) {
                clippingPolygon = voronoiMap.clip();
                extent = voronoiMap.extent();
                shouldUpdateInternals = true;
            }
            if (shouldUpdateInternals) {
                updateInternals();
            }
            var xprng = voronoiMap.prng()();
            //  xprng = 1;
            var yprng = voronoiMap.prng()();
            //  yprng = 0.6333;
            x = minX + dx * xprng;
            y = minY + dy * yprng;
            while (!d3Polygon.polygonContains(clippingPolygon, [x, y])) {
                x = minX + dx * voronoiMap.prng()();
                y = minY + dy * voronoiMap.prng()();
            }
            return [x, y];
        };

        function updateInternals() {
            minX = extent[0][0];
            maxX = extent[1][0];
            minY = extent[0][1];
            maxY = extent[1][1];
            dx = maxX - minX;
            dy = maxY - minY;
        };
        return _random;
    };

    function pie() {
        var startAngle = 90;
        var clippingPolygon, dataArray, dataArrayLength, clippingPolygonCentroid, halfIncircleRadius, angleBetweenData;

        function _pie(d, i, arr, voronoiMap) {
            var shouldUpdateInternals = false;
            if (clippingPolygon !== voronoiMap.clip()) {
                clippingPolygon = voronoiMap.clip();
                shouldUpdateInternals |= true;
            }
            if (dataArray !== arr) {
                dataArray = arr;
                shouldUpdateInternals |= true;
            }
            if (shouldUpdateInternals) {
                updateInternals();
            }
            return [clippingPolygonCentroid[0] + Math.cos(startAngle + i * angleBetweenData) * halfIncircleRadius + (voronoiMap.prng()() - 0.5) * 1E-3, clippingPolygonCentroid[1] + Math.sin(startAngle + i * angleBetweenData) * halfIncircleRadius + (voronoiMap.prng()() - 0.5) * 1E-3];
        };
        _pie.startAngle = function(_) {
            if (!arguments.length) {
                return startAngle;
            }
            startAngle = _;
            return _pie;
        };

        function updateInternals() {
            clippingPolygonCentroid = d3Polygon.polygonCentroid(clippingPolygon);
            halfIncircleRadius = computeMinDistFromEdges(clippingPolygonCentroid, clippingPolygon) / 2;
            dataArrayLength = dataArray.length;
            angleBetweenData = 2 * Math.PI / dataArrayLength;
        };

        function computeMinDistFromEdges(vertex, clippingPolygon) {
            var minDistFromEdges = Infinity,
                edgeIndex = 0,
                edgeVertex0 = clippingPolygon[clippingPolygon.length - 1],
                edgeVertex1 = clippingPolygon[edgeIndex];
            var distFromCurrentEdge;
            while (edgeIndex < clippingPolygon.length) {
                distFromCurrentEdge = vDistance(vertex, edgeVertex0, edgeVertex1);
                if (distFromCurrentEdge < minDistFromEdges) {
                    minDistFromEdges = distFromCurrentEdge;
                }
                edgeIndex++;
                edgeVertex0 = edgeVertex1;
                edgeVertex1 = clippingPolygon[edgeIndex];
            }
            return minDistFromEdges;
        }

        function vDistance(vertex, edgeVertex0, edgeVertex1) {
            var x = vertex[0],
                y = vertex[1],
                x1 = edgeVertex0[0],
                y1 = edgeVertex0[1],
                x2 = edgeVertex1[0],
                y2 = edgeVertex1[1];
            var A = x - x1,
                B = y - y1,
                C = x2 - x1,
                D = y2 - y1;
            var dot = A * C + B * D;
            var len_sq = C * C + D * D;
            var param = -1;
            if (len_sq != 0)
                param = dot / len_sq;
            var xx, yy;
            if (param < 0) {
                xx = x1;
                yy = y1;
            } else if (param > 1) {
                xx = x2;
                yy = y2;
            } else {
                xx = x1 + param * C;
                yy = y1 + param * D;
            }
            var dx = x - xx;
            var dy = y - yy;
            return Math.sqrt(dx * dx + dy * dy);
        }
        return _pie;
    }

    function halfAverageAreaInitialWeight() {
        var clippingPolygon, dataArray, siteCount, totalArea, halfAverageArea;

        function _halfAverageArea(d, i, arr, voronoiMap) {
            var shouldUpdateInternals = false;
            if (clippingPolygon !== voronoiMap.clip()) {
                clippingPolygon = voronoiMap.clip();
                shouldUpdateInternals |= true;
            }
            if (dataArray !== arr) {
                dataArray = arr;
                shouldUpdateInternals |= true;
            }
            if (shouldUpdateInternals) {
                updateInternals();
            }
            return halfAverageArea;
        };

        function updateInternals() {
            siteCount = dataArray.length;
            totalArea = d3Polygon.polygonArea(clippingPolygon);
            halfAverageArea = totalArea / siteCount / 2;
        }
        return _halfAverageArea;
    };
    function getDefaultValue(){
        return 0.5;
    }
    function voronoiMap() {
        var DEFAULT_CONVERGENCE_RATIO = 0.01;
        var DEFAULT_MAX_ITERATION_COUNT = 50;
        var DEFAULT_MIN_WEIGHT_RATIO = 0.01;
        var DEFAULT_PRNG = getDefaultValue;
        // var DEFAULT_PRNG = Math.random;
        var DEFAULT_INITIAL_POSITION = pie();
        // var DEFAULT_INITIAL_POSITION = randomInitialPosition();
        var DEFAULT_INITIAL_WEIGHT = halfAverageAreaInitialWeight();
        var RANDOM_INITIAL_POSITION = randomInitialPosition();
        // var RANDOM_INITIAL_POSITION = randomInitialPosition();
        var epsilon = 1;
        var weight = function(d) {
            return d.weight;
        };
        var convergenceRatio = DEFAULT_CONVERGENCE_RATIO;
        var maxIterationCount = DEFAULT_MAX_ITERATION_COUNT;
        var minWeightRatio = DEFAULT_MIN_WEIGHT_RATIO;
        var prng = DEFAULT_PRNG;
        var initialPosition = DEFAULT_INITIAL_POSITION;
        var initialWeight = DEFAULT_INITIAL_WEIGHT;
        var tick = function(polygons, i) {
            return true;
        };
        var weightedVoronoi = d3WeightedVoronoi.weightedVoronoi();
        var siteCount, totalArea, areaErrorTreshold, flickeringMitigation = new FlickeringMitigation();
        var handleOverweightedVariant = 1;
        var handleOverweighted;

        function sqr(d) {
            return Math.pow(d, 2);
        }

        function squaredDistance(s0, s1) {
            return sqr(s1.x - s0.x) + sqr(s1.y - s0.y);
        }

        function _voronoiMap(data) {
            setHandleOverweighted();
            siteCount = data.length;
            (totalArea = Math.abs(d3Polygon.polygonArea(weightedVoronoi.clip()))), (areaErrorTreshold = convergenceRatio * totalArea);
            flickeringMitigation.clear().totalArea(totalArea);
            var iterationCount = 0,
                polygons = initialize(data),
                converged = false;
            var areaError;
            tick(polygons, iterationCount);
            while (!(converged || iterationCount >= maxIterationCount)) {
                polygons = adapt(polygons, flickeringMitigation.ratio());
                iterationCount++;
                areaError = computeAreaError(polygons);
                flickeringMitigation.add(areaError);
                converged = areaError < areaErrorTreshold;
                tick(polygons, iterationCount);
            }
            return {
                polygons: polygons,
                iterationCount: iterationCount,
                convergenceRatio: areaError / totalArea
            };
        }
        _voronoiMap.weight = function(_) {
            if (!arguments.length) {
                return weight;
            }
            weight = _;
            return _voronoiMap;
        };
        _voronoiMap.convergenceRatio = function(_) {
            if (!arguments.length) {
                return convergenceRatio;
            }
            convergenceRatio = _;
            return _voronoiMap;
        };
        _voronoiMap.maxIterationCount = function(_) {
            if (!arguments.length) {
                return maxIterationCount;
            }
            maxIterationCount = _;
            return _voronoiMap;
        };
        _voronoiMap.minWeightRatio = function(_) {
            if (!arguments.length) {
                return minWeightRatio;
            }
            minWeightRatio = _;
            return _voronoiMap;
        };
        _voronoiMap.tick = function(_) {
            if (!arguments.length) {
                return tick;
            }
            tick = _;
            return _voronoiMap;
        };
        _voronoiMap.clip = function(_) {
            if (!arguments.length) {
                return weightedVoronoi.clip();
            }
            weightedVoronoi.clip(_);
            return _voronoiMap;
        };
        _voronoiMap.extent = function(_) {
            if (!arguments.length) {
                return weightedVoronoi.extent();
            }
            weightedVoronoi.extent(_);
            return _voronoiMap;
        };
        _voronoiMap.size = function(_) {
            if (!arguments.length) {
                return weightedVoronoi.size();
            }
            weightedVoronoi.size(_);
            return _voronoiMap;
        };
        _voronoiMap.prng = function(_) {
            if (!arguments.length) {
                return prng;
            }
            prng = _;
            return _voronoiMap;
        };
        _voronoiMap.initialPosition = function(_) {
            if (!arguments.length) {
                return initialPosition;
            }
            initialPosition = _;
            return _voronoiMap;
        };
        _voronoiMap.initialWeight = function(_) {
            if (!arguments.length) {
                return initialWeight;
            }
            initialWeight = _;
            return _voronoiMap;
        };

        function adapt(polygons, flickeringMitigationRatio) {
            var adaptedMapPoints;
            adaptPositions(polygons, flickeringMitigationRatio);
            adaptedMapPoints = polygons.map(function(p) {
                return p.site.originalObject;
            });
            polygons = weightedVoronoi(adaptedMapPoints);
            if (polygons.length < siteCount) {
                console.log('at least 1 site has no area, which is not supposed to arise');
                debugger;
            }
            adaptWeights(polygons, flickeringMitigationRatio);
            adaptedMapPoints = polygons.map(function(p) {
                return p.site.originalObject;
            });
            polygons = weightedVoronoi(adaptedMapPoints);
            if (polygons.length < siteCount) {
                console.log('at least 1 site has no area, which is not supposed to arise');
                debugger;
            }
            return polygons;
        }

        function adaptPositions(polygons, flickeringMitigationRatio) {
            var newMapPoints = [],
                flickeringInfluence = 0.5;
            var flickeringMitigation, d, polygon, mapPoint, centroid, dx, dy;
            flickeringMitigation = flickeringInfluence * flickeringMitigationRatio;
            d = 1 - flickeringMitigation;
            for (var i = 0; i < siteCount; i++) {
                polygon = polygons[i];
                mapPoint = polygon.site.originalObject;
                centroid = d3Polygon.polygonCentroid(polygon);
                dx = centroid[0] - mapPoint.x;
                dy = centroid[1] - mapPoint.y;
                dx *= d;
                dy *= d;
                mapPoint.x += dx;
                mapPoint.y += dy;
                newMapPoints.push(mapPoint);
            }
            handleOverweighted(newMapPoints);
        }

        function adaptWeights(polygons, flickeringMitigationRatio) {
            var newMapPoints = [],
                flickeringInfluence = 0.1;
            var flickeringMitigation, polygon, mapPoint, currentArea, adaptRatio, adaptedWeight;
            flickeringMitigation = flickeringInfluence * flickeringMitigationRatio;
            for (var i = 0; i < siteCount; i++) {
                polygon = polygons[i];
                mapPoint = polygon.site.originalObject;
                currentArea = d3Polygon.polygonArea(polygon);
                adaptRatio = mapPoint.targetedArea / currentArea;
                adaptRatio = Math.max(adaptRatio, 1 - flickeringInfluence + flickeringMitigation);
                adaptRatio = Math.min(adaptRatio, 1 + flickeringInfluence - flickeringMitigation);
                adaptedWeight = mapPoint.weight * adaptRatio;
                adaptedWeight = Math.max(adaptedWeight, epsilon);
                mapPoint.weight = adaptedWeight;
                newMapPoints.push(mapPoint);
            }
            handleOverweighted(newMapPoints);
        }

        function handleOverweighted0(mapPoints) {
            var fixCount = 0;
            var fixApplied, tpi, tpj, weightest, lightest, sqrD, adaptedWeight;
            do {
                fixApplied = false;
                for (var i = 0; i < siteCount; i++) {
                    tpi = mapPoints[i];
                    for (var j = i + 1; j < siteCount; j++) {
                        tpj = mapPoints[j];
                        if (tpi.weight > tpj.weight) {
                            weightest = tpi;
                            lightest = tpj;
                        } else {
                            weightest = tpj;
                            lightest = tpi;
                        }
                        sqrD = squaredDistance(tpi, tpj);
                        if (sqrD < weightest.weight - lightest.weight) {
                            adaptedWeight = sqrD + lightest.weight / 2;
                            adaptedWeight = Math.max(adaptedWeight, epsilon);
                            weightest.weight = adaptedWeight;
                            fixApplied = true;
                            fixCount++;
                            break;
                        }
                    }
                    if (fixApplied) {
                        break;
                    }
                }
            } while (fixApplied);
        }

        function handleOverweighted1(mapPoints) {
            var fixCount = 0;
            var fixApplied, tpi, tpj, weightest, lightest, sqrD, overweight;
            do {
                fixApplied = false;
                for (var i = 0; i < siteCount; i++) {
                    tpi = mapPoints[i];
                    for (var j = i + 1; j < siteCount; j++) {
                        tpj = mapPoints[j];
                        if (tpi.weight > tpj.weight) {
                            weightest = tpi;
                            lightest = tpj;
                        } else {
                            weightest = tpj;
                            lightest = tpi;
                        }
                        sqrD = squaredDistance(tpi, tpj);
                        if (sqrD < weightest.weight - lightest.weight) {
                            overweight = weightest.weight - lightest.weight - sqrD;
                            lightest.weight += overweight + epsilon;
                            fixApplied = true;
                            fixCount++;
                            break;
                        }
                    }
                    if (fixApplied) {
                        break;
                    }
                }
            } while (fixApplied);
        }

        function computeAreaError(polygons) {
            var areaErrorSum = 0;
            var polygon, mapPoint, currentArea;
            for (var i = 0; i < siteCount; i++) {
                polygon = polygons[i];
                mapPoint = polygon.site.originalObject;
                currentArea = d3Polygon.polygonArea(polygon);
                areaErrorSum += Math.abs(mapPoint.targetedArea - currentArea);
            }
            return areaErrorSum;
        }

        function setHandleOverweighted() {
            switch (handleOverweightedVariant) {
                case 0:
                    handleOverweighted = handleOverweighted0;
                    break;
                case 1:
                    handleOverweighted = handleOverweighted1;
                    break;
                default:
                    console.log("Variant of 'handleOverweighted' is unknown");
            }
        }

        function initialize(data) {
            var maxWeight = data.reduce(function(max, d) {
                    return Math.max(max, weight(d));
                }, -Infinity),
                minAllowedWeight = maxWeight * minWeightRatio;
            var weights, mapPoints;
            weights = data.map(function(d, i, arr) {
                return {
                    index: i,
                    weight: Math.max(weight(d), minAllowedWeight),
                    initialPosition: initialPosition(d, i, arr, _voronoiMap),
                    initialWeight: initialWeight(d, i, arr, _voronoiMap),
                    originalData: d
                };
            });
            mapPoints = createMapPoints(weights);
            return weightedVoronoi(mapPoints);
        }

        function createMapPoints(basePoints) {
            var totalWeight = basePoints.reduce(function(acc, bp) {
                return (acc += bp.weight);
            }, 0);
            var initialPosition;
            return basePoints.map(function(bp, i, bps) {
                initialPosition = bp.initialPosition;
                if (!d3Polygon.polygonContains(weightedVoronoi.clip(), initialPosition)) {
                    initialPosition = RANDOM_INITIAL_POSITION(bp, i, bps, _voronoiMap);
                }
                return {
                    index: bp.index,
                    targetedArea: totalArea * bp.weight / totalWeight,
                    data: bp,
                    x: initialPosition[0],
                    y: initialPosition[1],
                    weight: bp.initialWeight
                };
            });
        }
        return _voronoiMap;
    }
    exports.voronoiMap = voronoiMap;
    exports.voronoiMapInitialPositionRandom = randomInitialPosition;
    exports.voronoiMapInitialPositionPie = pie;
    Object.defineProperty(exports, '__esModule', {
        value: true
    });
}));