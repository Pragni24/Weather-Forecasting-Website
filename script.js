const apiKey = "199437d7d1e98e368021b99af74d71de";
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

const weatherIcon = document.querySelector(".weather-icon");

function suggestOutdoorActivity(weatherDescription) {
    let activity = "";

    if (weatherDescription.includes("clear")) {
        activity = "go for a picnic or a hike";
        document.querySelector(".card2").style.textShadow = "2px 2px 2px black";
        document.querySelector("body").style.backgroundImage="url('1.jpg')";
    } else if (weatherDescription.includes("clouds")) {
        activity = "go for a walk or a bike ride";
        document.querySelector("body").style.backgroundImage="url('bike_final.jpg')";
        document.querySelector(".card2").style.textShadow = "2px 2px 2px black";
    } else if (weatherDescription.includes("rain")) {
        activity = "stay indoors and read a book";
        document.querySelector("body").style.backgroundImage="url('indoor_final.jpg')";
        document.querySelector(".card2").style.textShadow = "2px 2px 2px black";
    } else if (weatherDescription.includes("snow")) {
        activity = "build a snowman or have a snowball fight";
        document.querySelector("body").style.backgroundImage="url('snow2.jpg')";
        document.querySelector(".activity").textContent = activity;
        document.querySelector(".card2").style.textShadow = "2px 2px 2px black";
    } else if (weatherDescription.includes("drizzle")) {
        activity = "stay lazy!";
        document.querySelector("body").style.backgroundImage="url('lazy_final.jpg')";
        document.querySelector(".card2").style.textShadow = "2px 2px 2px black";
    }else {
        activity = "enjoy the weather outside";
        document.querySelector("body").style.backgroundImage="url('mist_final.jpg')";
        document.querySelector(".card2").style.textShadow = "2px 2px 2px black";
    }

    return activity;
}

function displayAlert(message) {
    const alertModal = document.getElementById("alertModal");
    const alertMessage = document.getElementById("alertMessage");
    alertMessage.textContent = message;
    alertModal.style.display = "block";

    // Add functionality to close the modal when clicking on the close button or outside the modal
    const closeButton = document.querySelector(".close");
    closeButton.onclick = function() {
        alertModal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == alertModal) {
            alertModal.style.display = "none";
        }
    };
}

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}&units=metric`);
    const data = await response.json();
    const weatherDescription = data.list[0].weather[0].description.toLowerCase();
    const suggestedActivity = suggestOutdoorActivity(weatherDescription);
    document.querySelector(".activity").innerHTML = `You can ${suggestedActivity}.`;

    if (response.status == 404) {
        displayAlert("Invalid City Name.");
        document.querySelector(".weather").style.display = "none";
    } else {
        document.querySelector(".city").innerHTML = data.city.name;
        document.querySelector(".temp").innerHTML = Math.round(data.list[0].main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.list[0].main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.list[0].wind.speed + " km/h";

        const weather = data.list[0].weather[0].main;
        if (weather === "Clouds") {
            weatherIcon.src = "image/clouds.png";
        } else if (weather === "Clear") {
            weatherIcon.src = "image/clear.png";
        } else if (weather === "Rain") {
            weatherIcon.src = "image/rain.png";
        } else if (weather === "Drizzle") {
            weatherIcon.src = "image/drizzle.png";
        } else if (weather === "Mist") {
            weatherIcon.src = "image/mist.png";
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";

        // Display sunrise and sunset time
        const sunriseTime = new Date(data.city.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunsetTime = new Date(data.city.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        document.querySelector(".sunrise").innerHTML = `Sunrise: ${sunriseTime}`;
        document.querySelector(".sunset").innerHTML = `Sunset: ${sunsetTime}`;

        // Display hourly forecast details
        const forecastData = data.list;
        const forecastDetails = document.querySelector(".forecast-details");
        forecastDetails.innerHTML = ""; // Clear previous forecast details

        const currentHour = new Date().getHours();
        const next24Hours = Array.from({ length: 24 }, (_, index) => (currentHour + index) % 24);

        next24Hours.forEach(hour => {
            const forecast = forecastData.find(item => new Date(item.dt * 1000).getHours() === hour);
            if (forecast) {
                const dateTime = new Date(forecast.dt * 1000);
                const weatherIcon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
                const temp = Math.round(forecast.main.temp);
                const weatherDescription = forecast.weather[0].description;
                const timeOfDay = dateTime.getHours() >= 12 ? "PM" : "AM";

                const forecastItem = document.createElement("div");
                forecastItem.classList.add("forecast-item");
                forecastItem.innerHTML = `<p>${dateTime.getHours() % 12 || 12} ${timeOfDay}</p>
                                           <img src="${weatherIcon}" alt="${weatherDescription}">
                                           <p>${temp}°C</p>`;
                forecastDetails.appendChild(forecastItem);
            }
        });
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});
