const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const cityInput = document.getElementById("cityInput");
const placeEl = document.querySelector(".place");
const weatherInfoEl = document.createElement("div");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_key = "f46c19b5eb0ec976086ee480b8b6da29";

function updateWeatherData(city) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`;

  fetch(weatherURL)
    .then((response) => response.json())
    .then((data) => {
      const temperature = Math.round(data.main.temp - 273.15);
      const humidity = data.main.humidity;

      const time = new Date();
      const month = time.getMonth();
      const date = time.getDate();
      const day = time.getDay();
      const hour = time.getHours();
      const hourIn12HrFormat = hour >= 13 ? hour % 12 : hour;
      const minutes = time.getMinutes();
      const ampm = hour >= 12 ? "PM" : "AM";

      timeEl.innerHTML =
        (hourIn12HrFormat % 12 || 12) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes) +
        " " +
        `<span id="am-pm">${ampm}</span>`;

      dateEl.innerHTML = days[day] + ", " + date + " " + months[month];

      placeEl.textContent = city;

      // Create the weather information HTML
      weatherInfoEl.innerHTML = `Temperature: ${temperature}°C<br>Humidity: ${humidity}%`;
      document.getElementById("current-date").appendChild(weatherInfoEl);
    })
    .catch((error) => {
      console.log("Error fetching weather data:", error);
    });
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const geoURL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_key}`;

        fetch(geoURL)
          .then((response) => response.json())
          .then((data) => {
            const city = data[0].name;
            updateWeatherData(city);
          })
          .catch((error) => {
            console.log("Error fetching city data:", error);
          });
      },
      (error) => {
        console.log("Error getting current location:", error);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

document.getElementById("search").addEventListener("submit", function (event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city !== "") {
    weatherInfoEl.innerHTML = "";
    updateWeatherData(city);
  }
});

document.getElementById("currentButton").addEventListener("click", function () {
  getCurrentLocation();
});
