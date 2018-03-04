const CLOUDY = 0;
const CLEAR = 1;
const RAINY = 2;
const OVERCAST = 3;
const SNOWY = 4;

function showCityList() {
    if (document.getElementById('city_list')!=null)
        document.getElementById('city_list').style.display = 'block';
}


function getForecast(forecast) {
    if (forecast == null && forecast === undefined)
        return "unavailable";
    switch (forecast) {
        case CLOUDY:
            return 'Cloudy';
        case CLEAR:
            return 'Clear';
        case RAINY:
            return 'Rainy';
        case OVERCAST:
            return 'Overcast';
        case SNOWY:
            return 'Snowy';
    }
}

function getPrecipitations(dataR) {
    if (dataR.precipitations == null && dataR.precipitations === undefined)
           return "unavailable";
    dataR.precipitations
}

/**
 * it adds a row of weather forecasts to the resuls div
 * @param dataR
 */
function addToResults(dataR) {
    if (document.getElementById('results') != null) {
        const row = document.createElement('div');
        document.getElementById('results').appendChild(row);
        row.classList.add('card');
        row.classList.add('my_card');
        row.classList.add('bg-faded')
        //this.temperature= temperature;
        row.innerHTML = "<div class='card-block'>" +
            "<div class='row'>" +
            "<div class='col-xs-2'><h4 class='card-title'>" + dataR.location + "</h4></div>" +
            "<div class='col-xs-2'>" + getForecast(dataR.forecast) + "</div>" +
            "<div class='col-xs-2'>" + getTemperature(dataR) + "</div>" +
            "<div class='col-xs-2'>" + getPrecipitations(dataR) + "</div>" +
            "<div class='col-xs-2'>" + getWind(dataR) + "</div>" +
            "<div class='col-xs-2'></div></div></div>";
    }
}

function getWind(dataR){
    if (dataR.wind == null && dataR.wind === undefined)
            return "unavailable";
    else return dataR.wind;
}

function getTemperature(dataR){
    if (dataR.temperature == null && dataR.temperature === undefined)
            return "unavailable";
    else return dataR.temperature;
}

function selectCity(city, date) {
    var cityList=JSON.parse(localStorage.getItem('cities'));
    if (cityList==null) cityList=[];
    cityList.push(city);
    cityList = removeDuplicates(cityList);
    localStorage.setItem('cities', JSON.stringify(cityList));
    retrieveAllCitiesData(cityList, date);
}


function refreshCityList(){
    if (document.getElementById('results')!=null)
        document.getElementById('results').innerHTML='';
}
function retrieveAllCitiesData(cityList, date){
    refreshCityList();
    for (index in cityList)
        loadCityData(cityList[index], date);
}



function storeCachedData(city, forecastObject) {
    localStorage.setItem(city, JSON.stringify(forecastObject));
}

function getCachedData(city, date) {
    const value = localStorage.getItem(city);
    if (value == null)
        return {city: city, date: date}
    else return JSON.parse(value);
}


function loadCityData(city, date){
    getCachedData(city, date);
    const input = JSON.stringify({location: city, date: date});
    $.ajax({
        url: '/weather_data',
        data: input,
        contentType: 'application/json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            addToResults(dataR);
            storeCachedData(dataR.location, dataR);
        },
        error: function (xhr, status, error) {
            showOfflineWarning();
            addToResults(getCachedData(city, date));
        }
    });

    if (document.getElementById('city_list')!=null)
        document.getElementById('city_list').style.display = 'none';
}




///// manager



window.addEventListener('online', function(e) {
    // Resync data with server.
    console.log("You are online");
    hideOfflineWarning();
    loadData();
}, false);

window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    showOfflineWarning();
}, false);

function showOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display.block;
}

function hideOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display.hide;
}


function removeDuplicates(cityList) {
    // remove any duplicate
       var uniqueNames=[];
       $.each(cityList, function(i, el){
           if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
       });
       return uniqueNames;
}



function loadData(){
    var cityList=JSON.parse(localStorage.getItem('cities'));
    cityList=removeDuplicates(cityList);
    retrieveAllCitiesData(cityList, new Date().getTime());
}


function initWeatherForecasts() {
    loadData();
}


// TODO add service worker code here
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('./service-worker.js')
           .then(function() { console.log('Service Worker Registered'); });
}
