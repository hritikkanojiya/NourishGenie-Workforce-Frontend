/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {Link} from 'react-router-dom'
import {useAuth} from '../../../../app/modules/auth'
import {Languages} from './Languages'
import {toAbsoluteUrl} from '../../../helpers'
import api from '../../../../app/modules/RequestConfig'

const API_URL = process.env.REACT_APP_API_URL
export const LOGOUT_URL = `${API_URL}/agent/auth/logout`

const HeaderUserMenu: FC = () => {
  const {currentUser, setCurrentUser, saveAuth} = useAuth()
  const first_name = currentUser?.username.split(' ')[0]
  const last_name = currentUser?.username.split(' ')[1]

  const logout = async () => {
    //call the logout api
    const URL = LOGOUT_URL
    const varToken = localStorage.getItem('token')
    try {
      const result = await api.post(
        URL,
        {},
        {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      console.log(result)
    } catch (err) {
      console.log(err)
    } finally {
      saveAuth(undefined)
      setCurrentUser(undefined)
      localStorage.removeItem('token')
      const event = new CustomEvent('handleAuth')
      window.dispatchEvent(event)
    }
  }
  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            <img alt='Logo' src={`https://ui-avatars.com/api/?name=${first_name}+${last_name}`} />
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {first_name} {last_name}
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {currentUser?.email}
            </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>

      {/* <div className='menu-item px-5'>
        <Link to={'/crafted/pages/profile'} className='menu-link px-5'>
          My Profile
        </Link>
      </div> */}

      <div className='menu-item px-5'>
        <a onClick={logout} className='menu-link px-5'>
          Sign Out
        </a>
      </div>
    </div>
  )
}

export {HeaderUserMenu}
