define([
    'select2',
    'translations/messages'
], function() {
    $.fn.select2.defaults.set('theme', 'bootstrap');
    $.fn.select2.defaults.set('placeholder', Translator.trans('tisseo.global.choose'));
    $.fn.select2.defaults.set('allowClear', 'true');
});
