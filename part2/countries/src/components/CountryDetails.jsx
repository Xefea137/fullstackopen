const CountryDetails = ({ countryDetails }) => {
  return (
    <div>
      <h1>{countryDetails.name.common}</h1>
      <div>capital {countryDetails.capital}</div>
      <div>area {countryDetails.area}</div>
      <h3>languages:</h3>
      <ul>
        {Object.values(countryDetails.languages).map(language => {
          return (
            <li key={language}>{language}</li>
          )
        })}
      </ul>
      <img src={countryDetails.flags.png} alt="flag" />
    </div>
  )
}

export default CountryDetails