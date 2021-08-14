function getData(){
    const url = 'https://weather-proxy.freecodecamp.rocks/api/current?lat=32.0958&lon=34.9522';
    fetch( url, {
        method: 'GET',
    })
    .then(response => response.json())
    // .then(data => console.log(data)) // the output of the response json 
    .then(data => {
        // extractValues(data)
        updateWeatherText(data)
        // updateWeatherIcon(data)
        updateCurrentTemp(data)
    })
    .catch(error => {console.error('Error:', error)});
}

function extractValues(data){
    console.log(data);
}

function updateWeatherText(data){
    document.getElementById('data-watertype').innerHTML = data.weather[0].description;
}

// TBD: this is not working !!
function updateWeatherIcon(data){
    document.getElementById("icon-watertype22").src=data.weather[0].icon;;
}

let tempCelsius;

function updateCurrentTemp(data){
    tempCelsius =  Math.round(data.main.temp) +'\xB0C';
    document.getElementById('data-temp').innerHTML = tempCelsius;
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
    }
    else {
        document.getElementById("data-temp").innerHTML= tempCelsius;
    }
}