import { useState, useEffect } from 'react'
import axios from 'axios'

const Specs = (props) => {
  const {country, setShowCountry, setCapital, weather} = props
  const flagUrl = country.flags.png
  
  useEffect(() => {
    setCapital(country.capital)
  },[])

  const DrawWeather = () => {
    if(weather){
      return(
        <div>
          <div>Temperature {weather.main.temp} Celsius</div>
          <img src = "http://openweathermap.org/img/wn/10n@2x.png"/>
          <div>Wind speed {weather.wind.speed}</div>
        </div>
      )
    }
    return(
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div>
      <div><button onClick = {() => setShowCountry(null)}>back</button></div>
      <h2>{country.name.common}</h2>
      <div>Capital {country.capital}</div>
      <div>Area {country.area} km^2 </div>
      <div>
        <h3>Languages</h3>
        <ul>
            {Object.values(country.languages).map(language => {
              return (<li key = {language}>{language}</li> 
              )})}
        </ul>
      </div>
      <div>
        <img src = {flagUrl}/>
      </div>
      <div>
        <h2>Weather in {country.capital}</h2>
        <DrawWeather/>
      </div>
    </div>
  )
}

const Information = (props) => {
  const {countries, inputText, showCountry, setShowCountry, setCapital, weather} = props
  const countryNames = countries.map(country => country.name.common)
  const filteredNames = countryNames.filter(country => country.toLowerCase().includes(inputText.toLowerCase()))

  if(showCountry){
    return(<Specs country = {showCountry} setShowCountry = {setShowCountry} setCapital = {setCapital} weather = {weather}/>)
  }

  if(filteredNames.length === 1){
    const country = countries.filter(country => country.name.common === filteredNames[0])[0]
    return(<Specs country = {country} setShowCountry = {setShowCountry} setCapital = {setCapital} weather = {weather}/>)
  }

  return (
    <div>
      <ul>
      {filteredNames.map(country => {
        return (<li key = {country}> {country} <button onClick = {() => setShowCountry(countries.find(c => c.name.common === country))}> show </button> </li>)})}
      </ul>
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [inputText, setInputText] = useState('')
  const [showCountry, setShowCountry] = useState(null)
  const [capital, setCapital] = useState(null)
  const [weather, setWeather] = useState(null)
  const [latLon, setLatLon] = useState([null,null])

  const handleTextChange = (event) => {
    setInputText(event.target.value)
    setShowCountry(null)
  }

  const handleClear = (event) => {
    setInputText('')
    setShowCountry(null)
  }

  useEffect(() => {
    console.log('fetching countries')

    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  },[])

  useEffect(() => {
    if(capital){
      const country = countries.find(country => country.capital === capital)
      console.log(`getting coords for ${capital}`)

      axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${capital},${country}&limit=1&appid=${process.env.REACT_APP_WEATHER_API_KEY}`)
      .then(response => {
        setLatLon([response.data[0].lat,response.data[0].lon])
      })
    }
  },[capital])

  useEffect(() => {
    if(latLon[0]){
      console.log(`Getting weather for coords ${latLon}`);
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latLon[0]}&lon=${latLon[1]}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`)
      .then(response => {
        setWeather(response.data)
      })
    }
  },[latLon])

  return (
    <div>
      <h1>Search Countries</h1>
      <div>Find countries: <input value = {inputText} onChange = {handleTextChange}/><button onClick = {handleClear}>clear</button></div>
      <Information countries = {countries} inputText = {inputText} showCountry = {showCountry} setShowCountry = {setShowCountry} setCapital = {setCapital} weather = {weather}/>
    </div>
  );
}

export default App;
