define(['jquery_ui_autocomplete'],  function($) {
    init_autocomplete = function(input, target, l, d) {
        var length = parseInt(l) || 2;
        var delay = parseInt(d) || 300;

        $(document).ready(function() {
            selected = $(target).find(':selected');
            if (selected.length === 1) {
                $(input).val(selected.html());
            }

            $(input).autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: $(this.element).data('url'),
                        data : { term: request.term },
                        success: function(data) {
                            if (data.length > 0) {
                                response($.map(data, function(item) {
                                    return {
                                        label: item.label,
                                        value: item.value
                                    };
                                }));
                            }
                        }
                    });
                },
                select: function(event, ui) {
                    event.preventDefault();
                    $(input).val(ui.item.label);
                    $(target+' option').filter(function() {
                        return $(this).val() == ui.item.value;
                    }).attr('selected', true);
                },
                minLength: length,
                delay: delay
            });
        });
    };
});
