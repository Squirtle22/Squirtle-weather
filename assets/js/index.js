// API key for OpenWeatherMap
const apiKey = '459a17a0442057005bfd7be5d7f4ae13'; //api key needed get from https://openwea9thermap.org/api

// Variables to store city name, latitude, and longitude
let cityName = ''; // Initialize with the default city name
let latitude = '';
let longitude = '';

// DOM element for unit link (Celsius/Fahrenheit)
const unitLink = document.getElementById("unitLink");

// Function to get the current date and time
function getCurrentDatetime() {
  const currentDatetime = new Date();
  return currentDatetime
}

// Function to update the date and time displayed on the webpage
function updateDatetime() {
  const formattedDatetime = getCurrentDatetime();
  const newdatetime = formattedDatetime.toLocaleString();
  document.getElementById("currentDatetime").textContent = newdatetime;
}

const datetime = getCurrentDatetime()
const day = datetime.getDay()


// Function to create and update the temperature chart
// Function to create and update the temperature chart
function createTemperatureChart(chart, labels, temperatureData) {
  chart.data.labels = labels;
  chart.data.datasets[0].data = temperatureData;
  chart.update(); // Update the chart with new data
}

const ctx = document.getElementById('temperatureChart').getContext('2d');
let temperatureChart; // Declare a variable to store the chart instance globally

// Create the initial temperature chart with empty data
temperatureChart = new Chart(ctx, {
  type: 'bar', // Use a line chart for temperature data
  data: {
    labels: [],
    datasets: [{
      label: 'Temperature (°C)',
      data: [],
      borderColor: 'blue',
      backgroundColor: 'rgba(0,0,139)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: false
      },

    }
  }
});



// Function to make the API call to fetch weather data
function getAPICall(search) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?${search}&appid=${apiKey}&units=metric`;

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Extract weather data from the API response
      const city = data.city.name;
      const temperatureCelsius = data.list[0].main.temp;
      const humidity = data.list[0].main.humidity;
      const pressure = data.list[0].main.pressure;
      const wind = Math.round(data.list[0].wind.speed);
      const windDirection = data.list[0].wind.deg;
      const condition = data.list[0].weather[0].description;
      const windDirectionCardinal = degreesToCardinal(windDirection);
      const weatherIconCode = data.list[0].weather[0].icon;
      const weatherIconUrl = `https://openweathermap.org/img/w/${weatherIconCode}.png`;


      // Log data and condition to the console
      console.log(weatherIconUrl);
      // console.log(condition);

      // Update elements on the page with the fetched weather data
      updateElementText("cityName", city);
      updateElementText("temperatureValue", Math.round(temperatureCelsius));
      updateElementText("humidity", `Humidity: ${humidity}%`);
      updateElementText("wind", `Wind: ${wind} mph`);
      updateElementText("windDirection", `Wind Direction: ${windDirectionCardinal}`);
      updateElementText("condition", `Condition: ${condition}`);
      document.getElementById("weatherIcon").src = weatherIconUrl;



      // Call the function to create the 5-day weather forecast
      createFiveDayWeatherForecast(data);

      const labels = data.list.map((item) => getFormattedDate(item.dt_txt));
      const temperatureData = data.list.map((item) => item.main.temp);
      createTemperatureChart(temperatureChart, labels, temperatureData);
      
      
    })
    .catch((error) => {
      // Handle errors and display an alert for an invalid city name
      console.error("Error fetching weather data:", error);
      alert("Invalid city name. Please enter a valid city name.");
    });
}

