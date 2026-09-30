import React, {
  createContext,
  useContext,
  useState,
} from 'react'
import PropTypes from 'prop-types'

const AlertContext = createContext()

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    type: '',
    message: '',
  })

  const showAlert = (type, message) => {
    setAlert({
      type,
      message,
    })
  }

  const clearAlert = () => {
    setAlert({
      type: '',
      message: '',
    })
  }

  return (
    <AlertContext.Provider
      value={{
        alert,
        showAlert,
        clearAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  )
}

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useAlert = () => useContext(AlertContext)