define(['jquery', 'bootbox'], function($, bootbox) {
    /*
     * Managing the bootbox popup on a .confirm link.
     *
     * Expected HTML structure to make this script work
     * <a href='' class='confirm' data-message=''></a>
     */

    bootbox.setDefaults({
        locale: requirejs.s.contexts._.config.config.i18n.locale
    });

    var init = function (callback) {
        $(document).on("click", ".confirm", function(event) {
            event.preventDefault();
            var self = this;
            if ($(self).attr('data-loading-text') !== undefined) {
                $(self).button('loading');
            }

            bootbox.confirm($(this).data('message'), function(result) {
                if (typeof callback === "function") {
                    callback(result);
                } else if (result) {
                    window.location = self.href;
                } else if ($(self).attr('data-loading-text') !== undefined) {
                    $(self).button('reset');
                }
            });
        });
    };

    return init;
});
