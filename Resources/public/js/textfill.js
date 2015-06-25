define(['jquery'], function($) {
    textfill = function(min, max, container) {
        $(container).textfill({
            minFontPixels: min,
            maxFontPixels: max
        });
    };
});
