
var currentDate = dayjs().format('MMMM D, YYYY');

document.getElementById('currentDay').textContent = currentDate;

var APIKey = '403dc4c9851a435ee53582f475dfb088'

document.getElementById('city-Search-Form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevents the default form submission behavior
    
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value;

    // Call the function to fetch data using the city value
    fetchData(city);
});

function fetchData(city) {
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Process the fetched data
            console.log(data);
            const { lat, lon } = data.coord;
            updateWeather(data)

            const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial&cnt=40";
            
            return fetch(forecastUrl);
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const forecastContainer = document.getElementById('forecast');
            clearForecastContainer();
            
            const maxTempByDay = {};
            
            for (let i = 0; i < data.list.length; i += 8) {
                const dayData = data.list[i];
                const date = new Date(dayData.dt_txt);
                const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const temp = Math.round(dayData.main.temp);
                const windSpeed = dayData.wind.speed;
                const humidity = dayData.main.humidity;

                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <h3>${day} - ${formattedDate} </h3>
                    <p>Temperature: ${temp}°F</p>
                    <p>Wind: ${windSpeed}MPH</p>
                    <p>Humidity: ${humidity}%</p>
                    <!-- Add other details like humidity, wind speed, etc. as needed -->
                `;

                forecastContainer.appendChild(card);
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
}


function updateWeather(data) {

    const locationElement = document.querySelector('.location');
    const tempElement = document.querySelector('.temp');
    const windElement = document.querySelector('.wind');
    const humidityElement = document.querySelector('.humidity');
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    
    locationElement.textContent = `${data.name}, ${data.sys.country} - ${formattedDate}`;
    tempElement.textContent = `Temp: ${data.main.temp} °F`; 
    windElement.textContent = `Wind: ${data.wind.speed} MPH`;
    humidityElement.textContent = `Humidity: ${data.main.humidity} %`;
}

function clearForecastContainer() {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
}

//function to save previous searched city
function saveCity(city, limit = 4) {

    let existingCities = JSON.parse(localStorage.getItem('cities')) || [];

    existingCities.push(city);

    if (existingCities.length > limit) {
        existingCities = existingCities.slice(-limit);
    }

    localStorage.setItem('cities', JSON.stringify(existingCities));
}

saveCity();


function loadCity(limit = 4) {
    const pastCities = JSON.parse(localStorage.getItem('cities')) || [];

    const pastCitiesContainer = document.getElementById('past-cities');
    pastCitiesContainer.innerHTML = '';

    constToDisplay = pastCities.slice(-limit);

    pastCities.forEach(city => {
        const cityButton = document.createElement('button');
        cityButton.textContent = city;
        cityButton.addEventListener('click', function () {
            fetchData(city);
        })
        pastCitiesContainer.appendChild(cityButton);
    })
}

document.getElementById('city-Search-Form').addEventListener('submit', function (event) {
    event.preventDefault();

    const cityInput = document.getElementById('city-input');
    const city = cityInput.value;

    // fetchData(city);

    saveCity(city);

    loadCity();

    clearForecastContainer();
})

loadCity();
    
    
    


//console.log(fetch('http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&apiKey=403dc4c9851a435ee53582f475dfb088'))
//add event listener to search btn, then grab data from input field

//use data and fetch geo endpoint using the city that user enters with api key

//render data on page into the current day

//city gets added to local storage and render it also create a btn
//after refresh make sure city names are saved still

//create another function for 5 day forcast
//render the 5 day forcast
//filter out data for one time a day