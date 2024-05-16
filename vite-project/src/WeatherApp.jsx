import React, { useState } from 'react'
import './Weather.css'

import searchIcon from "./assets/browser.png"
import cloudyIcon from "./assets/cloudy.png"
import rainIcon from "./assets/rain.png"
import snowIcon from "./assets/snow.png"
import stormIcon from "./assets/storm.png"
import sunIcon from "./assets/sun.png"
import windIcon from "./assets/wind.png"
import humidityIcon from "./assets/humidity.png"


function WeatherDetails ({icon,temp,city,country,lat,long,humidity,wind}){
    return(
        <>
        <div className="image">
            <img src={icon} alt="" />
        </div>
        <div className="temperature"> {temp}°C</div>
        <div className="city">{city}</div>
        <div className="country">{country}</div>
        <div className="cord">
            <div><span className='lat'>Latitude</span>
            <span>{lat}</span></div>
            <div><span className='long'>Longtude</span>
            <span>{long}</span></div>
        </div>
        <div className="data-container">
            <div className="element">
                <img src={humidityIcon} alt="humidity" className='data-icon'/>
                <div className="data">
                    <div className="humidity-percent">{humidity} %</div>
                    <div className="text">Humidity</div>
                </div>
            </div>
            <div className="element">
                <img src={windIcon} alt="humidity" className='data-icon' />
                <div className="data">
                    <div className="wind-percent">{wind} km/hr</div>
                    <div className="text">Wind Speed</div>
                </div>
            </div>
        </div>
        </>
    )
}


export const WeatherApp = () => {
    let api_key = "e5f3bfd79b77dc3e3a2bcb8f5297d135"
    const [icon,setIcon]= useState(sunIcon)
    const [temp,setTemp] = useState(0)
    const [city,setCity] = useState("Chennai")
    const [country,setCountry] = useState("IN")
    const [lat,setLat] = useState(0)
    const [long,setLong] = useState(0)
    const [humidity,setHumidity] = useState(0)
    const [wind,setWind] = useState(0)
    const [text,setText] = useState("Chennai")
    const [cityNotFound,setCityNotFound] = useState(false)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState("")
   const weatherIconMap = {
    "01n":sunIcon,
    "02d":sunIcon,
    "02n":sunIcon,
    "03d":cloudyIcon,
    "03n":cloudyIcon,
    "04d":cloudyIcon,
    "04n":cloudyIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon,
   };
    const search = async()=> {
        setLoading(true)
        let url =` https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
        try{
            let res = await fetch(url) ;
            let data=  await res.json();
            if (data.cod === "404"){
                console.error("city not found");
                setCityNotFound(true);
                setLoading(false);
                return;
            }
            setHumidity(data.main.humidity);
            setWind(data.wind.speed);
            setTemp(Math.floor(data.main.temp));
            setCity(data.name);
            setCountry(data.sys.country);
            setLat(data.coord.lat);
            setLong(data.coord.lon);
            const weatherIconCode = data.weather[0].icon;
            setIcon(weatherIconMap[weatherIconCode] || sunIcon);
            setCityNotFound(false);
        }catch(error){
            console.error("An error occured :", error)
            setError("An error occuired",error)
        }finally{
            setLoading(false)
        }
    }
  const handleCity = (e) => {
    setText(e.target.value);
  }
  const handleKey = (e) => {
    if (e.key === "Enter"){
        search();
    }
  }
  return (
    <div className='container'>
        <div className='input-container'>
            <input type="text" id='search'
             placeholder='Search City'
             onChange={handleCity} 
             value={text}
             onKeyDown={handleKey}/>
            <div className='searchicon'>
               <img src={searchIcon} alt="Search" id='searchimg' onClick={()=>search()} /> 
            </div>
            
        </div>
        {loading && <div className="loading">Loading please wait ...</div>}
        {error && <div className="error-msg">{error}</div>}
       { cityNotFound && <div className="citynotfound">City Not Found</div>}
              { !loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} humidity={humidity} long={long} wind={wind}/>}

        <div className="copyright">
            <p>Designed by <span>Sparkvetri</span></p>
        </div>
    </div>
  )
}
