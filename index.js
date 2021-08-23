function getData(){
    const url = 'https://weather-proxy.freecodecamp.rocks/api/current?lat=32.0958&lon=34.9522';
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
    })
    .catch(error => {console.error('Error:', error)});
}

function extractValues(data){
    console.log(data);
}

function extractData(data){
    document.getElementById('data-watertype').innerHTML = data.weather[0].description;
    document.getElementById("icon-watertype22").src=data.weather[0].icon;
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

var btn = document.getElementById("use-location");

// event lisnter on the button clicked
btn.onclick = function(event){
    if (event.target.checked){
        getData() // extract the 
        document.querySelector(".toggle-container").style.visibility = 'visible';
        document.querySelector(".more-information").style.visibility = 'visible';
    } else{
        // hide all the data we extract from the API

        document.getElementById("current-temp").innerHTML = "";
        document.getElementById('current-locaiton').innerHTML = "";
        document.getElementById("data-watertype").innerHTML = "";
        document.getElementById("icon-watertype22").src = "";

        document.querySelector(".more-information").style.visibility = 'hidden';
        document.querySelector(".toggle-container").style.visibility = 'hidden';
    }


    function userTimeInDay (){
        var myDate = new Date();
        var hrs = myDate.getHours();

        if (hrs < 12) // morning
            document.main.background = "#89CFF0";
        else if (hrs >= 12 && hrs <= 17) // after noon
            document.main.background = "#38AEE6";
        else if (hrs >= 17 && hrs <= 24) // evening
            document.main.background = "#167CAC";
    }
}