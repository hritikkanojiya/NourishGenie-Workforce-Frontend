/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect} from 'react'
import {EmployeeCard} from '../../../_metronic/partials/content/cards/EmployeeCard'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Link} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'
import api from '../RequestConfig'

const permissionsBreadCrumbs: Array<PageLink> = [
  {
    title: 'employee_management',
    path: '/crafted/employee_management',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const API_URL = process.env.REACT_APP_API_URL
export const GET_ALL_USERS = `${API_URL}/agent/account/get-agents`
export const DELETE_SINGLE_USER = `${API_URL}/agent/account/delete-agent`
export const GET_ALL_DESIGNATIONS = `${API_URL}/agent/fields/designation/get-designation`
function CompanyEmployees() {
  const [employees, setEmployees] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [appDesignationId, setAppDesignationId] = React.useState<string | null>(null)
  const [designations, setDesignations] = React.useState([])
  //api calling
  useEffect(() => {
    ;(async () => {
      await load_Designations()
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      await Load()
    })()
  }, [appDesignationId])
  async function Load(parameter?: any) {
    setIsLoading(true)
    const varToken = localStorage.getItem('token')
    console.log(varToken)
    const result = await api.post(
      GET_ALL_USERS,
      {
        appDesignationId: appDesignationId,
      },
      {
        headers: {
          genie_access_token: 'Bearer ' + varToken,
        },
      }
    )
    setEmployees(result.data.data.AppUsers)
    setIsLoading(false)
  }
  async function DeleteSingleUser(id: any) {
    setIsLoading(true)
    const varToken = localStorage.getItem('token')
    const result = await api.post(
      DELETE_SINGLE_USER,
      {
        appAgentId: id,
      },
      {
        headers: {
          genie_access_token: 'Bearer ' + varToken,
        },
      }
    )
    console.log(result)
    if (result.data.error === false) {
      await Load()
    }
    setIsLoading(false)
  }

  async function load_Designations() {
    setIsLoading(true)
    const varToken = localStorage.getItem('token')
    try {
      const result = await api.post(
        GET_ALL_DESIGNATIONS,
        {
          search: null,
          metaData: {
            limit: 0,
          },
        },
        {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      setDesignations(result.data.data.appDesignations)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }
  // async function DeleteMultipleUser(id: any) {
  //   //LOOP through the array and delete the user
  //   const varToken = localStorage.getItem('token')
  //   for (let i = 0; i < id.length; i++) {
  //     await api.post(`${API_URL}/agent/account/deleteAppAccount/${id}`, {
  //       headers: {
  //         genie_access_token: 'Bearer ' + varToken,
  //       },
  //     })
  //   }
  //   await Load()
  // }
  const employeeCards = employees.map((employee: any) => {
    return (
      <div key={employee._id} className='col-md-6 col-xxl-4'>
        <EmployeeCard
          avatar='/media/avatars/300-25.jpg'
          name={employee.first_name + ' ' + employee.last_name}
          employeeType={employee.employee_type}
          id={employee._id}
          DeleteSingleUser={DeleteSingleUser}
        />
      </div>
    )
  })
  return (
    <>
      <PageTitle breadcrumbs={permissionsBreadCrumbs}>Company Employees</PageTitle>

      <div className='d-flex flex-wrap flex-stack mb-6'>
        <div className='d-flex my-2'>
          <select
            name='status'
            data-control='select2'
            data-hide-search='true'
            className='form-select form-select-white form-select-sm w-125px'
            defaultValue='Online'
          >
            <option value='Online'>Online</option>
            <option value='Pending'>Pending</option>
            <option value='Declined'>Declined</option>
            <option value='Accepted'>Accepted</option>
          </select>
        </div>
        <select
          style={{margin: '10px', width: '80%'}}
          className='form-select form-select-lg form-select-solid'
          onChange={(e) => {
            setAppDesignationId(e.target.value)
          }}
        >
          <option value=''>Select Designation</option>
          {designations.map((dn: any) => (
            <option key={dn.appDesignationId} value={dn.appDesignationId}>
              {dn.name}
            </option>
          ))}
        </select>
        <Link
          to={'/crafted/employee_management/create-employee'}
          className='btn btn-primary btn-sm'
          data-bs-toggle='tooltip'
          title='Coming soon'
        >
          Create a new Genie
        </Link>
      </div>
      {isLoading ? (
        <div className='d-flex align-items-center justify-content-center loader-container'>
          <Spinner animation='border' variant='primary' />
        </div>
      ) : (
        <>
          <div className='row g-6 g-xl-9'>{employeeCards}</div>

          <div className='d-flex flex-stack flex-wrap pt-10'>
            <div className='fs-6 fw-bold text-gray-700'>Showing 1 to 10 of 50 entries</div>
          </div>
        </>
      )}
    </>
  )
}

export default CompanyEmployees
