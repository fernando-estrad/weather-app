import React, {useState} from "react"
import "./App.css"
import axios from "axios"

const API = {
    key: "556446bdd9ec33d06b6ddf43bb8276b7",
    base: "https://api.openweathermap.org/data/2.5/"
}

export default function App(){
    const [input, setInput] = useState("")
    const [resultObj, setResultObj] = useState({})

    const dateDisplay = (d) => {
        let months = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"]
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        
        let day = days[d.getDay()]
        let date = d.getDate()
        let month = months[d.getMonth()]
        let year = d.getFullYear()
        
        return `${day}, ${month} ${date}, ${year}`
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        
        const inputArr = input.trim().split(",")
        const inputCity = inputArr[0]
        const inputState = inputArr[1]
        const inputCountry = inputArr[2]

        axios.get(`${API.base}/weather?q=${inputCity},${inputState},${inputCountry}&units=Imperial&appid=${API.key}`)
            .then(res => {
                setResultObj(res.data)
                setInput("")
            })
            .catch(err => alert("Incorrect format. Please use 'city, state, country'. If your country has no state, use 'city, country'."))
    }

    // Set class name of main div depending on what API.weather[0].main returns. if the API
    // has not been called, set to "main"

    const getClassName = (obj) => {
        if (typeof obj.main === "undefined" || obj.weather[0].main === "Clear"){
            return "main"
        } else if (obj.weather[0].main === "Rain" || obj.weather[0].main === "Drizzle"){
            return "main rain"
        } else if (obj.weather[0].main === "Snow"){
            return "main snow"
        } else if (obj.weather[0].main === "Clouds"){
            return "main clouds"
        } else if (obj.weather[0].main === "Thunderstorm"){
            return "main thunder"
        }
    }
    
    // Set weather icon according to weather received from API

    const getWeatherIcon = (obj) => {
        const {main} = obj.weather[0]
        if (main === "Clear"){
            return "sunny-outline"
        }
        else if (main === "Rain" || main === "Drizzle"){
            return "rainy-outline"
        }
        else if (main === "Snow"){
            return "snow-outline"
        }
        else if (main === "Clouds"){
            return "cloudy-outline"
        }
        else if (main === "Thunderstorm"){
            return "flash-outline"
        }
    }

    return(
        <div className={getClassName(resultObj)}>
            <div className="search-container">
                <form onSubmit={handleSubmit}>
                    <input 
                        id="searchInput"
                        type="text" 
                        className="search-input"
                        placeholder= "e.g Salt Lake City, UT, US"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value)
                        }}
                    />
                    <button
                        className="search-button"
                    >
                    Search
                    </button>
                </form>
            </div>

            {/* if an API call hasnt been made, dont display anything */}

            {(typeof resultObj.main == "undefined") ? ("") :
            (
            <div>
                <div className="weather-container">
                    <div className="location">
                        <p>{resultObj.name}, {resultObj.sys.country}</p>
                    </div>
                    <div className="date">{dateDisplay(new Date())}</div>
                    <div className="weather">
                        <p className="temperature">{Math.round(resultObj.main.temp_max)}° F</p>
                        <div className="weather-icon-description">
                            <ion-icon name={getWeatherIcon(resultObj)} size="large"></ion-icon>
                            <p>{resultObj.weather[0].description.toUpperCase()}</p>
                        </div>
                        <p>Feels like: {Math.round(resultObj.main.feels_like)}° F</p>
                        <p>Humidity: {Math.round(resultObj.main.humidity)}%</p>
                        <p>Wind Speed: {Math.round(resultObj.wind.speed)}mph</p>
                        <i class={resultObj.weather[0].icon}></i>
                    </div>
                </div>
            </div>)}
            <footer>
                <p>Created and designed by Fernando Estrada</p>
            </footer>
        </div>
    )
}