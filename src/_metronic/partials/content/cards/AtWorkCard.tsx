/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useState, useEffect} from 'react'
import {toAbsoluteUrl} from '../../../helpers'
import api from '../../../../app/modules/RequestConfig'
import {GET_PROFILE_PICTURE} from './EmployeeCard'
const API_URL = process.env.REACT_APP_API_URL

type Props = {
  color?: string
  avatar?: string
  online?: boolean
  name: string
  email: string
  id?: string
}

const cardStyles = {
  width: '90%',
  //   margin: '0 auto',
  marginLeft: '5px',
  marginRight: '5px',
}

const AtWorkCard: FC<Props> = ({color, avatar = '', online = false, name, email = '', id = ''}) => {
  const [profilePicture, setProfilePicture] = useState('')
  const first_name = name.split(' ')[0]
  const last_name = name.split(' ')[1]

  const getUserProfile = async () => {
    const varToken = localStorage.getItem('token')
    console.log('Token = ', varToken)

    console.log(GET_PROFILE_PICTURE)
    if (varToken) {
      try {
        const result = await api.post(
          GET_PROFILE_PICTURE,
          {
            appAgentId: id,
          },
          {
            headers: {
              genie_access_token: 'Bearer ' + varToken,
            },
          }
        )
        console.log(result.data.data)
        setProfilePicture(`http://localhost:8000/${result.data.data.profile_picture}`)
      } catch (error) {
        setProfilePicture(`https://ui-avatars.com/api/?name=${first_name}+${last_name}`)
      }
    }
  }

  useEffect(() => {
    getUserProfile()
  }, [])

  return (
    <div
      className='card card-border custom-card-hover hover-bg-light d-flex flex-row align-items-center p-6'
      style={cardStyles}
    >
      <div className='symbol symbol-50px symbol-circle me-4' style={{marginLeft: '2px'}}>
        {color ? (
          <span className={`symbol-label bg-light-${color} text-${color} fs-5 fw-bolder`}>
            {name.charAt(0)}
          </span>
        ) : (
          <img
            alt='Pic'
            src={profilePicture ? profilePicture : `https://ui-avatars.com/api/?name=${name}`}
          />
          // <img alt='Pic' src={profilePicture} />
        )}
        {online && (
          <div className='symbol-badge bg-success start-100 top-100 border-3 h-10px w-10px ms-n2 mt-n2'></div>
        )}
      </div>

      <div className='d-flex flex-column'>
        <a href='#' className='fs-5 text-gray-800 text-hover-primary fw-bolder mb-1'>
          {name}
        </a>

        <div className='fw-bold text-gray-400'>{email}</div>
      </div>
    </div>
  )
}

export {AtWorkCard}
