const Notification = ({ errorMessage, errorType }) => {
  if (!errorMessage) {
    return null
  }

  return (
    <div style={{ color: errorType }}>{errorMessage}</div>
  )
}

export default Notification