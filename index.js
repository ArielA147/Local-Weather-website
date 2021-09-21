const apiEndpoint = 'https://weather-proxy.freecodecamp.rocks/api/current'

let state = {
    hasLocation: false,
    latitude: 32.0958,
    longitude: 34.9522
};

/////// Functional core

// Co-effects: pull new information into the program

function fetchWeatherData(state) {
    const queryParams = new URLSearchParams({lat: state.latitude, lon: state.longitude});
    const url = apiEndpoint + "?" + queryParams.toString();

    return fetch(url, {method: 'GET'})
        .then(response => response.json())
        .then(data => {
            let values = extractValues(data);
            return {...state, ...values}
        })
        .catch(error => {
            console.error('Error:', error)
            return {...state, errorMessage: "Error fetching weather data: "+error};
        });
}

function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject("Geolocation API not available.");
        }
    });
}

// Pure functions

function extractLocation(position) {
    let lat = position.coords.latitude.toFixed(4);
    let lon = position.coords.longitude.toFixed(4);
    return {latitude: lat, longitude: lon};
}

function extractValues(data) {
    let state = {
        hasLocation: true,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        location: data.name,
        tempC: data.main.temp,
        feelsLikeC: data.main.feels_like,
        scale: 'C'
    };
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

/* the function returns a weather-sentence according to the weather type*/
function getWeatherSentence(weatherType){
    let weatherSentence = {
        "mist":  "The situation <br> is very unclear",
        "clear sky": "No clouds on <br> the horizon",
        "few clouds": "Are you on cloud <br> nine tonight?",
        "shower rain": "Heavens are open not <br> only for you today",
        "snow": "Under the weather <br> Under the blanket" ,
        "thounderstrom": "Warm pyjamas will be <br> a good choice!",
        "other": "It’s as plain as day <br> that it’ll be a lovely day!"
    };
    if (weatherSentence[weatherType] == undefined ){
        return weatherSentence.other;
    }
    else{
        return weatherSentence[weatherType];
    }
}


// Effects: change state or UI

function render(data) {
    if (data.errorMessage) {
        console.log("got error message", data.errorMessage);
        document.getElementById("location-problem").innerHTML = data.errorMessage;
    }
    if (data.hasLocation) {
        document.body.classList.remove("hide-weather-info");
        document.getElementById('data-watertype').innerHTML = data.description;
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
        document.getElementById('weather-sentence').innerHTML = getWeatherSentence(data.description);
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        var today= new Date();
        document.getElementById("date").innerHTML = today.getDate();
        document.getElementById("day-of-week").innerHTML = days[today.getDay()].substring(0,3);

        document.querySelector(".toggle-container").style.visibility = 'visible';
        document.querySelector(".more-information").style.visibility = 'visible';
    } else {
        document.body.classList.add("hide-weather-info");
        document.querySelector(".more-information").style.visibility = 'hidden';
        document.querySelector(".toggle-container").style.visibility = 'hidden';
    }
}

/* the function returns a background according to user's local time*/
function setBackgroundImageAccordingToTime(){
    const hours = new Date().getHours();
    const isDayTime = hours > 6 && hours < 16;
    if (isDayTime){
        document.getElementById("content").style.backgroundImage="url('background/day.png')";
    } else {
        document.getElementById("content").style.backgroundImage="url('background/night.png')";
    }
}

function toggleConvertingCelsiusFahrenheit(event) {
    state.scale = (state.scale == 'C') ? 'F' : 'C';
    render(state);
}

function confirmLocation() {
    getLocation()
        .then(loc => {
            let location = extractLocation(loc);
            return {...state, ...location}
        })
        .catch(e => {
            console.error("Failed to get location", e);
            if (e.message) {
                return {...state, errorMessage: "Failed to get location: " + e.message};
            } else {
                return {...state, errorMessage: "Failed to get location: " + e};
            }
        })
        .then(fetchWeatherData)
        .then(data => {
            render(data);
            state = data;
        });
}

// Event handlers

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    setBackgroundImageAccordingToTime();
}); 

document.getElementById("scale-toggle").onclick = toggleConvertingCelsiusFahrenheit;

/*the user gave premission to use his location*/
document.getElementById("confirm-location").addEventListener("click", (e)=>{
    document.getElementById('modal-container').classList.remove('show');
    confirmLocation(e);
});
