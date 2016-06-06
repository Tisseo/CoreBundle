define(['jquery', 'leaflet'], function($, L) {
    // default configuration for map
    var default_configuration = {
        DEFAULT_ZOOM: 14,
        MIN_ZOOM: 10,
        MAX_ZOOM: 18,
        MAP_CENTER : [43.604,1.444],
        MAP_BOUNDS: [[43.25, 0.8],[44.0, 2.2]],
        WMTS_BG_URL: "http://{s}.tisseo-ru.fr/wmts/c/g/{z}/{x}/{y}.png",
        ROUTE_COLOR: "#3d91cf",
        ROUTE_WEIGHT: 7,
        ROUTE_OPACITY: 1,
        DRAGGING: true,
        FORMAT: "image/png",
        ATTRIBUTION: "",
        LINE_WEIGHT: 5,
        LINE_OPACITY: 0.8
    };

    var map;

    var layers = {
        lineLayer: null,
        routeLayer: null,
        stopLayer: null
    };

    /**
     * Map initialization
     *
     * @param string container
     * @param object configuration
     */
    var init_map = function(container, configuration) {
        if (configuration) {
            default_configuration = $.extend(default_configuration, configuration);
        }

        map = L.map(container,
        {
            maxBounds: default_configuration.MAP_BOUNDS,
            minZoom: default_configuration.MIN_ZOOM,
            maxZoom: default_configuration.MAX_ZOOM,
            dragging: default_configuration.DRAGGING
        });

        // background layer
        var tileLayer = L.tileLayer(default_configuration.WMTS_BG_URL, {
            format: default_configuration.FORMAT,
            attribution: default_configuration.ATTRIBUTION
        });
        map.addLayer(tileLayer, true);
        map.setView(default_configuration.MAP_CENTER, default_configuration.DEFAULT_ZOOM);

        $.each(layers, function(idx, layer) {
            layer = L.featureGroup();
            layer.on('layeradd', function(e) {
                map.fitBounds(layer.getBounds());
            });
            map.addLayer(layer);
            layers[idx] = layer;
        });
    };

    var draw_line = function(line, geojson) {
        if (geojson) {
            layers.lineLayer.clearLayers().addLayer(
                L.geoJson(geojson, {color: '#'+line.color, weight: default_configuration.LINE_WEIGHT, opacity: default_configuration.LINE_OPACITY})
            );
        }
    };

    var reset_map = function() {
        $.each(layers, function(idx, layer) {
            layer.clearLayers();
        });
        map.setView(default_configuration.MAP_CENTER, default_configuration.DEFAULT_ZOOM);
    };

    return {
        init_map: init_map,
        draw_line: draw_line,
        reset_map: reset_map
    };
});
