require(['jquery', 'utils'], function($, utils){
    function displayError(responseText) {
        document.open();
        document.write(responseText);
        document.close();
    }

    $('.modal').on(
        'submit',
        'form',
        function(){
            var $form = $(this);
            var $target = $form.find('button[type=submit]').data('target');
            utils.disableBtn($form.find('button[type=submit]'));
            $.ajax({
                'type': 'POST',
                'url':$(this).attr('action'),
                'data':new FormData($form[0]),
                'processData':false,
                'contentType': false,
                'success': function(data, textStatus){
                    if (data.status === false) {
                        $form.replaceWith(data.content);
                    } else if (data.status === true) {
                        if (undefined === $target) {
                            window.location = data.location;
                        } else {
                            $($target).html(data.content);
                        }
                    } else {
                        displayError(data);
                    }
                },
                'error':function(xhr) {
                    displayError(xhr.responseText);
                }
            });
            return false;
        }
    );
});
