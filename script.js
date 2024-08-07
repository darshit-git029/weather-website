let API_KEY = "683ffc7061470fceedf039199bbd599e";
let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?units=metric`;
let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?units=metric`;

// DOM Elements
let searchBox = document.querySelector(".search-input");
let searchButton = document.querySelector(".btn");
let iconContainer = document.querySelector(".icons");

const toggleButton = document.querySelector(".convertToggle");
const toggleIcon = document.querySelector(".toggleIcon");
const currentTempElement = document.querySelector(".currentTemp");
const unitElement = document.querySelector(".unit");
const feelsLikeElement = document.querySelector(".feelsLike");

let dashboard = document.querySelector(".dashboard");
let currentTempBox = document.querySelector(".tempBox");
let dayCards = document.querySelectorAll(".dayCard");
let hideDaysButton = document.querySelector(".hide-days");
let SearchLocation = document.querySelector(".SearchLocation")

// Error message for wrong search
const errorBox = document.createElement("div");
errorBox.className = "ErrorBox";
const errorBoxText = document.createElement("p");
errorBoxText.textContent = "Sorry, we can't find weather data for this location. Please verify the location name and try again.";
errorBox.appendChild(errorBoxText);

// Error message for empty search
const errorBoxEmptySearch = document.createElement("div");
errorBoxEmptySearch.className = "ErrorBoxEmptySearch";
const errorBoxEmptySearchText = document.createElement("p");
errorBoxEmptySearchText.textContent = "Please Enter Correct Location To Get Weather Information :)";
errorBoxEmptySearch.appendChild(errorBoxEmptySearchText);

// Message for user to search a location
const searchLocationMessage = document.createElement("div");
searchLocationMessage.className = "SearchLocation";
const searchLocationText = document.createElement("p");
searchLocationText.textContent = "Search Location To Get Weather Information  👆";
searchLocationMessage.appendChild(searchLocationText);


// Append the error messages to the DOM (e.g., to a parent container)
const parentContainer = document.querySelector(".container"); // Change this selector to your actual container
parentContainer.appendChild(errorBox);
parentContainer.appendChild(errorBoxEmptySearch);
parentContainer.appendChild(searchLocationMessage);

// Hide the messages initially
errorBox.style.display = "none";
errorBoxEmptySearch.style.display = "none";
searchLocationMessage.style.display = "block";

// Initialize UI State
const initializeUI = () => {
    errorBoxEmptySearch.style.display = "none";
    errorBox.style.display = "none";
    dashboard.style.display = "none";
    currentTempBox.style.display = "none";
    dayCards.forEach(card => card.style.display = "none");
    hideDaysButton.style.display = "none";
};

// Convert Unix timestamp to human-readable time
const convertTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Clear weather data from UI
const clearWeatherData = () => {
    errorBox.style.display = "block";

    hideDaysButton.style.display = "none";
    dayCards.forEach(card => card.style.display = "none");
    dashboard.style.display = "none";
    currentTempBox.style.display = "none";
    errorBoxEmptySearch.style.display = "none";
    searchLocationMessage.style.display = "none";
    searchBox.value = "";
};

// Display weather data in UI
const displayWeatherData = (data) => {
    dashboard.style.display = "block";
    currentTempBox.style.display = "block";
    searchLocationMessage.style.display = "none"

    document.querySelector(".locName").textContent = data.name;
    document.querySelector(".weatherCondition").textContent = data.weather[0].main;
    currentTempElement.textContent = data.main.temp.toFixed(1);
    feelsLikeElement.textContent = data.main.feels_like;
    document.querySelector(".windSpeed").textContent = data.wind.speed;
    document.querySelector(".humidity").textContent = data.main.humidity;
    document.querySelector(".tempMaxBox").textContent = `${data.main.temp_max}° max`;
    document.querySelector(".tempMinBox").textContent = `${data.main.temp_min}° min`;
    document.querySelector(".sunriseTime").textContent = convertTime(data.sys.sunrise);
    document.querySelector(".sunsetTime").textContent = convertTime(data.sys.sunset);
    document.querySelector(".cloudCover").textContent = `${data.clouds.all}%`;

};

