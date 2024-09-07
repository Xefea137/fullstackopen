import { Button } from '@mui/material'
import PropTypes from 'prop-types'
import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const showSomeDetails = { display: visible ? 'none' : '' }
  const showAllDetails = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      <div style={showSomeDetails}>
        <Button variant='contained' color='primary' onClick={toggleVisibility} sx={{ marginBottom: 2 }}>{props.buttonLabel}</Button>
      </div>
      <div style={showAllDetails}>
        {props.children}
        <Button variant='contained' color='primary' onClick={toggleVisibility}>Cancel</Button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

export default Togglable