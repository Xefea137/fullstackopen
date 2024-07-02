const WeatherDetails = ({ countryDetails, weatherDetails }) => {
  return (
    <div>
      <h3>Weather in {countryDetails.capital}</h3>
      <div>temperature {(weatherDetails.main.temp - 273.15).toFixed(2)} Celcius</div>
      <img src={`http://openweathermap.org/img/wn/${weatherDetails.weather[0].icon}@2x.png`} alt="weather icon" />
      <div>wind {weatherDetails.wind.speed} m/s</div>
    </div>
  )
}

export default WeatherDetails