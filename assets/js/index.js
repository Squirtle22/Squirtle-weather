const apiKey = '';
// Get the current date and time
function updateDatetime() {
const currentDatetime = new Date();
const formattedDatetime = currentDatetime.toLocaleString();
document.getElementById("currentDatetime").textContent = formattedDatetime;
}

// Initially, call the updateDatetime function to display the current date and time
updateDatetime();

// Set up an interval to update the time every second (1000 milliseconds)
setInterval(updateDatetime, 1000);

// Function to fetch weather data using coordinates and display it
function fetchWeatherDataAndDisplay(latitude, longitude ) {
  // Replace 'YOUR_API_KEY' with your OpenWeatherMap API key

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.name)
      console.log(data.main)
      const city = data.name;
      const temperature = data.main.temp;      
      const unitLink = document.getElementById("unitLink");
      
      // Display the city and temperature on the page
      document.getElementById("cityName").textContent = city;
      document.getElementById("temperatureValue").textContent = Math.round(temperature);
      unitLink.textContent = "°C";
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

// Function to handle button click
function handleCurrentLocationButtonClick() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        // Call the function to fetch and display weather data
        fetchWeatherDataAndDisplay(latitude, longitude);
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

// Add a click event listener to the current location button
document
  .getElementById("currentLocationButton")
  .addEventListener("click", handleCurrentLocationButtonClick);


// Function to fetch weather data and return the temperature
function getTemperature(cityName, callback) {
  // Replace 'YOUR_API_KEY' with your OpenWeatherMap API key
  const apiKey = '';

  // Create the API URL with the city name and API key (using imperial units for Fahrenheit)
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

  // Use Axios to send the request to the OpenWeatherMap API
  axios
    .get(apiUrl)
    .then(function (response) {
      // Extract the temperature in Fahrenheit from the API response
      const temperatureFahrenheit = response.data.main.temp;
      console.log(response.data.main);

      // Pass the temperature back to the callback function
      callback(temperatureFahrenheit);
    })
    .catch(function (error) {
      // Handle any errors that occur during the request
      console.error(error);
    });
}

document.getElementById("currentLocationButton").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      // Do something with the latitude and longitude, like display it on the screen.
    }, (error) => {
      // Handle error cases
      console.error(error);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

// Convert Fahrenheit to Celsius
function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function formatCityName(cityName) {
  return cityName.charAt(0).toUpperCase() + cityName.slice(1);
}

// Toggle temperature conversion between Celsius and Fahrenheit
function toggleTemperatureUnit() {
  const temperatureElement = document.getElementById("temperatureValue");
  const currentTemperature = parseInt(temperatureElement.textContent);
  const unitLink = document.getElementById("unitLink");

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

// Function to handle the search button click event
function handleSearch() {
  // Get the city name entered by the user from the HTML input element
  const cityNameInput = document.getElementById("cityInput").value;

  // 
  const unitLink = document.getElementById("unitLink");
  // Format the city name
  const formattedCityName = formatCityName(cityNameInput);

  // Call the getTemperature function with the formatted city name
  getTemperature(formattedCityName, function (temperatureFahrenheit) {

    // Convert the temperature to Celsius
    const temperatureCelsius = fahrenheitToCelsius(temperatureFahrenheit);

    // Display the formatted city name in the HTML
    document.getElementById("cityName").textContent = formattedCityName;

    // Update the existing temperature element in the HTML with the converted temperature
    const temperatureElement = document.getElementById("temperatureValue");
    temperatureElement.textContent = Math.round(temperatureCelsius);
    unitLink.textContent = "°C";
    // Here, you can perform any other actions with the temperature data
  });
}

// Add a click event listener to the search button
document.getElementById("searchButton").addEventListener("click", handleSearch);

// Add click event listeners to the unit links (Celsius and Fahrenheit)
document.getElementById("unitLink").addEventListener("click", toggleTemperatureUnit);