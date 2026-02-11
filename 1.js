(function () {
    'use strict';
    function TestPlugin() {
        Lampa.Noty.show('Мій плагін завантажився!');
        
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var button = $('<div class="full-start__button selector"><span>ТЕСТ UA</span></div>');
                button.on('hover:enter', function () {
                    Lampa.Noty.show('Кнопка працює!');
                });
                $('.full-start__buttons').append(button);
            }
        });
    }
    if (window.appready) TestPlugin();
    else Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') TestPlugin(); });
})();