import { useState, useEffect } from "react"
import axios from 'axios'
import FindCountries from "./components/FindCountries"
import CountriesList from "./components/CountriesList"
import CountryDetails from "./components/CountryDetails"
import WeatherDetails from "./components/WeatherDetails"

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [countrySearch, setCountrySearch] = useState('')
  const [countryDetails, setCountryDetails] = useState(null)
  const [weatherDetails, setWeatherDetails] = useState(null)

  const api_key = import.meta.env.VITE_SOME_KEY
  const baseCountryUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
  const baseWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather'
 
  useEffect(() => {
    axios
      .get(`${baseCountryUrl}/all`)
      .then(response => {
        const allCountryNames = response.data.map(country => country.name.common)
        setAllCountries(allCountryNames)
      })
  }, [])

  const handleCountrySearch = (event) => {
    setCountrySearch(event.target.value)
  }

  const countriesFound = countrySearch === '' ? [] : allCountries.filter(country => country.toLowerCase().includes(countrySearch.toLowerCase()))

  useEffect(() => {
    if (countriesFound.length === 1) {
      getCountryWeatherDetails(countriesFound[0])
    }
  }, [countriesFound])

  const handleShowCountryDetails = (country) => {
    getCountryWeatherDetails(country)
  }

  const getCountryWeatherDetails = (country) => {
    axios
      .get(`${baseCountryUrl}/name/${country}`)
      .then(response => {
        setCountryDetails(response.data)
        const capital = response.data.capital[0]
        const countryCode = response.data.cca2
        return axios.get(`${baseWeatherUrl}?q=${capital},${countryCode}&APPID=${api_key}`)
      })
      .then(weatherResponse => {
        setWeatherDetails(weatherResponse.data)
      })
  }
  
    return (
    <div>
      <FindCountries countrySearch={countrySearch} handleCountrySearch={handleCountrySearch} />
      <CountriesList countriesFound={countriesFound} handleShowCountryDetails={handleShowCountryDetails} />
      {countryDetails && <CountryDetails countryDetails={countryDetails} /> }
      {weatherDetails && <WeatherDetails countryDetails={countryDetails} weatherDetails={weatherDetails} /> }
    </div>
  )
}

export default App