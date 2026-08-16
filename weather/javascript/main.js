const API_KEY = '3a76e06684a65c76281094228bd20f8c'; 

let city = 'Набережные Челны';
let weather_city = document.getElementById('weather_city');
let tempSpan = document.getElementById('temp');
let humiditySpan = document.getElementById('humidity');
let windSpan = document.getElementById('wind');
let weatherTypeSpan = document.getElementById('weatherType');

if (weather_city) weather_city.textContent = "погода в городе " + city;

async function updateWeather(cityName) {
    if (weather_city) weather_city.textContent = "Загрузка для города " + cityName + "...";
    if (tempSpan) tempSpan.textContent = '--';
    if (humiditySpan) humiditySpan.textContent = '--';
    if (windSpan) windSpan.textContent = '--';
    if (weatherTypeSpan) weatherTypeSpan.textContent = '--';


    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(cityName) + "&appid=" + API_KEY + "&units=metric&lang=ru";

    try {
        const response = await fetch(url);
        
        if (response.status === 401) {
            if (weather_city) weather_city.textContent = "Ошибка: Неверный API-ключ или ключ еще не активирован. Подождите 1-2 часа.";
            return;
        }
        
        if (response.status === 404) {
            if (weather_city) weather_city.textContent = "Город " + cityName + " не найден";
            return;
        }

        const data = await response.json();

        if (data && data.main) {

            if (weather_city) weather_city.textContent = "погода в городе " + data.name + ", " + data.sys.country;
            if (tempSpan) tempSpan.textContent = Math.round(data.main.temp);
            if (humiditySpan) humiditySpan.textContent = Math.round(data.main.humidity);
            if (windSpan) windSpan.textContent = data.wind.speed.toFixed(1);
            

            if (data.weather && data.weather.length > 0) {
                const iconCode = data.weather[0].icon;
                const iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
                const sunImg = document.getElementById('sun_img');
                if (sunImg) sunImg.src = iconUrl;
            }
            

            if (weatherTypeSpan && data.weather && data.weather.length > 0) {
                let description = data.weather[0].description;
                weatherTypeSpan.textContent = description.charAt(0).toUpperCase() + description.slice(1);
            }
        } else {
            if (weather_city) weather_city.textContent = "Не удалось прочитать данные погоды";
        }
    } catch (error) {
        console.error('Ошибка получения погоды:', error);
        if (weather_city) weather_city.textContent = "Сетевая ошибка при запросе погоды";
    }
}

async function send_city() {
    const inputElement = document.getElementById('your_city');
    if (!inputElement) return;
    
    const newCity = inputElement.value.trim();

    if (newCity === '') {
        alert("Пожалуйста, введите название города");
        return;
    }

    city = newCity;
    await updateWeather(city);
}

updateWeather(city);