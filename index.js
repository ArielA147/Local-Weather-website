function getData(){
    const url = 'https://weather-proxy.freecodecamp.rocks/api/current?lat=32.0958&lon=34.9522';
    fetch( url, {
        method: 'GET'
    })
    .then(response => response.json())
    // .then(data => console.log(data)) // the output of the response json 
    .then(data => {
        // extractValues(data)
        getWeatherText(data)
        getWeatherIcon(data)
        updateCurrentTemp(data)
        updateFeelsLikeTemp(data)
    })
    .catch(error => {console.error('Error:', error)});
}

function extractValues(data){
    console.log(data);
}

function getWeatherText(data){
    document.getElementById('data-watertype').innerHTML = data.weather[0].description;
}

function getWeatherIcon(data){
    document.getElementById("icon-watertype22").src=data.weather[0].icon;
}

let tempCelsius;
let feelsLiketempCelsius;

function updateCurrentTemp(data){
    tempCelsius =  Math.round(data.main.temp) +'\xB0C';
    document.getElementById('data-temp').innerHTML = tempCelsius;
}

function updateFeelsLikeTemp(data){
    feelsLiketempCelsius =  Math.round(data.main.feels_like) +'\xB0C';
    document.getElementById('data-temp-feels-like').innerHTML = feelsLiketempCelsius;
}

function convertToF(celsius) {
    let fahrenheit = celsius.match(/\d+/)[0] * 9/5 + 32;
    return Math.round(fahrenheit)+'\xB0F';
  }

function toggle()
{
    var temp = document.getElementById("data-temp").innerHTML ? document.getElementById("data-temp").innerHTML : null;

    if (document.querySelector(".toggle-btn").classList.contains('active')){
        document.getElementById("data-temp").innerHTML= convertToF(temp);
        document.getElementById("data-temp-feels-like").innerHTML= convertToF(document.getElementById("data-temp-feels-like").innerHTML);
    }
    else {
        document.getElementById("data-temp").innerHTML= tempCelsius;
        document.getElementById("data-temp-feels-like").innerHTML = feelsLiketempCelsius;
    }
}

var btn = document.getElementById("use-location");

// event lisnter on the button clicked
btn.onclick = function(event){
    if (event.target.checked){
        getData() // extract the 
        document.querySelector(".toggle-container").style.visibility = 'visible';
    } else{
        // hide all the data we extract from the API
        document.getElementById("data-temp").innerHTML = "";
        document.getElementById("data-temp-feels-like").innerHTML ="";
        document.getElementById("data-watertype").innerHTML = "";
        document.getElementById("icon-watertype22").src = "";
        document.querySelector(".toggle-container").style.visibility = 'hidden';
    }
}