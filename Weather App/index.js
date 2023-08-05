const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen =  document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const API_KEY = "1c50c46e6297d44ab654beef89810a76";
currentTab.classList.add("current-tab");
getfromSessionStorage(); // jab page load hoga tab ye function call hoga    
// ye function check karega ki user ne access diya hai ya nahi 

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){

            //main search wale pe nahi tha, ab aa jaunga
            //kya search form wala container invisible tha, agar haan to usse visible karna hai
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //main search wale pe tha, ab switch karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            //ab main weather tab me aagya hu, to weather bhi display karna padega. To check karunga ki storage me coordinate pade hain ya nahi
            getfromSessionStorage();
        } 
    }
}

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //Agar local coordinates nahi mile, matlab access nahi hai
        grantAccessContainer.classList.add("active");
    }
    else{
        // agar access hai, to fir storage se coordinates nikalna padega. Pehle uske liye JSON me parse karenge fir function call karenge
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    // yaha ham coordinates fetch karenge ek api call karne ke baad, to async function banega
    const {lat, lon} = coordinates;
    // ab jab fetch karega to loading time bhi lagega. To isliye loading page ko call karenge.

    // fetch karna hai to hamein grant access wali screen bhi hatani padegi na
    grantAccessContainer.classList.remove("active");

    // jab tak fetch hoga tab tak loader ko visible karaenge
    loadingScreen.classList.add("active");
    // API CALL 
    try{
        const res = await fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await res.json();
        // ab jaise hi value fetch ho gayi, waise hi loader ko remove bhi karna hai 
        loadingScreen.classList.remove("active");

        // fetch karne ke baad user ka data bhi dikhana hai
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data); // ye function data me se values nikaal ke screen pe show karega
    }
    catch (err){
        loadingScreen.classList.remove("active");
        alert('There is an error :'  + err)
    }
}

function renderWeatherInfo(weatherInfo){
    //first, we have to fetch the element
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
     
    // fetch values from weatherInfo object and show it in UI 
    cityName.innerText = weatherInfo?.name;
    const a = weatherInfo?.sys?.country.toLowerCase();
    console.log(a);
    countryIcon.src = `https://flagcdn.com/32x24/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp + " °C";
    windspeed.innerText = weatherInfo?.wind?.speed + " m/s";
    humidity.innerText = weatherInfo?.main?.humidity +" %";
    cloudiness.innerText = weatherInfo?.clouds?.all+" %";
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation is not supported by this browser.");
    }
}
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    // ab coordinates ko session storage me save karna hai
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    // ab coordinates mil gaye, to ab weather fetch karne ka time aa gaya
    fetchUserWeatherInfo(userCoordinates);
}

userTab.addEventListener("click", () =>
{
    // passed clicked tab as input 
    switchTab(userTab);
});
searchTab.addEventListener("click", () =>
{
    // passed clicked tab as input 
    switchTab(searchTab);
    // search wale tab pe click karne pe search form active ho jayega
});


const grantAccessButton = document.querySelector("[data-grantAccess]");
// grant access button ke liye event listener
grantAccessButton.addEventListener("click", getLocation);
const searchInput = document.querySelector("[data-searchInput]");

// search form ke liye event listener
searchForm.addEventListener("submit", (e) => {

    // jab form submit hoga tab page reload nahi hona chahiye (default behaviour nahi hona chahiye)
e.preventDefault();
let cityName = searchInput.value;
if(cityName==""){
    // agar user ne kuch nahi enter kiya to alert show karna hai
    alert("Please enter a city name");
    return;
}
 else 
 // agar user ne kuch cityname enter kiya hai to usse fetch karna padega
 fetchSearchWeatherInfo(cityName);
});
async function fetchSearchWeatherInfo(cityName){
    // jab tak fetch hoga tab tak loader ko visible karaenge
    loadingScreen.classList.add("active");

    // fetch karna hai to hamein grant access wali screen bhi hatani padegi na
    userInfoContainer.classList.remove("active");

    // grant access wali screen ko bhi hatana padega jab tak screen fetch kar rahi hai
    grantAccessContainer.classList.remove("active");

    try{
        const res = await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        const data = await res.json();

        // ab jaise hi value fetch ho gayi, waise hi loader ko remove bhi karna hai
        loadingScreen.classList.remove("active");

        // fetch karne ke baad user ka data bhi dikhana hai
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err){
        // agar koi error aagyi to loader ko remove karna padega
        loadingScreen.classList.remove("active");
        alert('There is an error :'  + err)
    }
}
const animateButton = document.querySelector("[rolling-box]");
animateButton.addEventListener("click", () => {
  if (animateButton.classList.contains("rolling-animation")) {
    animateButton.classList.remove("rolling-animation");
  } else {
    animateButton.classList.add("rolling-animation");
  }
  setTimeout(() => {
    animateButton.classList.remove("rolling-animation");
  }, 300);
});
