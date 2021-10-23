//variables
var inputEl = document.querySelector("input[name=city");
var submitBtn = document.querySelector("#searchbtn");
var previousCitiesContainer = document.querySelector("#previous-cities");
var mainEl = document.querySelector("#main-card");
var forecast = document.querySelector("#forecast");
var formEl = document.querySelector("form");
var cityButtons = [];
var openWeathApiKey = "b8323a613e2197cd9fb8b813e902ecf7";

function searchAndGenerateWeather(city) {
  //clear the html for new content
  mainEl.innerHTML = "";
  forecast.innerHTML = "";

  var geoLocateCityURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    ",US&limit=5&appid=" +
    openWeathApiKey;

  fetch(geoLocateCityURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var cityInfo = data[0];
      var getWeatherUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        cityInfo.lat +
        "&lon=" +
        cityInfo.lon +
        "&exclude=minutely,hourly&units=imperial&appid=" +
        openWeathApiKey;

      fetch(getWeatherUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (weatherData) {
          var cityNameEl = document.createElement("h2");
          cityNameEl.textContent = city.toUpperCase() + " "+  moment.unix(weatherData.current.sunrise).format("DD/MM/YYYY");
          var mainWeatherIcon = document.createElement("img");
          mainWeatherIcon.setAttribute(
            "src",
            "https://openweathermap.org/img/w/" +
              weatherData.current.weather[0].icon +
              ".png"
          );
          cityNameEl.append(mainWeatherIcon);

          mainEl.append(cityNameEl);

          var cityWeatherList = document.createElement("ul");

          var temp = document.createElement("li");
          temp.textContent = "Temp: " + weatherData.current.temp + " F";
          cityWeatherList.append(temp);

          var wind = document.createElement("li");
          wind.textContent =
            "Wind speed: " + weatherData.current.wind_speed + " mph";
          cityWeatherList.append(wind);

          var humidity = document.createElement("li");
          humidity.textContent =
            "Humidty: " + weatherData.current.humidity + "%";
          cityWeatherList.append(humidity);

          var uvi = document.createElement("li");
          uvi.textContent = "UV index: " + weatherData.current.uvi;
          cityWeatherList.append(uvi);

          mainEl.append(cityWeatherList);

          if (parseInt(weatherData.current.uvi) < 3) {
            uvi.classList.add('btn-success');
          } else if (parseInt(weatherData.current.uvi) < 7) {
            uvi.classList.add('btn-warning');
          } else {
            uvi.classList.add('btn-danger');
          }

          //--------------------------
          // Forcast Section --------
          var forecastTitle = document.createElement("h2");
          forecastTitle.textContent = "5-day Forecast";
          forecast.append(forecastTitle);

          for (var i = 0; i < 5; i++) {
            var dailyWeather = weatherData.daily[i];
            var fiveDayForecast = document.createElement("ul");
            fiveDayForecast.classList.add("card")
            fiveDayForecast.classList.add("d-inline-block")


            var date = moment.unix(dailyWeather.sunrise).format("DD/MM/YYYY");

            fiveDayForecast.append(date);
            var weatherIcon = document.createElement("img");
            weatherIcon.setAttribute(
              "src",
              "https://openweathermap.org/img/w/" +
                dailyWeather.weather[0].icon +
                ".png"
            );
            fiveDayForecast.append(weatherIcon);

            var temp = document.createElement("li");
            temp.textContent = "Temp: " + dailyWeather.temp.day + " F";
            fiveDayForecast.append(temp);

            var wind = document.createElement("li");
            wind.textContent = "Wind speed: " + dailyWeather.wind_speed + " mph";
            fiveDayForecast.append(wind);

            var humidity = document.createElement("li");
            humidity.textContent = "Humidty: " + dailyWeather.humidity + "%";
            fiveDayForecast.append(humidity);

            forecast.append(fiveDayForecast);
          }
        });
    });
}
formEl.addEventListener("click", function (e) {
  e.preventDefault();
  var searchValue = inputEl.value.trim();

  if (!searchValue) {
    return;
  }

  cityButtons.push(searchValue)
  searchAndGenerateWeather(searchValue);
  makeButtons()
});

function intialLoad() {
  var previousCitiesButtons = localStorage.getItem("previousCities");
  if (previousCitiesButtons) {
    cityButtons = JSON.parse(previousCitiesButtons);
    makeButtons();
  }
}

function makeButtons() {
  for (var i = 0; i < cityButtons.length; i++) {
    const city = cityButtons[i];
    var newBtn = document.createElement("button");

    newBtn.textContent = city;
    newBtn.setAttribute("data-value", city);

    newBtn.addEventListener("click", function () {
      var searchCity = this.getAttribute("data-value");
      searchAndGenerateWeather(searchCity);
    });
    previousCitiesContainer.append(newBtn);
  }


  localStorage.setItem("previousCities", JSON.stringify(cityButtons));
}

intialLoad()
