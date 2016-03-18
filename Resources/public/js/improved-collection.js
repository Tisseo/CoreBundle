define(['jquery'], function($) {
    /*
     * Managing collections with add/delete actions in a Symfony form.
     *
     * Expected HTML structure to make this script work
     * <form class='form-with-collection'>
     *     {# parent form #}
     *     <div class='collection' data-prototype='{# collection form prototype #}' data-index=''>
     *         <div class='collection-target'>
     *             <div class='item'>
     *                 {# item form #}
     *                 <button class='delete-item-collection-btn'></button>
     *             </div>
     *         </div>
     *         { ... }
     *         <button class='add-item-collection-btn'></button>
     *     </div>
     * </form>
     */

    var delete_event = function(container) {
        $(container).on('click', function(event) {
            event.preventDefault();
            $(this).parents('.item').remove();
        });
    };

    var add_event = function(collection) {
        var add_button = collection.find('.add-item-collection-btn');
        var target = collection.find('.collection-target');

        $(add_button).on('click', function(event) {
            event.preventDefault();
            var index = collection.data('index');
            var prototype = collection.attr('data-prototype');
            var form = prototype.replace(/__name__/g, index);
            target.append(form);
            collection.data('index', index+1);
            delete_event(target.find('.item:last-child .delete-item-collection-btn'));
        });
    };

    var init_collection = function() {
        var collections = $('.form-with-collection .collection');

        $.each(collections, function() {
            $collection = $(this);
            var target = $collection.find('.collection-target');
            $collection.data('index', target.find('.item').length);
            add_event($collection);
            $collection.find('.delete-item-collection-btn').each(function() {
                delete_event(this);
            });
        });
    };

    $(document).ready(function() {
        init_collection();
    });
});
