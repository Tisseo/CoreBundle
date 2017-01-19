define(['jquery', 'leaflet', 'turf'], function ($, L, turf) {

    /**************************************************************************
     *************************** CONFIGURATION *********************************
     **************************************************************************/

    var mapConf = {
        DEFAULT_ZOOM: 14,
        MIN_ZOOM: 10,
        MAX_ZOOM: 18,
        //MAX_NATIVE_ZOOM: 18,
        MAP_CENTER: [43.604, 1.444],
        MAP_BOUNDS: [[43.25, 0.8], [44.0, 2.2]],
        WMTS_BG_URL: "http://{s}.tisseo-ru.fr/wmts/c/g/{z}/{x}/{y}.png",
        ROUTE_COLOR: "#3d91cf",
        ROUTE_WEIGHT: 7,
        ROUTE_OPACITY: 1,
        DEFAULT_LBL_CLASS: "text-marker",
        COLORS:  {
            OUTER: '#3d91cf',
            OUTLINE: '#357bad',
            INNER: '#fff'
        }
    };

    /**************************************************************************
     *************************** GLOBAL VARIABLES ******************************
     **************************************************************************/


    var map; //leaflet map object - get initialized in 'init_map' method

    /**************************************************************************
     *************************** INITIALISATION ********************************
     **************************************************************************/

    /**
     * initialize the map and then insert all the stops markers
     *
     * @params: * stops -> JSON array of stop objects
     *          * routeOnPopupClick -> BOOLEAN - if set to TRUE, each stop's popup
     *             will be clickable in order to redirect to the stop's edit view
     **/
    init_map_with_stops = function (stops, routeOnPopupClick) {
        if ($('#leaflet-map-container').length < 1)
            return;
        init_map();
        var stopIcon = new L.icon({iconUrl: stop_icon_pin_url, iconSize: [25, 41], popupAnchor: [0, -25]});
        var stopMarkers = addStopMarkers(stops, stopIcon, routeOnPopupClick);
        centerMapOnMarkers(stopMarkers);
    };

    /**
     * initialize the map, insert all the stops markers and draws the routes
     *
     * @params: * routeStops -> an ordered JSON array of stop objects, with route geometry
     *          * shouldDrawRoute -> BOOLEAN - if set to FALSE, routes won't be drawn
     **/
    init_map_with_route_stops = function (routeStops, shouldDrawRoutes) {
        if ($('#leaflet-map-container').length < 1){
            return;
        }

        init_map();

        if (shouldDrawRoutes) {
            drawRoutes(routeStops);
        }
        drawStopsOnMap(routeStops, true, true);
    };

    /**
     *
     * initialize the map view
     *
     **/
    function init_map() {
        map = L.map('leaflet-map-container',
            {
                maxBounds: mapConf.MAP_BOUNDS,
                minZoom: mapConf.MIN_ZOOM,
                maxZoom: mapConf.MAX_ZOOM,
                //maxNativeZoom: mapConf.MAX_NATIVE_ZOOM,
                dragging: true
            });

        var tileLayer = L.tileLayer(mapConf.WMTS_BG_URL,
            {
                attribution: ""
                //tileSize: mapConf.TILE_SIZE
            });
        map.addLayer(tileLayer, true);
        map.setView(mapConf.MAP_CENTER, mapConf.DEFAULT_ZOOM);
    }

    /**************************************************************************
     *************************** STOP METHODS **********************************
     **************************************************************************/

    /**
     *
     * insert the stop stopMarkers in the map and bind them to their popups
     *
     * @params: * stops -> JSON array of stop objects
     *
     *          * routeOnPopupClick -> BOOLEAN - if set to TRUE, each stop's operator code will be clickable
     *            in the popup, and redirect to the stop's edit view
     **/
    function addStopMarkers(stops, stopIcon, routeOnPopupClick) {

        var stopMarkers = new Map();
        for (var i = 0; i < stops.length; i++) {
            var stop = stops[i];
            if (stop.x && stop.y && stop.code) {
                var marker = L.marker([stop.y, stop.x], {icon: stopIcon, riseOnHover: true})
                    .addTo(map)
                    .bindPopup(
                        createStopPopupContent(stop, routeOnPopupClick),
                        {closeButton: false}
                    );
                marker.on('mouseover', function (e) {
                    e.target.openPopup();
                });
                if (!routeOnPopupClick) {
                    marker.on('mouseout', function (e) {
                        e.target.closePopup();
                    });
                }
                stopMarkers.set(stop.id, marker);
            }
        }
        return stopMarkers;
    }

    /**
     *
     * @param leafletObject
     * @return {*}
     */
    function getPt (leafletObject){
        while (leafletObject instanceof L.LayerGroup){
            leafletObject = leafletObject.getLayers()[0];
            return leafletObject;
        }
        return leafletObject;
    }

    /**
     * Create a array of Leaflet Layers for each routeStop Rank
     * Draw them on the map
     *
     * @param stops
     * @param routeOnPopupClick
     * @param drawConvex
     * @returns Array
     */
    function drawStopsOnMap (stops, routeOnPopupClick, drawConvex){
        if(!stops.length){
            return;
        }

        var
            virtualMap = new Map(),
            singleStopPointsLayer = new L.FeatureGroup().addTo(map),
            markerLayer = new L.LayerGroup().addTo(map),
            odtAreaLayers = [],
            routePts = []
            ;

        stops.forEach(function (stop){
            var circleMarker = createCircleMarker(stop,routeOnPopupClick);

            if(stop.odt_area){
                if(!odtAreaLayers[stop.odt_area]){
                    odtAreaLayers[stop.odt_area] = new L.FeatureGroup().addTo(map);
                }
                circleMarker.addTo(odtAreaLayers[stop.odt_area]);
            }else{
                circleMarker.addTo(singleStopPointsLayer);
                routePts.push(circleMarker);
            }
            virtualMap.set(stop.id, circleMarker);
        });

        if(drawConvex && odtAreaLayers.length){
            odtAreaLayers.forEach(function (layer){
                if(layer.getLayers().length > 1 ){
                    var convexGeoJson = drawConvexHull(layer);
                }
                routePts.push(convexGeoJson || layer);
            });

            // Add zone with multiple Rank then sort by rank
            var itinerary = [];

            routePts
                .map(getPt)
                .forEach(function (pt, i, route){
                    var  _label = pt.options.rank;
                    if(pt.options.rank.split) {
                        var ranks = pt.options.rank.split('-');
                        if(ranks.length){
                            ranks.forEach(function (r){
                                var _pt = $.extend(true, {}, pt);
                                _pt.options['rankLabel'] = _label;
                                _pt.options['rank'] = parseInt(r);
                                itinerary.push(_pt);
                            });
                        }
                    }else{
                        itinerary.push(pt);
                    }
                });

            itinerary.sort(function (a,b){
                var
                    rankA = a.options.rank,
                    rankB = b.options.rank
                    ;
                return ( rankA - rankB );
            });

            drawRoutesConvexPolygons(itinerary);
        }

        centerMapOnMarkers(virtualMap);
    }

    /**
     * Use group of marker in a layer to draw a convexHull
     * @param layer
     */
    function drawConvexHull(layer){
        if (!(layer && turf)){
            return;
        }

        var layerGeoJSON = layer.toGeoJSON(),
            convexGeometry = turf.convex(layerGeoJSON),
            shade = layer.getLayers()[0].options.color,
            rank = layer.getLayers()[0].options.rank,
            turfBuffer,
            convexGeoJson;

        var convexStyle = {
            color:  shade || "#000000",
            opacity: 1,
            weight: 2,
            fillOpacity:.05,
            fillColor: shade,
            rank:rank
        };

        var params = {
            distance : .1,
            unit: 'miles'
        };

        if(convexGeometry){
            turfBuffer = turf.buffer(convexGeometry, params.distance, params.unit);
            convexGeoJson = L.geoJson(turfBuffer,convexStyle);
            convexGeoJson.addTo(layer);
        }else{
            if(layer.getLayers().length  == 2){
                convexGeoJson = simulateConvex(layer, params, convexStyle);
            }
        }

        layer.bringToBack();

        return convexGeoJson;
    }

    /**
     * Create an envelop between 2 points
     *
     * @param layer
     * @param params
     * @param style
     */
    function simulateConvex (layer, params, style){

        var LineLayer = new L.LayerGroup(),
            pts = [];

        layer.eachLayer(function (l){
            pts.push(l.getLatLng());
        });

        var line = new L.Polyline(pts),
            envelop = new turf.buffer(line.toGeoJSON(), params.distance, params.unit),
            convexGeoJson = L.geoJson(envelop, style);

        convexGeoJson.addTo(layer);
        LineLayer.addTo(layer);

        return convexGeoJson;

    }

    /**
     * Draw a route Line between Convex Layer
     * following their centers
     *
     * @param layer
     */
    function drawRoutesConvexPolygons (routePts){

        if(!routePts.length){
            return;
        }

        var
            centerPts = [],
            routeLayer = new L.FeatureGroup(),
            centerMarkerLayer = new L.LayerGroup(),
            route
            ;

        //Create number Labels
        var addLabel = function(labelClass,labelText) {
            return L.divIcon({
                className: labelClass || mapConf.DEFAULT_LBL_CLASS,
                html: labelText
            });
        };

        routePts.forEach(function (polygon){
            var center = polygon.getBounds().getCenter();
            if(center){
                var routeStyle = {
                    radius: 10,
                    color: mapConf.COLORS.OUTLINE,
                    weight:mapConf.ROUTE_WEIGHT/2,
                    opacity: 1,
                    fillOpacity: 1
                };

                var
                    centerMarker,
                    rankText,
                    textMarker
                    ;

                rankText = polygon.options.rankLabel || polygon.options.rank;
                textMarker  = L.marker(center, {icon: addLabel(null,rankText)});
                textMarker.addTo(centerMarkerLayer);
                centerPts.push(center);
            }
            route = L.polyline(centerPts,routeStyle);
            route.addTo(routeLayer);
            centerMarkerLayer.addTo(routeLayer);
            routeLayer.addTo(map);
        });

    }

    /**
     * Create a single Circle Marker from a stopPoint
     * @param stop
     * @param routeOnPopupClick
     */
    function createCircleMarker(stop, routeOnPopupClick, customStyle){

        if(!(stop && (stop.x || stop.y || stop.shade ))){
            return;
        }


        var shade = 1- stop.shade;

        var style = customStyle ||
            {
                radius: 8,
                fillColor: '#fff',
                color: lighterDarkerColor(mapConf.COLORS.OUTER, shade),
                weight: 8,
                opacity: 1,
                fillOpacity: 1,
                shadowSize:[1,1],
                rank: stop.rank
            };

        var markerBorder = L.circleMarker([stop.y, stop.x], style);
        markerBorder.bindPopup(createStopPopupContent(stop, routeOnPopupClick), {closeButton: false});

        markerBorder.bindPopup(
            createStopPopupContent(stop, routeOnPopupClick),
            {closeButton: false}
        );

        markerBorder.on('mouseover', function (e) {
            e.target.openPopup();
        });

        if (!routeOnPopupClick) {
            markerBorder.on('mouseout', function (e) {
                e.target.closePopup();
            });
        }

        return markerBorder;
    }

    /**
     *
     * Set the map view so that all stop markers are contained in it, with the highest possible zoom level
     *
     * Uses global variable 'stopMarkers'
     *
     **/
    function centerMapOnMarkers(stopMarkers) {
        var latLngArray = [];
        for (var marker of stopMarkers.values()) {
            latLngArray.push(marker.getLatLng());
        }
        if (latLngArray.length > 0) {
            map.fitBounds(L.latLngBounds(latLngArray));
        }
    }

    /**
     *
     * Creates a stop popup
     *
     * @params: * stop => the JSON stop object to use to create the popup
     *          * routeOnPopupClick => BOOLEAN - If set to TRUE, the popup's text will be clickable to redirect to the stop edit view
     *
     **/
    function createStopPopupContent(stop, routeOnPopupClick) {
        var content;
        if (routeOnPopupClick && stop.route) {
            content = '<a class="leaflet-stop-popup" target="_blank" href="' + stop.route + '">' + stop.name + ' (' + stop.code + ')</a>';
        }
        else {
            content = '<span class="leaflet-stop-popup">' + stop.name + ' (' + stop.code + ')</span>';
        }
        return content;
    }

    /**************************************************************************
     *************************** ROUTE METHODS *********************************
     **************************************************************************/

    /**
     *
     * Draws routes
     *
     * @params: * routeStops => an ordered json array of routeStops (stops with their route geometry)
     *          * routeOnPopupClick => BOOLEAN - If set to TRUE, the popup's text will be clickable to redirect to the stop edit view
     *
     **/
    function drawRoutes(routeStops) {

        var LineLayer = new L.LayerGroup();

        for (var i = 0; i < routeStops.length; i++) {
            var routeStop = routeStops[i];
            var routeStyle = {
                "color": lighterDarkerColor(mapConf.COLORS.OUTER, 1- routeStops[i].shade),
                "weight": mapConf.ROUTE_WEIGHT,
                "opacity": mapConf.ROUTE_OPACITY
            };
            if (routeStop.geom) {
                L.geoJson(jQuery.parseJSON(routeStop.geom), {
                    style: routeStyle
                })
                    .addTo(LineLayer);
            }
            else if (i + 1 < routeStops.length) {
                var nextRouteStop = routeStops[i + 1];
                var coordsStart = L.latLng(routeStop.y, routeStop.x);
                var coordsEnd = L.latLng(nextRouteStop.y, nextRouteStop.x);
                var coords = [coordsStart, coordsEnd];
                L.polyline(coords, routeStyle).addTo(LineLayer);
            }
        }

        LineLayer.addTo(map);
    }

    /**
     * Take a color and play with its luminance
     */
    function lighterDarkerColor(hex, lum) {
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }

        return rgb;
    }

});
