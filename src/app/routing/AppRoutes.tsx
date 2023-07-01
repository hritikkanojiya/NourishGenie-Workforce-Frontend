/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import {FC, useEffect, useState} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {Logout, AuthPage, useAuth} from '../modules/auth'
import {App} from '../App'
import api from '../../../src/app/modules/RequestConfig'
const API_URL = process.env.REACT_APP_API_URL
export const GET_USER_BY_TOKEN = `${API_URL}/agent/auth/getAgentByToken`
/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const {PUBLIC_URL} = process.env

const AppRoutes: FC = () => {
  const {currentUser} = useAuth()
  const {setCurrentUser} = useAuth()

  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const handleToken = (event: CustomEvent<any>): void => {
      setToken(localStorage.getItem('token'))
    }

    window.addEventListener('handleAuth', handleToken as EventListener)

    return () => {
      window.removeEventListener('handleAuth', handleToken as EventListener)
    }
  }, [token]) // Include 'token' as a dependency

  useEffect(() => {
    const getUser = async () => {
      const varToken = localStorage.getItem('token')
      if (token) {
        try {
          const result = await api.get(GET_USER_BY_TOKEN, {
            headers: {
              genie_access_token: 'Bearer ' + varToken,
            },
          })
          console.log(result.data)
          setCurrentUser(result.data.agent)
        } catch (err) {
          console.log(err)
        }
      }
    }
    getUser()
  }, [])
  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {token ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route
                index
                element={<Navigate to='/crafted/employee_management/company-employees' />}
              />
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
