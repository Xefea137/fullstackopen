const FindCountries = ({ countrySearch, handleCountrySearch }) => {
  return (
    <div>
      find countries
      <input
        value={countrySearch}
        onChange={handleCountrySearch}
      />
    </div>
  )
}

export default FindCountries