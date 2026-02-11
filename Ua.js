(function () {
    'use strict';
    function UA_Plugin() {
        this.start = function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    var btn = $('<div class="full-start__button selector"><span>UA Торенти</span></div>');
                    btn.on('hover:enter', function () {
                        Lampa.Noty.show('Пошук запущено!');
                        // Тут ваша логіка запиту до Jackett
                    });
                    $('.full-start__buttons').append(btn);
                }
            });
        };
    }
    if (window.appready) new UA_Plugin().start();
    else Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') new UA_Plugin().start(); });
})();
