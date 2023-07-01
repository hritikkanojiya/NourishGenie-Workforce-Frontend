/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import api from '../../../../app/modules/RequestConfig'
const API_URL = process.env.REACT_APP_API_URL
export const GET_PROFILE_PICTURE = `${API_URL}/agent/account_files/get-profile`
type Props = {
  color?: string
  avatar?: string
  online?: boolean
  name: string
  employeeType: string
  id?: string
  DeleteSingleUser?: any
}

const EmployeeCard: FC<Props> = ({
  color = '',
  avatar = '',
  online = false,
  name,
  employeeType,
  DeleteSingleUser,
  id,
}) => {
  useEffect(() => {
    getUserProfile()
  }, [])
  const [profilePicture, setProfilePicture] = useState('')
  const first_name = name.split(' ')[0]
  const last_name = name.split(' ')[1]
  const getUserProfile = async () => {
    const varToken = localStorage.getItem('token')
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
        setProfilePicture(`http://localhost:8000/${result.data.data.profile_picture}`)
      } catch (error) {
        setProfilePicture(`https://ui-avatars.com/api/?name=${first_name}+${last_name}`)
      }
    }
  }
  return (
    <div className='card'>
      <div className='card-body d-flex flex-center flex-column p-9'>
        {/* Checkbox */}
        <div className='position-absolute top-0 start-0 mt-3 ms-3'>
          <input type='checkbox' className='form-check-input' />
        </div>

        <div className='mb-5'>
          <div className='symbol symbol-75px symbol-circle'>
            {color ? (
              <span className={`symbol-label bg-light-${color} text-${color} fs-5 fw-bolder`}>
                {name.charAt(0)}
              </span>
            ) : (
              <img alt='Pic' src={profilePicture} />
            )}
            {online && (
              <div className='symbol-badge bg-success start-100 top-100 border-4 h-15px w-15px ms-n3 mt-n3'></div>
            )}
          </div>
        </div>

        <Link
          to={'/crafted/employee_management/employee-details/'}
          state={id}
          className='fs-4 text-gray-800 text-hover-primary fw-bolder mb-0'
        >
          {name}
        </Link>

        <div className='fw-bold text-gray-400 mb-6'>{employeeType}</div>

        {/* Edit and Delete buttons */}
        <div className='d-flex justify-content-between'>
          <div style={{marginRight: '10px'}}>
            <button className='btn btn-success btn-sm'>
              <Link
                to={'/crafted/employee_management/edit-details'}
                style={{color: 'white'}}
                state={id}
              >
                Edit
              </Link>
            </button>
          </div>

          <div style={{marginRight: '10px'}}>
            <button className='btn btn-primary btn-sm'>
              <Link
                to={'/crafted/employee_management/employee-files'}
                style={{color: 'white'}}
                state={id}
              >
                Files
              </Link>
            </button>
          </div>

          <div>
            <button
              onClick={() => {
                DeleteSingleUser(id)
              }}
              className='btn btn-danger btn-sm'
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export {EmployeeCard}
