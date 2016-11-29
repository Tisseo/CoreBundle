/**
 * Usage add data-id to each Tr
 *
 */


define(['jquery', 'translations/messages'], function ($, Translator) {

    if (typeof($().add_checkboxes) !== "undefined") {
        return;
    }

    $.fn.add_checkboxes = function () {
        var _dt = this;

        $(document).ready(function () {

            var
                toggle = $(_dt).find('input[type=checkbox]#checkbox-toggle'),
                rows = $(_dt).find('tbody > tr > td > input.checkbox'),
                selectedItems = [],
                headerBtns = []
                ;

            // Minor css fix for table head
            $(_dt).find('#checkbox-toggle').parent().css('padding', '10px 10px');

            createHeaderBtn(Translator.trans('tisseo.paon.line_status.action.validate_selected'), 'validate-selected', setStatus.bind(null, null));
            createHeaderBtn(Translator.trans('tisseo.paon.line_status.action.suspend_selected'), 'suspend-selected', setStatus.bind(null, 1));
            updateBtnsStates();

            /**
             * When a checkbox is clicked
             */
            $.each(rows, function () {
                var _cb = this;

                $(_cb).on('click', function () {
                    var item = this;
                    if (selectedItems.length) {
                        selectedItems = [];
                        $.each(rows, function (i, el) {
                            var
                                rowId = $(el).attr('data-id'),
                                isChecked = $(el).prop('checked')
                                ;

                            if (selectedItems.indexOf(rowId) === -1 && isChecked) {
                                selectedItems.push(rowId)
                            }
                        });
                    } else {
                        selectedItems.push($(item).attr('data-id'));
                    }
                    updateBtnsStates();
                });
            });

            /**
             * Toggle all checkboxes
             */
            $(toggle).on('click', function (evt) {
                var _state = $(this).prop('checked');
                $.each($(_dt).find('tbody > tr > td > .checkbox'), function () {
                    $(this).prop('checked', _state);
                    if (_state) {
                        selectedItems.push($(this).attr('data-id'));
                    } else {
                        selectedItems = [];
                    }
                });
                updateBtnsStates();
            });

            /**
             * Create action btn at the top of the Table
             */
            function createHeaderBtn(label, id, clickCallback) {
                if (!label) {
                    return;
                }

                var template =
                        $('<a style="margin-right:5px;transition:250ms ease;" class="btn btn-default" id="' + id + '" href="#">' +
                            '<span class="glyphicon glyphicon-edit"></span> ' + label + '</a>')
                    ;

                $(_dt).before($(template));
                $(template).on('click', clickCallback);
                headerBtns.push($(template));

                return $(template);
            }

            /**
             * Enable/Disable buttons if row is Selected/Diselected
             */
            function updateBtnsStates() {
                $.each(headerBtns, function () {
                    _btn = this;
                    if (selectedItems.length > 0) {
                        _btn.removeClass('disabled');
                    } else {
                        _btn.addClass('disabled');
                    }
                })

            }

            /**
             * Call Api route
             * @param suspend
             */
            function setStatus(suspend) {
                var btn = $(this);
                var
                    redirectUrl = Routing.generate('tisseo_paon_line_validation_list'),
                    url = suspend ? Routing.generate('tisseo_paon_line_validate_suspend_batch', {'suspend': 1}) : Routing.generate('tisseo_paon_line_validate_suspend_batch')
                    ;

                $.ajax({
                    url: url,
                    type: 'POST',
                    data: {
                        lines: selectedItems
                    },
                    success: function (data) {
                        return location.href = redirectUrl;
                    },
                    error: function (e) {
                        return location.href = redirectUrl;
                    }
                });
            }
        });
    }
});


