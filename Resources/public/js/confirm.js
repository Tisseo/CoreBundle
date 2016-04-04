define(['jquery', 'bootbox'], function($, bootbox) {
    /*
     * Managing the bootbox popup on a .confirm link.
     *
     * Expected HTML structure to make this script work
     * <a href='' class='confirm' data-message=''></a>
     */
    var init = function (l, callback) {
        var locale = l || 'fr';
        bootbox.setDefaults({
            locale: locale
        });

        $(document).on("click", ".confirm", function(event) {
            event.preventDefault();
            var self = this;
            bootbox.confirm($(this).data('message'), function(result) {
                if (result) {
                    if (typeof callback === "function") {
                        callback();
                    } else {
                        window.location = self.href;
                    }
                }
            });
        });
    };

    return init;
});
