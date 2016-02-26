define(['jquery'], function($) {
    /*
     * Managing values between a select and its associated hidden input (usually to pass the entity id).
     *
     * Expected HTML structure to make this script work
     * <div>
     *     <select class='to-hidden'></select>
     * </div>
     * <input type='hidden'>
     */

    var isHiddenInput = function(item) {
        return item.prop('tagName').toLowerCase() === 'input' && item.attr('type') === 'hidden';
    };

    $(document).ready(function() {
        $('.to-hidden').each(function() {
            var hidden = $(this).parent().next();
            if (isHiddenInput(hidden) && hidden.val().length > 0) {
                item.val(hidden.val());
            }
        });
    });

    $(document).on('change', '.to-hidden', function(event) {
        var hidden = $(this).parent().next();
        if (isHiddenInput(hidden)) {
            hidden.val(this.value);
        }
    });
});
