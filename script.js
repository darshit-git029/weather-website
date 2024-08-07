const apikey = "683ffc7061470fceedf039199bbd599e";
const apiurl = `https://api.openweathermap.org/data/2.5/weather?&units=metric`;
const apikey1 = "683ffc7061470fceedf039199bbd599e";
const apiurl1 = `https://api.openweathermap.org/data/2.5/forecast?&units=metric`;

// DOM Elements
const searchbox = document.querySelector(".search-input");
const buttonbox = document.querySelector(".btn");
const iconLoc = document.querySelector(".icons");

const toggleButton = document.querySelector(".convertToggle");
const toggleIcon = document.querySelector(".toggleIcon");
const tempNow = document.querySelector(".currentTemp");
const unit = document.querySelector(".unit");
const feelsLike = document.querySelector(".feelsLike");

// Functions to convert time
const convertTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Fetch current weather data
async function checkWeather(location) {
    try {
        const response = await fetch(`${apiurl}&q=${location}&appid=${apikey}`);
        const data = await response.json();
        console.log(data);

        document.querySelector(".locName").innerHTML = data.name;
        document.querySelector(".weatherCondition").innerHTML = data.weather[0].main;
        document.querySelector(".currentTemp").innerHTML = data.main.temp.toFixed(1);
        document.querySelector(".feelsLike").innerHTML = data.main.feels_like;
        document.querySelector(".windSpeed").innerHTML = data.wind.speed;
        document.querySelector(".humidity").innerHTML = data.main.humidity;
        document.querySelector(".tempMaxBox").innerHTML = `${data.main.temp_max}° max`;
        document.querySelector(".tempMinBox").innerHTML = `${data.main.temp_min}° min`;
        document.querySelector(".sunriseTime").innerHTML = convertTime(data.sys.sunrise);
        document.querySelector(".sunsetTime").innerHTML = convertTime(data.sys.sunset);
        document.querySelector(".cloudCover").innerHTML = `${data.clouds.all} %`;

        const html = `<canvas id="weatherIcon" width="100" height="100" class="icons">${iconLoc}src = "F:/Weather_app/img/clouds.png"</canvas>`;
        iconLoc.insertAdjacentHTML("afterend", html);
    } catch (error) {
        alert("Error fetching current weather data: ", error);
        this.clearWeatherData();
    }
}

function clearWeatherData(){
    document.querySelector(".locName").textContent = "not found";
    document.querySelector(".weatherCondition").textContent = "";
    this.tempNow.textContent = "";
    this.feelsLike.textContent = "";
    document.querySelector(".windSpeed").textContent = "";
    document.querySelector(".humidity").textContent = "";
    document.querySelector(".tempMaxBox").textContent = "";
    document.querySelector(".tempMinBox").textContent = "";
    document.querySelector(".sunriseTime").textContent = "";
    document.querySelector(".sunsetTime").textContent = "";
    document.querySelector(".cloudCover").textContent = "";
    document.querySelector(".search-input").value = ""; 
}
// Fetch forecast weather data
async function checkWeatherForecast(location) {
    try {
        const response = await fetch(`${apiurl1}&q=${location}&appid=${apikey1}`);
        const data = await response.json();
        console.log(data);

        const sunriseTime = convertTime(data.city.sunrise);
        const sunsetTime = convertTime(data.city.sunset);

        for (let i = 0; i < 8; i++) {
            document.querySelector(`.weekDayName${i + 1}`).innerHTML = `Day ${i + 1}`;
            document.querySelector(`.weekDayTempMax${i + 1}`).innerHTML = `${data.list[i].main.temp_max}`;
            document.querySelector(`.weekDayTempMin${i + 1}`).innerHTML = data.list[i].main.temp_min;
            document.querySelector(`.weekDaySunrise${i + 1}`).innerHTML = sunriseTime;
            document.querySelector(`.weekDaySunset${i + 1}`).innerHTML = sunsetTime;
            document.querySelector(`.weekDayWind${i + 1}`).innerHTML = data.list[i].wind.speed;
            document.querySelector(`.weekDayHumid${i + 1}`).innerHTML = data.list[i].main.humidity;
            document.querySelector(`.weekDayCloud${i + 1}`).innerHTML = data.list[i + 1].clouds.all;
            document.querySelector(`.weekDaySummarys${i + 1}`).innerHTML = data.list[i + 1].weather[0].main;
            document.querySelector(`.weekDaySummarys${i + 1}`).innerHTML = data.list[i + 1].weather[0].description;
        }
    } catch (error) {
        console.error("Error fetching weather forecast data: ", error);
    }
}

// Event Listeners
buttonbox.addEventListener("click", function () {
    const location = searchbox.value;
    if (!location) {
        alert("Weather data for the specified location is not available");
        return;
    }
    checkWeather(location);
    checkWeatherForecast(location);
});

toggleButton.addEventListener("click", function () {
    toggleIcon.classList.toggle("ion-toggle-filled");

    const tempInC = parseFloat(tempNow.textContent);
    const feelsLikeInC = parseFloat(feelsLike.textContent);

    if (unit.textContent === "°C") {
        const tempInF = (tempInC * 9 / 5) + 32;
        const feelsLikeInF = (feelsLikeInC * 9 / 5) + 32;

        tempNow.textContent = tempInF.toFixed(1);
        unit.textContent = "°F";
        feelsLike.textContent = feelsLikeInF.toFixed(1) + " °F";
    } else {
        const tempInC = (tempInF - 32) * 5 / 9;
        const feelsLikeInC = (feelsLikeInF - 32) * 5 / 9;

        tempNow.textContent = tempInC.toFixed(1);
        unit.textContent = "°C";
        feelsLike.textContent = feelsLikeInC.toFixed(1) + " °C";
    }
});
