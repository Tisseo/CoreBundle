define(['jquery', 'bootbox'], function($, bootbox) {
    /*
     * Managing the bootbox popup on a delete link.
     *
     * Expected HTML structure to make this script work
     * <a href='' class='delete-confirm' data-message=''></a>
     */
    var init = function (l) {
        var locale = l || 'fr';
        bootbox.setDefaults({
            locale: locale
        });

        $(document).on("click", ".delete-confirm", function(event) {
            event.preventDefault();
            var self = this;
            bootbox.confirm($(this).data('message'), function(result) {
                if (result) {
                    window.location = self.href;
                }
            });
        });
    };

    return init;
});
