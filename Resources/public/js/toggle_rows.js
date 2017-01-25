/**
 * Show / Hide some lines in any table/list
 *
 * You have to provide some specific html classes in order to make this script
 * working:
 *  <table class="toggle-list">
 *      ...
 *      <tfoot class="show-toggle-container">
 *          <a class="show-toggle-trigger"><span class="show-toggle-text"></span></a>
 *      </tfoot>
 *  </table>
 *
 *  OR
 *
 *  <ul class="toggle-list">
 *      ...
 *  <ul>
 *  <div class="show-toggle-container">
 *     <a class="show-toggle-trigger"><span class="show-toggle-text"></span></a>
 *  </div>
 */
define(['jquery'], function($) {
    (function ($) {
        'use strict';

        var
            DEFAULT_LIMIT = 2,
            DEFAULT_SHOW_MORE_TEXT = 'Show more',
            DEFAULT_SHOW_LESS_TEXT = 'Show less'
        ;

        $.fn.showMore = show_more;

        /**
         * options.limit
         * options.showMoreText
         * options.showLessText
         * @param options
         */
        function show_more(options) {
            var showContainer = $(document).find('.show-toggle-container');
            var showTrigger = $(document).find('.show-toggle-trigger');
            var showText = $(document).find('.show-toggle-text');

            if (!showContainer || !showTrigger || !showText) {
                return;
            }

            var rows = null,
                isFolded = false,
                target = this
            ;

            if ($(target).is('table')) {
                rows = $(target).find('tbody > tr');
            } else if ($(target).is('ul')) {
                rows = $(target).find('li');
            } else {
                return;
            }

            var limit = options.limit || DEFAULT_LIMIT,
                showMoreText = options.showMoreText || DEFAULT_SHOW_MORE_TEXT,
                showLessText = options.showLessText || DEFAULT_SHOW_LESS_TEXT
            ;

            /**
             * Toggle visibility
             */
            var toggleVisible = function () {
                for (var i = limit; i < rows.length; i++) {
                    if (isFolded) {
                        rows.eq(i).show();
                        showTrigger.addClass('folded');
                        showText.text(showLessText);
                    } else {
                        rows.eq(i).hide();
                        showTrigger.removeClass('folded');
                        showText.text(showMoreText);
                    }
                }
                isFolded = !isFolded;
            };

            if (rows.length > limit) {
                showContainer.show();
                toggleVisible();
            } else {
                showContainer.hide();
            }

            /**
             * on click show/hide
             */
            showTrigger.on('click', function (event) {
                event.preventDefault();
                toggleVisible();
            });
        }
    })(jQuery);
});
