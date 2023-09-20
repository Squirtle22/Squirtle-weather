// API key for OpenWeatherMap
const apiKey = '459a17a0442057005bfd7be5d7f4ae13'; //api key needed get from https://openweathermap.org/api

// Variables to store city name, latitude, and longitude
let cityName = ''; // Initialize with the default city name
let latitude = '';
let longitude = '';

// DOM element for unit link (Celsius/Fahrenheit)
const unitLink = document.getElementById("unitLink");

// Function to get the current date and time
function getCurrentDatetime() {
  const currentDatetime = new Date();
  return currentDatetime.toLocaleString();
}

// Function to update the date and time displayed on the webpage
function updateDatetime() {
  const formattedDatetime = getCurrentDatetime();
  document.getElementById("currentDatetime").textContent = formattedDatetime;
}

// Function to make the API call to fetch weather data
function getAPICall(search) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?${search}&appid=${apiKey}&units=metric`;

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Extract weather data from the API response
      const city = data.name;
      const temperatureCelsius = data.main.temp;
      const humidity = data.main.humidity;
      const pressure = data.main.pressure;
      const temp_max = data.main.temp_max;
      const temp_min = data.main.temp_min;
      const wind = Math.round(data.wind.speed);
      const windDirection = data.wind.deg;
      const condition = data.weather[0].description;
      const windDirectionCardinal = degreesToCardinal(windDirection);
      
      // Log data and condition to the console
      console.log(data);
      console.log(condition);

      // Update elements on the page with the fetched weather data
      updateElementText("cityName", city);
      updateElementText("temperatureValue", Math.round(temperatureCelsius));
      updateElementText("humidity", `Humidity: ${humidity}%`);
      updateElementText("wind", `Wind: ${wind} mph`);
      updateElementText("windDirection", `Wind Direction: ${windDirectionCardinal}`);
      updateElementText("condition", `Condition: ${condition}`);
    })
    .catch((error) => {
      // Handle errors and display an alert for an invalid city name
      console.error("Error fetching weather data:", error);
      alert("Invalid city name. Please enter a valid city name.");
    });
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




// Add a click event listener to the search button
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
