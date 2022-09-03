// Для вычисления номера нужного тайла следует задать параметры:
// - уровень масштабирования карты;
// - географические координаты объекта, попадающего в тайл;
// - проекцию, для которой нужно получить тайл. 

// Доступные проекции и соответствующие значения эксцентриситетов.
var projections = [{
    name: 'wgs84Mercator',
    eccentricity: 0.0818191908426
}, {
    name: 'sphericalMercator',
    eccentricity: 0
}];
    

// Ждем загрузки DOM
document.addEventListener("DOMContentLoaded", function(event) { 

    // Получаем форму и вешаем на нее обработчик
    let form = document.getElementById("inputForm");
    form.addEventListener("submit", function(event){
        event.preventDefault();

        // Переведем географические координаты объекта в глобальные пиксельные координаты
        pixelCoords = fromGeoToPixels(
            +(document.getElementById("exampleInputX").value),
            +(document.getElementById("exampleInputY").value),
            projections[Number(document.querySelector('input[name="projection"]:checked').value)],
            +(document.getElementById("exampleInputZ").value),
        );

        // Посчитаем номер тайла на основе пиксельных координат
        tileNumber = fromPixelsToTileNumber(pixelCoords[0], pixelCoords[1]);

        // Отобразим результат
        document.getElementById("tileX").value = tileNumber[0];
        document.getElementById("tileY").value = tileNumber[1];
        document.getElementById("resImg").src = "https://core-carparks-renderer-lots.maps.yandex.net/maps-rdr-carparks/tiles?l=carparks&x=" + tileNumber[0] + "&y=" + tileNumber[1] + "&z=" + document.getElementById("exampleInputZ").value + "&scale=1&lang=ru_RU&v=20220903-020351";
    });
});

   
// Функция для перевода географических координат объекта 
// в глобальные пиксельные координаты.    
function fromGeoToPixels (lat, long, projection, z) {
    var x_p, y_p,
        pixelCoords,
        tilenumber = [],
        rho,
        pi = Math.PI,
        beta,   
        phi,
        theta,
        e = projection.eccentricity;
 
    rho = Math.pow(2, z + 8) / 2;
    beta = lat * pi / 180;
    phi = (1 - e * Math.sin(beta)) / (1 + e * Math.sin(beta));
    theta = Math.tan(pi / 4 + beta / 2) * Math.pow(phi, e / 2);
    
    x_p = rho * (1 + long / 180);
    y_p = rho * (1 - Math.log(theta) / pi);
    
    return [x_p, y_p];
}

// Функция для расчета номера тайла на основе глобальных пиксельных координат.
function fromPixelsToTileNumber (x, y) {
    return [
        Math.floor(x / 256),
        Math.floor(y / 256)
    ];
}
