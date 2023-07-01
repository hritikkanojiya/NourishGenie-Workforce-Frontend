import clsx from 'clsx'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {HeaderNotificationsMenu, HeaderUserMenu, Search, ThemeModeSwitcher} from '../../../partials'
import {useLayout} from '../../core'
import {useAuth} from '../../../../app/modules/auth'
import {useState} from 'react'
import {useEffect} from 'react'
import api from '../../../../app/modules/RequestConfig'
const API_URL = process.env.REACT_APP_API_URL
export const GET_PROFILE_PICTURE = `${API_URL}/agent/account_files/get-profile`
const itemClass = 'ms-1 ms-lg-3'
const userAvatarClass = 'symbol-35px symbol-md-40px'
const btnIconClass = 'svg-icon-1'

const Navbar = () => {
  const [profilePicture, setProfilePicture] = useState('')
  const {config} = useLayout()
  const {currentUser} = useAuth()
  const first_name = currentUser?.username.split(' ')[0]
  const last_name = currentUser?.username.split(' ')[1]

  useEffect(() => {
    if (currentUser) {
      getUserProfile()
    }
  }, [currentUser]) // this will either return a file or an error saying that the file does not exist.
  const getUserProfile = async () => {
    const varToken = localStorage.getItem('token')
    console.log(GET_PROFILE_PICTURE)
    if (varToken) {
      try {
        const result = await api.post(
          GET_PROFILE_PICTURE,
          {
            appAgentId: currentUser?.appAgentId,
          },
          {
            headers: {
              genie_access_token: 'Bearer ' + varToken,
            },
          }
        )

        // Convert the Blob to a data URL
        console.log(result.data.data)
        setProfilePicture(`http://localhost:8000/${result.data.data.profile_picture}`)
      } catch (error) {
        setProfilePicture(`https://ui-avatars.com/api/?name=${first_name}+${last_name}`)
      }
    }
  }

  return (
    <div className='app-navbar flex-shrink-0'>
      {/* <div className={clsx('app-navbar-item align-items-stretch', itemClass)}>
        <Search />
      </div>

      <div className={clsx('app-navbar-item', itemClass)}>
        <div id='kt_activities_toggle' className={btnClass}>
          <KTSVG path='/media/icons/duotune/general/gen032.svg' className={btnIconClass} />
        </div>
      </div>

      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          className={btnClass}
        >
          <KTSVG path='/media/icons/duotune/general/gen022.svg' className={btnIconClass} />
        </div>
        <HeaderNotificationsMenu />
      </div>

      <div className={clsx('app-navbar-item', itemClass)}>
        <div className={clsx('position-relative', btnClass)} id='kt_drawer_chat_toggle'>
          <KTSVG path='/media/icons/duotune/communication/com012.svg' className={btnIconClass} />
          <span className='bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink' />
        </div>
      </div> */}

      <div className={clsx('app-navbar-item', itemClass)}>
        <ThemeModeSwitcher toggleBtnClass={clsx('btn-active-light-primary btn-custom')} />
      </div>

      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
          <img src={profilePicture} alt='' />
        </div>
        <HeaderUserMenu />
      </div>

      {config.app?.header?.default?.menu?.display && (
        <div className='app-navbar-item d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-35px h-35px'
            id='kt_app_header_menu_toggle'
          >
            <KTSVG path='/media/icons/duotune/text/txt001.svg' className={btnIconClass} />
          </div>
        </div>
      )}
    </div>
  )
}

export {Navbar}
