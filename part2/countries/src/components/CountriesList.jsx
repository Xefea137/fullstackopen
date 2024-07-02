const CountriesList = ({ countriesFound, handleShowCountryDetails }) => {
  if (!countriesFound) {
    return null
  } else if (countriesFound.length > 10) {
    return 'Too many matches, specify another filter'
  } else if (countriesFound.length > 1) {
    return countriesFound.map(country => <div key={country}>{country} <button onClick={() => handleShowCountryDetails(country)}>show</button></div>)
  }
}

export default CountriesList