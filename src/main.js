import axios from "axios";

const cityInput = document.getElementById("cityInput");
const cityName = document.getElementsByClassName("cityName")[0];
const temperature = document.getElementsByClassName("temperature")[0];
const weatherDescription =
  document.getElementsByClassName("weatherDescription")[0];

(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
  let latitude;
  let longitude;
  function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    getWeatherData(latitude, longitude);
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
    }
  }
})();

const getlocation = async (location) => {
  const res = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${import.meta.env.VITE_API_KEY}`
  );
  console.log(res.data);
  let cityLong = res.data[0].lon;
  let citylat = res.data[0].lat;
  await getWeatherData(
    citylat,
    cityLong,
    res.data[0]?.name,
    res.data[0]?.state,
    res.data[0]?.country
  );
};

async function getWeatherData(citylat, cityLong, city, state, country) {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${citylat}&lon=${cityLong}&appid=${import.meta.env.VITE_API_KEY}`
  );
  console.log(res.data);
  console.log(cityName.innerHTML);
  cityName.innerHTML = `${city}, ${state}, ${country}` || res.data?.name;
  temperature.innerHTML = `${Math.floor(res.data?.main.temp - 273.15)}°C`;
  weatherDescription.innerHTML = `${res.data?.weather[0].description.toUpperCase()}`;
}

cityInput.addEventListener("change", () => {
  getlocation(cityInput.value);
  cityInput.value = null;
});