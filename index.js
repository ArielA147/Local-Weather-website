/*popup*/
const open_btn = document.getElementById('open');
const confirm_btn = document.getElementById('confirm');

let url_location;

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }}
  
  function showPosition(position) {
    let lat = position.coords.latitude.toFixed(4);
    let long = position.coords.longitude.toFixed(4);
    url_location = 'https://weather-proxy.freecodecamp.rocks/api/current?lat='+lat+'&lon='+long;
    console.log("1: " + url_location);
}

open_btn.addEventListener('click', ()=>{
    document.getElementById('modal_container').classList.add('show');
    informationVisibilty('hide');
});

/*the user gave premission to use his location*/
confirm_btn.addEventListener('click', ()=>{
    document.getElementById('modal_container').classList.remove('show');
    informationVisibilty('show');
});

function informationVisibilty(visibility){
    if (visibility == 'hide'){
        // hide all the data we extract from the API
        document.getElementById("current-temp").innerHTML = "";
        document.getElementById('current-locaiton').innerHTML = "";
        document.getElementById("data-watertype").innerHTML = "";
        document.getElementById("weather-sentence").innerHTML = "";
        // document.getElementById("feels-like-temp").innerHTML = "";
        document.querySelector(".more-information").style.visibility = 'hidden';
        document.querySelector(".toggle-container").style.visibility = 'hidden';
        document.getElementById("location_problem").style.display="visible";
    }
    else{
        document.getElementById("location_problem").style.display="none";
        document.querySelector(".location-problem").style.visibility= "none";
        
        // getLocation(); // TODO : fix inorder to extreact the url locatin dynamicly
        url_location = "https://weather-proxy.freecodecamp.rocks/api/current?lat=31.9521&lon=34.9066";

        // present infortion for the user about his weather in his location
        getData(url_location) // extract the 
        document.querySelector(".toggle-container").style.visibility = 'visible';
        document.querySelector(".more-information").style.visibility = 'visible';
    }
}

function getData(url){
    // const url = 'https://weather-proxy.freecodecamp.rocks/api/current?lat=32.0958&lon=34.9522';
    fetch( url, {
        method: 'GET'
    })
    .then(response => response.json())
    // .then(data => console.log(data)) // the output of the response json 
    .then(data => {
        extractValues(data)
        extractData(data)
        updateCurrentTemp(data)
        updateFeelsLikeTemp(data)
        getWeatherSentence(data)
    })
    .catch(error => {console.error('Error:', error)});
}

function extractValues(data){
    console.log(data);
}

function extractData(data){
    document.getElementById('data-watertype').innerHTML = data.weather[0].description;
    document.getElementById('humidity').innerHTML = data.main.humidity +'%';
    document.getElementById('wind-speed').innerHTML = data.wind.speed +'km/h';
    document.getElementById('current-locaiton').innerHTML = data.name;
}


let tempCelsius;
let feelsLiketempCelsius;

/* the funciton adds a symbol of °F or °C */
function addSymbol(temp, symbol){
    temp = (symbol == 'F') ?  temp +'\xB0F' :  temp +'\xB0C' ;
    return temp;
}

function updateCurrentTemp(data){
    tempCelsius =  Math.round(data.main.temp);
    document.getElementById('current-temp').innerHTML = addSymbol(tempCelsius, 'C');
}

function updateFeelsLikeTemp(data){
    feelsLiketempCelsius =  Math.round(data.main.feels_like);
    document.getElementById('data-temp-feels-like').innerHTML = addSymbol(feelsLiketempCelsius, 'C');
}

function convertToFahernheit(celsius) {
    let fahrenheit = celsius * 9/5 + 32;
    return Math.round(fahrenheit);
  }

function toggleConvertingCelsiusFahrenheit()
{
    if (document.querySelector(".toggle-btn").classList.contains('active')){ // the user wants to see temperature in Fahernheit
        document.getElementById("current-temp").innerHTML= addSymbol(convertToFahernheit(tempCelsius),'F');
        document.getElementById("data-temp-feels-like").innerHTML= addSymbol(convertToFahernheit(feelsLiketempCelsius), 'F');
    }
    else {
        document.getElementById("current-temp").innerHTML= addSymbol(tempCelsius, 'C');
        document.getElementById("data-temp-feels-like").innerHTML = addSymbol(feelsLiketempCelsius, 'C');
    }
}

/* the function returns a weather-sentence according to the weather type*/
function getWeatherSentence(data){
    weatherType =  data.weather[0].description;
    switch(weatherType){
        case 'mist':
            document.getElementById("weather-sentence").innerHTML = "The situation <br> is very unclear"
            break;
        case 'clear sky':
            document.getElementById("weather-sentence").innerHTML = "No clouds on <br> the horizon"
            break;
        case 'few clouds':
            document.getElementById("weather-sentence").innerHTML = "Are you on cloud <br> nine tonight?"
            break;
        case 'shower rain':
            document.getElementById("weather-sentence").innerHTML = "Heavens are open not <br> only for you today"
            break;
        case 'snow':
            document.getElementById("weather-sentence").innerHTML = "Under the weather <br> Under the blanket"
            break;
        case 'thounderstrom':
            document.getElementById("weather-sentence").innerHTML = "Warm pyjamas will be <br> a good choice!"
            break;
        default:
            document.getElementById("weather-sentence").innerHTML = "It’s as plain as day <br> that it’ll be a lovely day!";
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