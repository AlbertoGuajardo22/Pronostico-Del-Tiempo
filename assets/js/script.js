var buscarBtn = document.querySelector("#buscar-Btn");
var resultadoCon = document.querySelector("#resultado-Con");
var BuscarCiudad = document.querySelector("#city-search"); 
var contenedor = document.querySelector("#Info-contenedor");
var Pronostico = document.querySelector("#PronosticoInf");
var alerta = document.querySelector("#alert");
var PronosticoContenedor = document.querySelector("#cityPronostico");
var PronosticoBtn = document.querySelector("#cityPronostico");

var currentDate = moment().format("DD/MM/YYYY");
var dayIndex = 1
var cityHistory = [];

var formSubmitHandler = function(event) {
  event.preventDefault();

  var userCity = BuscarCiudad.value.trim();

  if (userCity) {
    getLatLong(userCity);
    BuscarCiudad.value = "";
    alerta.className = "alert"
    alerta.classList.add("hide");
  }
  else {
    BuscarCiudad.value = "";
    alerta.classList.remove("hide");
  }
};

var getLatLong = function(userInput) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=metric&appid=e6f1180431902688ee08af2326efb755`
  fetch(apiUrl)
      .then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
            var cityName = data.name;
            dayIndex = 1;
            getForecast(data, cityName);
            searchHistory(cityName);
          })
        }
        else {
          alerta.classList.remove("hide");
          return formSubmitHandler();
        }
      })
}

var getForecast = function(data, cityName) {
  resultadoCon.classList.remove("hide");
  var latEl = data.coord.lat
  var longEl = data.coord.lon
  var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latEl}&lon=${longEl}&units=metric&appid=e6f1180431902688ee08af2326efb755`
  fetch(apiUrl)
      .then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
            displayForecast(data, cityName)
          })
        }
      })
}

var searchHistory = function(cityName) {
  var getHistoryStorage = JSON.parse(localStorage.getItem("City History"));
  var historyBtn = document.createElement("button");
  if (getHistoryStorage === null) {
    cityHistory.push(cityName);
    historyBtn.textContent = cityName;
    historyBtn.classList.add("w-100");
    historyBtn.classList.add("history-btn");
    historyBtn.setAttribute("id", "cityPronostico");
    PronosticoContenedor.appendChild(historyBtn);
    localStorage.setItem("City History", JSON.stringify(cityHistory));
  }
  else {
    cityHistory = getHistoryStorage;
    if (cityHistory.includes(cityName)) {
      return null;
    }
    else {
      historyBtn.textContent = cityName;
      historyBtn.classList.add("w-100");
      historyBtn.classList.add("history-btn");
      historyBtn.setAttribute("id", "cityPronostico");
      PronosticoContenedor.appendChild(historyBtn);
      cityHistory.push(cityName);
      localStorage.setItem("City History", JSON.stringify(cityHistory));
    }
  }       
}

var getSearchHistory = function() {
  var getHistoryStorage = JSON.parse(localStorage.getItem("City History"));
  if (getHistoryStorage === null) {
    return;
  }
  else {
    cityHistory = getHistoryStorage;
    for (var i = 0; i < cityHistory.length; i++) {
    var historyBtn = document.createElement("button");
    historyBtn.textContent = cityHistory[i];
    historyBtn.classList.add("w-100");
    historyBtn.classList.add("history-btn");
    historyBtn.setAttribute("id", "cityPronostico");
    PronosticoContenedor.appendChild(historyBtn);
    }
  }
}

var recallHistory = function(event) {
  var cityHistoryText = event.target.textContent;
  dayIndex = 1;
  getLatLong(cityHistoryText);
}

var displayForecast = function(weatherData, cityName) {
  var cityNameEl = document.querySelector("#city-name");
  var tempEl = document.querySelector("#temp");
  var windEl = document.querySelector("#wind");
  var humidityEL = document.querySelector("#humidity");

  var iconImg = document.querySelector("#icon-img");
  if (weatherData.status === "city not found") {
    console.log("Nothing");
  }
  else {
    iconImg.src = `http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}.png`
    cityNameEl.textContent = `${cityName} (${currentDate})`;
    tempEl.textContent = weatherData.current.temp
    windEl.textContent = weatherData.current.wind_speed
    humidityEL.textContent = weatherData.current.humidity

    var uvIndex = weatherData.current.uvi
 
    var i = 0;
    $(".forecast-box").each(function() {
      var futureDay = moment().add(dayIndex, "days").format("DD/MM/YYYY");
      var futureDate = $(this).find("span")[0];
      var futureTemp = $(this).find("span")[1];
      var futureWind = $(this).find("span")[2];
      var futureHumidity = $(this).find("span")[3];
      var futureIcon = $(this).find("img")[0];
      futureDate.textContent = futureDay;
      futureIcon.src = `http://openweathermap.org/img/wn/${weatherData.daily[i].weather[0].icon}.png`
      futureTemp.textContent = weatherData.daily[i].temp.day;
      futureWind.textContent = weatherData.daily[i].wind_speed;
      futureHumidity.textContent = weatherData.daily[i].humidity;
      i++;
      dayIndex++;
    })
  }
}

getSearchHistory();
buscarBtn.addEventListener("click", formSubmitHandler);
PronosticoBtn.addEventListener("click", recallHistory);