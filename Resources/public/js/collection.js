define(['jquery'], function($) {
    /*
     * Managing collections with add/delete actions in a Symfony form.
     *
     * Expected HTML structure to make this script work
     * <form class='form-with-collection'>
     *     {# parent form #}
     *     <div id='collection' data-prototype="{# collection form prototype #}">
     *         <div class='item' data-number="{# item number #}">
     *             {# item form #}
     *             <button class='delete-item-collection-btn'></button>
     *         </div>
     *         { ... }
     *     </div>
     *     <button class='add-item-collection-btn'></button>
     * </form>
    */

    var deleteEvent = function(container) {
        $(container).on('click', function () {
            $(this).parent().parent().remove();
        });
    };

    var init = function() {
        var collectionHolder = $('.form-with-collection #collection');

        $('.add-item-collection-btn').on('click', function() {
            var prototype = collectionHolder.attr('data-prototype');
            var number = parseInt($('#collection .item:last-child').data('number')) + 1;
            var newSubForm = prototype.replace(/__name__/g, number);
            $('#collection').append(newSubForm);
            $('#collection .item:last-child').data('number', number);
            deleteEvent('#collection .item:last-child .delete-item-collection-btn');
        });

        deleteEvent('.delete-item-collection-btn');
    };

    return init;
});