// Fetch current weather data
const fetchWeatherData = async (location) => {
    try {
        let response = await fetch(`${WEATHER_API_URL}&q=${location}&appid=${API_KEY}`);
        let data = await response.json();
        if (data.cod !== 200) {
            clearWeatherData();
            return;
        }
        displayWeatherData(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        setTimeout(() => (clearWeatherData()), 1000);
    }
};

// Fetch weather forecast data
const fetchWeatherForecastData = async (location) => {
    try {
        const response = await fetch(`${FORECAST_API_URL}&q=${location}&appid=${API_KEY}`);
        const data = await response.json();
        if (data.cod !== "200") {
            console.error("Error fetching forecast data");
            return;
        }
        const sunriseTime = convertTime(data.city.sunrise);
        const sunsetTime = convertTime(data.city.sunset);
        dayCards.forEach((card, index) => {
            if (index < 8) {
                card.style.display = "block";
                card.querySelector(`.weekDayName${index + 1}`).textContent = `Day ${index + 1}`;
                card.querySelector(`.weekDayTempMax${index + 1}`).textContent = `${data.list[index].main.temp_max}`;
                card.querySelector(`.weekDayTempMin${index + 1}`).textContent = data.list[index].main.temp_min;
                card.querySelector(`.weekDaySunrise${index + 1}`).textContent = sunriseTime;
                card.querySelector(`.weekDaySunset${index + 1}`).textContent = sunsetTime;
                card.querySelector(`.weekDayWind${index + 1}`).textContent = data.list[index].wind.speed;
                card.querySelector(`.weekDayHumid${index + 1}`).textContent = data.list[index].main.humidity;
                card.querySelector(`.weekDayCloud${index + 1}`).textContent = `${data.list[index].clouds.all}%`;
                card.querySelector(`.weekDaySummarys${index + 1}`).textContent = data.list[index].weather[0].description;
            }
        });
        hideDaysButton.style.display = "block";
    } catch (error) {
        console.error("Error fetching weather forecast data:", error);
    }
};

// Event Listeners
searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    const location = searchBox.value.trim();
    if (!location) {
        errorBoxEmptySearch.style.display = "block";
        errorBox.style.display = "none";
        currentTempBox.style.display = "none";
        dashboard.style.display = "none";
        dayCards.forEach(card => card.style.display = "none");
        hideDaysButton.style.display = "none";
        searchBox.value = "";
        searchLocationMessage.style.display = "none";
        return;

    } else {
        initializeUI();
        fetchWeatherData(location);
        fetchWeatherForecastData(location);
    }

});


toggleButton.addEventListener("click", () => {
    toggleIcon.classList.toggle("ion-toggle-filled");

    const tempInC = parseFloat(currentTempElement.textContent);
    const feelsLikeInC = parseFloat(feelsLikeElement.textContent);

    if (unitElement.textContent === "°C") {
        const tempInF = (tempInC * 9 / 5) + 32;
        const feelsLikeInF = (feelsLikeInC * 9 / 5) + 32;

        currentTempElement.textContent = tempInF.toFixed(1);
        unitElement.textContent = "°F";
        feelsLikeElement.textContent = feelsLikeInF.toFixed(1) + " °F";
    } else {
        const tempInF = parseFloat(currentTempElement.textContent);
        const feelsLikeInF = parseFloat(feelsLikeElement.textContent);

        const tempInC = (tempInF - 32) * 5 / 9;
        const feelsLikeInC = (feelsLikeInF - 32) * 5 / 9;

        currentTempElement.textContent = tempInC.toFixed(1);
        unitElement.textContent = "°C";
        feelsLikeElement.textContent = feelsLikeInC.toFixed(1) + " °C";
    }
});


// Initialize the UI state when the script loads
initializeUI();
