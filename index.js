let state = {
  hasLocation: false,
  scale: 'C'
};

const apiEndpoint = 'https://weather-proxy.freecodecamp.rocks/api/current?lat=32.0958&lon=34.9522';

function fetchWeatherData() {
    return fetch( apiEndpoint, {method: 'GET'})
        .then(response => response.json())
        .then(data => extractValues(data))
        .catch(error => {console.error('Error:', error)});
}

function extractValues(data) {
    console.log("Got API response:", data)
    let state = {
        hasLocation: true,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        location: data.name,
        tempC: data.main.temp,
        feelsLikeC: data.main.feels_like
    };
    console.log("New state:", state);
    return state;
}

/* the function adds a symbol of °F or °C */
function addSymbol(temp, symbol){
    temp = (symbol == 'F') ?  temp + '\xB0F' :  temp + '\xB0C' ;
    return temp;
}

function convertToFahrenheit(celsius) {
    let fahrenheit = celsius * 9/5 + 32;
    return Math.round(fahrenheit);
}

function render(data) {
    if (data.hasLocation) {
        document.body.classList.remove("hide-weather-info");
        document.getElementById('data-watertype').innerHTML = data.description;
        document.getElementById("icon-watertype22").src=data.icon;
        document.getElementById('humidity').innerHTML = data.humidity + '%';
        document.getElementById('wind-speed').innerHTML = data.windspeed + 'km/h';
        document.getElementById('current-location').innerHTML = data.location;
        if (data.scale == 'C') {
            document.getElementById('scale-toggle').classList.remove('active');
        } else {
            document.getElementById('scale-toggle').classList.add('active');
        }
        let temp = data.scale == 'C' ? data.tempC : convertToFahrenheit(data.tempC);
        let feelsLikeTemp = data.scale == 'C' ? data.feelsLikeC : convertToFahrenheit(data.feelsLikeC);

        document.getElementById('current-temp').innerHTML = addSymbol(Math.round(temp), data.scale);
        document.getElementById('data-temp-feels-like').innerHTML = addSymbol(Math.round(feelsLikeTemp), data.scale);
    } else {
        document.body.classList.add("hide-weather-info");
    }
}

function toggleConvertingCelsiusFahrenheit(event) {
    state.scale = (state.scale == 'C') ? 'F' : 'C';
    render(state);
}

function toggleLocation(event) {
    let messageEl = document.getElementById("loading-message");
    if (event.target.checked){
        messageEl.innerHTML = "Fetching weather data...";
        // extract the data
        fetchWeatherData().then(data => {
            messageEl.innerHTML = "";
            state = {...state, ...data};
            render(state);
        });
    } else{
        // hide all the data we extract from the API
        state.hasLocation = false;
        render(state);
    }
}

// event listener on the button clicked
document.getElementById("use-location").onclick = toggleLocation;
document.getElementById("scale-toggle").onclick = toggleConvertingCelsiusFahrenheit;
