/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {toAbsoluteUrl} from '../../../helpers'
import {Link} from 'react-router-dom'

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
              <img alt='Pic' src={toAbsoluteUrl(avatar)} />
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
            <button
              className='btn btn-success btn-sm'
              style={{
                border: '1px solid green',
                color: 'white',
                background: 'transparent',
              }}
            >
              <Link to={'/crafted/employee_management/edit-details'} state={id}>
                Edit
              </Link>
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                DeleteSingleUser(id)
              }}
              className='btn btn-danger btn-sm'
              style={{
                background: 'transparent',
                border: '1px solid red',
                color: 'white',
              }}
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
