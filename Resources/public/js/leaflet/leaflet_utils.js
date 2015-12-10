define(['jquery', 'leaflet'], function($, L) {

/**************************************************************************
*************************** CONFIGURATION *********************************
**************************************************************************/

    var mapConf = {
        DEFAULT_ZOOM: 14,
        MIN_ZOOM: 10,
        MAX_ZOOM: 18,
        //MAX_NATIVE_ZOOM: 18,
        MAP_CENTER : [43.604,1.444],
        MAP_BOUNDS: [[43.25, 0.8],[44.0, 2.2]],
        WMTS_BG_URL: "http://{s}.tisseo-ru.fr/wmts/c/g/{z}/{x}/{y}.png",
        ROUTE_COLOR: "#3d91cf",
        ROUTE_WEIGHT: 7,
        ROUTE_OPACITY: 1
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
    init_map_with_stops = function(stops, routeOnPopupClick) {
        if ($('#leaflet-map-container').length < 1)
            return;
        init_map();
        var stopIcon = new L.icon({iconUrl:stop_icon_pin_url, iconSize:[25,41], popupAnchor:[0, -25]});
        var stopMarkers = addStopMarkers(stops, stopIcon, routeOnPopupClick);
        centerMapOnMarkers(stopMarkers);

    };

    /**
    * initialize the map, insert all the stops markers and draws the routes
    *
    * @params: * routeStops -> an ordered JSON array of stop objects, with route geometry
    *          * shouldDrawRoute -> BOOLEAN - if set to FALSE, routes won't be drawn
    **/
    init_map_with_route_stops = function(routeStops, shouldDrawRoutes) {
        if ($('#leaflet-map-container').length < 1)
            return;
        init_map();
        var stopIcon = new L.icon({iconUrl:stop_icon_circle_url, iconSize:[18,18], popupAnchor:[0, -15]});
        var stopMarkers = addStopMarkers(routeStops, stopIcon, true);
        if (shouldDrawRoutes) {
            drawRoutes(routeStops);
        }
        centerMapOnMarkers(stopMarkers);
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
            attribution: "",
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
        for (var i=0; i < stops.length; i++) {
            var stop = stops[i];
            if (stop.x && stop.y && stop.code) {
                var marker = L.marker([stop.y, stop.x], {icon: stopIcon, riseOnHover:true})
                    .addTo(map)
                    .bindPopup(
                        createStopPopupContent(stop, routeOnPopupClick),
                        {closeButton: false}
                    );
                marker.on('mouseover', function(e) {
                    e.target.openPopup();
                });
                if (!routeOnPopupClick) {
                    marker.on('mouseout', function(e) {
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
    * Set the map view so that all stop markers are contained in it, with the highest possible zoom level
    *
    * Uses global variable 'stopMarkers'
    *
    **/
    function centerMapOnMarkers(stopMarkers) {
        var latLngArray = [];
        for (var marker of stopMarkers.values())
        {
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
            content = '<a class="leaflet-stop-popup" target="_blank" href="'+stop.route+'">'+stop.code+'</a>';
        }
        else {
            content = '<span class="leaflet-stop-popup">'+stop.code+'</span>';
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
        var routeStyle= {
            "color": mapConf.ROUTE_COLOR,
            "weight": mapConf.ROUTE_WEIGHT,
            "opacity": mapConf.ROUTE_OPACITY
        };
        for (var i=0; i < routeStops.length; i++)
        {
            var routeStop = routeStops[i];
            if (routeStop.geom)
            {
                L.geoJson(jQuery.parseJSON(routeStop.geom), {
                    style: routeStyle
                }).addTo(map);
            }
            else if (i + 1 < routeStops.length)
            {
                var nextRouteStop = routeStops[i+1];
                var coordsStart = L.latLng(routeStop.y, routeStop.x);
                var coordsEnd = L.latLng(nextRouteStop.y, nextRouteStop.x);
                var coords = [coordsStart, coordsEnd];
                L.polyline(coords, routeStyle).addTo(map);
            }
        }
    }

});
