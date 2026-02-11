(function () {
    'use strict';

    function UA_Jackett_Plugin() {
        // === НАЛАШТУВАННЯ ===
        var JACKETT_URL = 'http://192.168.0.177:9117'; // Вкажіть IP вашого ПК з Jackett
        var API_KEY = 'jynd7o1gh3gyh23ksyvhvswnqc4qn409';             // Вставте ваш API Key з налаштувань Jackett
        // ====================

        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                // Створюємо кнопку
                var button = $(<div class="full-start__button selector">
                    <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    <span>UA Торенти</span>
                </div>);

                button.on('hover:enter', function () {
                    var movie = e.data.movie;
                    var title = movie.title  movie.name;
                    var year = movie.release_date ? movie.release_date.split('-')[0] : (movie.first_air_date ? movie.first_air_date.split('-')[0] : '');
                    
                    search(title, year);
                });

                // Додаємо кнопку до решти кнопок у картці
                e.object.container.find('.full-start__buttons').append(button);
            }
        });

        function search(title, year) {
            Lampa.Noty.show('Пошук на трекерах...');
            
            var searchQuery = encodeURIComponent(title + ' ' + year);
            var url = JACKETT_URL + '/api/v2.0/indexers/all/results?apikey=' + API_KEY + '&Query=' + searchQuery;

            Lampa.HTTP.get(url, function (res) {
                if (res.Results && res.Results.length > 0) {
                    var items = res.Results.map(function (item) {
                        return {
                            title: item.Title,
                            description: 'Розмір: ' + (item.Size / 1073741824).toFixed(2) + ' GB | Сідів: ' + item.Seeders,
                            link: item.Guid  item.MagnetUri
                        };
                    });

                    Lampa.Select.show({
                        title: 'Результати Jackett',
                        items: items,
                        onSelect: function (item) {
                            // Передаємо посилання в TorrServe
                            Lampa.Player.play(item.link); 
                        },
                        onBack: function () {
                            Lampa.Controller.toggle('full_start');
                        }
                    });
                } else {
                    Lampa.Noty.show('Нічого не знайдено.');
                }
            }, function () {
                Lampa.Noty.error('Помилка підключення до Jackett. Перевірте, чи запущений сервер.');
            });
        }
    }

    // Реєстрація плагіна
    if (window.appready) UA_Jackett_Plugin();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') UA_Jackett_Plugin();
        });
    }
})();