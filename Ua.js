(function () {
    'use strict';

    function UA_Jackett_Plugin() {
        // === НАЛАШТУВАННЯ ===
        var JACKETT_URL = 'http://192.168.0.177:9117'; 
        var API_KEY = 'jynd7o1gh3gyh23ksyvhvswnqc4qn409'; 
        // ====================

        this.start = function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    var button = $('<div class="full-start__button selector"><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg><span>UA Торенти</span></div>');

                    button.on('hover:enter', function () {
                        var title = e.data.movie.title || e.data.movie.name;
                        var year = (e.data.movie.release_date  e.data.movie.first_air_date  '').split('-')[0];
                        search(title, year);
                    });

                    e.object.container.find('.full-start__buttons').append(button);
                }
            });
        };

        function search(title, year) {
            Lampa.Noty.show('Шукаю на UA трекерах...');
            var q = encodeURIComponent(title + ' ' + year);
            var url = JACKETT_URL + '/api/v2.0/indexers/all/results?apikey=' + API_KEY + '&Query=' + q;

            Lampa.HTTP.get(url, function (res) {
                if (res.Results && res.Results.length > 0) {
                    var items = res.Results.map(function (item) {
                        return {
                            title: item.Title,
                            description: (item.Size / 1073741824).toFixed(2) + ' GB | Seeds: ' + item.Seeders,
                            link: item.Guid || item.MagnetUri
                        };
                    });

                    Lampa.Select.show({
                        title: 'Результати Jackett',
                        items: items,
                        onSelect: function (item) {
                            Lampa.Player.play(item.link);
                        },
                        onBack: function () {
                            Lampa.Controller.toggle('full_start');
                        }
                    });
                } else {
                    Lampa.Noty.show('Нічого не знайдено');
                }
            }, function () {
                Lampa.Noty.error('Помилка Jackett. Перевірте сервер!');
            });
        }
    }

    if (window.appready) new UA_Jackett_Plugin().start();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') new UA_Jackett_Plugin().start();
        });
    }
})();