// Function to format the date string to include day of the month and time
function getFormattedDate(dateString) {
  const date = new Date(dateString);
  const dayOfMonth = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Pad single-digit hours and minutes with a leading zero
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${dayOfMonth}/${formattedHours}:${formattedMinutes}`;
}

// Function to handle the search button click event
function handleSearch() {
  // Get the city name entered by the user from the input field
  cityName = document.getElementById("cityInput").value;

  // Check if the city name is empty
  if (cityName.trim() === "") {
    alert("Please enter a valid city name.");
    return;
  }

  // Check if the city name contains only letters and spaces (validity check)
  if (!/^[A-Za-z\s]+$/.test(cityName)) {
    alert("Invalid city name. Please enter a valid city name.");
    return;
  }

  // Call the function to make the API call with the formatted city name
  getAPICall(`q=${cityName}`);

  // Clear the input field after making the API call
  document.getElementById("cityInput").value = '';
}


// Function to handle Enter key press in the input field
function handleEnterKeyPress(event) {
  if (event.key === "Enter") {
    handleSearch(); // Call the handleSearch function if Enter key is pressed
  }
}

// Function to handle the current location button click event
function handleCurrentLocationButtonClick() {
  if (navigator.geolocation) {
    // Get the user's current geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        // Call the function to make the API call with latitude and longitude
        getAPICall(`lat=${latitude}&lon=${longitude}`);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to retrieve location. Please try again.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Function to convert Fahrenheit to Celsius
function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

// Helper function to update element text content and the unit link
function updateElementText(elementId, text) {
  document.getElementById(elementId).textContent = text;
  unitLink.textContent = "°C";
}

// Function to toggle between Celsius and Fahrenheit units
function toggleTemperatureUnit() {
  const temperatureElement = document.getElementById("temperatureValue");
  const currentTemperature = parseInt(temperatureElement.textContent);

  if (unitLink.textContent === "°C") {
    // Switch to Fahrenheit
    const temperatureFahrenheit = (currentTemperature * 9 / 5) + 32;
    temperatureElement.textContent = Math.round(temperatureFahrenheit);
    unitLink.textContent = "°F";
  } else {
    // Switch to Celsius
    const temperatureCelsius = (currentTemperature - 32) * 5 / 9;
    temperatureElement.textContent = Math.round(temperatureCelsius);
    unitLink.textContent = "°C";
  }
}

// Function to convert degrees to cardinal directions
function degreesToCardinal(degrees) {
  const cardinals = ["North", "North East", "East", "South East", "South", "South West", "West", "North West"];
  const index = Math.round((degrees % 360) / 45);
  return cardinals[index];
}


// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');

// Check local storage for dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
  document.documentElement.setAttribute('data-dark-mode', 'true');
}

darkModeToggle.addEventListener('click', () => {
  if (document.documentElement.hasAttribute('data-dark-mode')) {
    document.documentElement.removeAttribute('data-dark-mode');
    localStorage.setItem('darkMode', 'disabled');
    // Change the icon to the moon
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';

  } else {
    document.documentElement.setAttribute('data-dark-mode', 'true');
    localStorage.setItem('darkMode', 'enabled');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';


  }
});

// create a function that loops though the results of the api call creating 5 days of weather
// placing thme in a li attached to the ul with the id of 5day
// Function to create a 5-day weather forecast
function createFiveDayWeatherForecast(weatherData) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const forecastList = weatherData.list;

  // Get the ul element where you want to append the forecast items
  const forecastListElement = document.getElementById("5Days");

  // Clear any existing forecast items
  forecastListElement.innerHTML = "";

  for (let i = 0; i < forecastList.length; i += 8) {
    const forecastItem = forecastList[i];
    const datetime = new Date(forecastItem.dt * 1000);
    const dayOfWeek = days[datetime.getDay()];

    // Create a new li element for each day's forecast
    const listItem = document.createElement("li");
    listItem.classList.add("px-2");

    // Create the forecast content
    const forecastContent = `
      <a href="#" class="text-decoration-none text-black p-1">
        <div>
          <h3 class="border border-black rounded p-3">${dayOfWeek}</h3>
          <div class="border border-black rounded">
            <img src="https://openweathermap.org/img/w/${forecastItem.weather[0].icon}.png" alt="" class="px-4" width="100" height="50">
            <p class="px-4">${Math.round(forecastItem.main.temp)}°C</p>
          </div>
        </div>
      </a>
    `;

    listItem.innerHTML = forecastContent;

    // Append the forecast item to the ul
    forecastListElement.appendChild(listItem);
  }
}

// Inside the click event listener for the search button
document.getElementById("searchButton").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value;
  getAPICall(`q=${city}`);
});


// Inside the click event listener for the search button
document.getElementById("searchButton").addEventListener("click", handleSearch);


// Add a key press event listener to the input field
document.getElementById("cityInput").addEventListener("keypress", handleEnterKeyPress);

// Add click event listeners to the unit links (Celsius and Fahrenheit)
document.getElementById("unitLink").addEventListener("click", toggleTemperatureUnit);

// Add a click event listener to the current location button
document.getElementById("currentLocationButton").addEventListener("click", handleCurrentLocationButtonClick);

// Initially, call the updateDatetime function to display the current date and time
updateDatetime();

// Set up an interval to update the time every second (1000 milliseconds)
setInterval(updateDatetime, 1000);

// Add an event listener for the 'load' event on the window object
window.addEventListener('load', handleCurrentLocationButtonClick);



