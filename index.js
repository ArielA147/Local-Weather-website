const apiEndpoint = 'https://weather-proxy.freecodecamp.rocks/api/current?lat=32.0958&lon=34.9522';
// todo : change apiEndpoint to get location dynamic and not hard coded

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }}
  function showPosition(position) {
    let lat = position.coords.latitude.toFixed(4);
    let long = position.coords.longitude.toFixed(4);
    apiEndpoint = 'https://weather-proxy.freecodecamp.rocks/api/current?lat='+lat+'&lon='+long;
    console.log("5 "+apiEndpoint);
}

/*popup*/
let url_location;

document.getElementById('open').addEventListener('click', ()=>{
    document.getElementById('modal_container').classList.add('show');
    // informationVisibilty('hide');
});

/*the user gave premission to use his location*/
document.getElementById('confirm').addEventListener('click', ()=>{
    document.getElementById('modal_container').classList.remove('show');
    // informationVisibilty('show');
});

let state = {
    hasLocation: false
  };

function fetchWeatherData() {
    return fetch( apiEndpoint, {method: 'GET'})
    .then(response => response.json())
    .then(data => extractValues(data))
    .catch(error => {console.error('Error:', error)});
}

function extractValues(data) {
    // console.log("Got API response:", data)
    state = {
        hasLocation: true,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        location: data.name,
        tempC: data.main.temp,
        feelsLikeC: data.main.feels_like,
        scale: 'C'
    };
    console.log("tempC : ", state.tempC);
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
    // console.log("start rendering");
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

        document.getElementById("location_problem").style.display="none";
        document.querySelector(".toggle-container").style.visibility = 'visible';
        document.querySelector(".more-information").style.visibility = 'visible';

    } else {
        document.body.classList.add("hide-weather-info");
        document.getElementById("location_problem").style.display="visible";
        document.querySelector(".more-information").style.visibility = 'hidden';
        document.querySelector(".toggle-container").style.visibility = 'hidden';

    }
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

/* the function returns a background according to user's local time*/
function setBackgroundImageAcourdingToTime(){
    const hours = new Date().getHours();
    const isDayTime = hours > 6 && hours < 13;
    if (isDayTime){
        document.main.style.background = "url('background/day.svg')";
    } else {
        document.main.style.background = "url('background/night.svg')";
    }
}

function toggleConvertingCelsiusFahrenheit(event) {
    state.scale = (state.scale == 'C') ? 'F' : 'C';
    render(state);
}

function toggleLocation(event) {
    let messageEl = document.getElementById("loading-message");
    console.log("4 - todo FIX THIS"+event.target.checked);
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
        state.hasLocation = true; // needs to be false
        fetchWeatherData().then(state =>{
            render(state);
        });
    }
}

// function informationVisibilty(visibility){
//     if (visibility == 'hide'){
//         // hide all the data we extract from the API
//         document.getElementById("current-temp").innerHTML = "";
//         document.getElementById('current-location').innerHTML = "";
//         document.getElementById("data-watertype").innerHTML = "";
//         document.getElementById("weather-sentence").innerHTML = "";
//         // document.getElementById("feels-like-temp").innerHTML = "";
//         document.querySelector(".more-information").style.visibility = 'hidden';
//         document.querySelector(".toggle-container").style.visibility = 'hidden';
//         document.getElementById("location_problem").style.display="visible";
//     }
//     else{
//         document.getElementById("location_problem").style.display="none";
//         document.querySelector(".location-problem").style.visibility= "none";
        
//         // TODO : fix inorder to extreact the url locatin dynamicly
//         url_location = "https://weather-proxy.freecodecamp.rocks/api/current?lat=31.9521&lon=34.9066";

//         // present infortion for the user about his weather in his location
//         // getData(url_location) // extract the 
//         document.querySelector(".toggle-container").style.visibility = 'visible';
//         document.querySelector(".more-information").style.visibility = 'visible';
//     }
// }

// event listener on the button clicked
// document.getElementById("use-location").onclick = toggleLocation;
document.getElementById("confirm").onclick=toggleLocation;
document.getElementById("scale-toggle").onclick = toggleConvertingCelsiusFahrenheit;

