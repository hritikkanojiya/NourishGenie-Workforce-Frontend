/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect} from 'react'
import {EmployeeCard} from '../../../_metronic/partials/content/cards/EmployeeCard'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import axios from 'axios'
import {Link} from 'react-router-dom'
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
function CompanyEmployees() {
  const [employees, setEmployees] = React.useState([])
  //api calling
  useEffect(() => {
    ;(async () => {
      await Load()
    })()
  }, [])
  async function Load(parameter?: any) {
    const varToken = localStorage.getItem('token')
    const result = await axios.get(GET_ALL_USERS, {
      headers: {
        genie_access_token: 'Bearer ' + varToken,
      },
    })
    console.log(result.data.data.AppUsers)
    setEmployees(result.data.data.AppUsers)
  }
  async function DeleteSingleUser(id: any) {
    const varToken = localStorage.getItem('token')
    const result = await axios.post(
      DELETE_SINGLE_USER,
      {
        appUserId: id,
      },
      {
        headers: {
          genie_access_token: 'Bearer ' + varToken,
        },
      }
    )
    console.log(result)
    if (result.data.error === false) {
      console.log('hrutika')
      await Load()
    }
  }
  // async function DeleteMultipleUser(id: any) {
  //   //LOOP through the array and delete the user
  //   const varToken = localStorage.getItem('token')
  //   for (let i = 0; i < id.length; i++) {
  //     await axios.post(`${API_URL}/agent/account/deleteAppAccount/${id}`, {
  //       headers: {
  //         Authorization: 'Bearer ' + varToken,
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
        <Link
          to={'/crafted/employee_management/create-employee'}
          className='btn btn-primary btn-sm'
          data-bs-toggle='tooltip'
          title='Coming soon'
        >
          Create a new Genie
        </Link>
      </div>
      <div className='row g-6 g-xl-9'>
        {employeeCards}
        <div className='col-md-6 col-xxl-4'>
          <EmployeeCard
            color='danger'
            name='Melody Macy'
            employeeType='Marketing Analytic'
            online={true}
          />
        </div>
        <div className='col-md-6 col-xxl-4'>
          <EmployeeCard
            avatar='/media/avatars/300-1.jpg'
            name='Max Smith'
            employeeType='Software Enginer'
          />
        </div>
        <div className='col-md-6 col-xxl-4'>
          <EmployeeCard
            avatar='/media/avatars/300-5.jpg'
            name='Sean Bean'
            employeeType='Web Developer'
          />
        </div>
        <div className='col-md-6 col-xxl-4'>
          <EmployeeCard
            avatar='/media/avatars/300-25.jpg'
            name='Brian Cox'
            employeeType='UI/UX Designer'
          />
        </div>
        <div className='col-md-6 col-xxl-4'>
          <EmployeeCard
            color='warning'
            name='Mikaela Collins'
            employeeType='Head Of Marketing'
            online={true}
          />
        </div>
        <div className='col-md-6 col-xxl-4'>
          <EmployeeCard
            avatar='/media/avatars/300-9.jpg'
            name='Francis Mitcham'
            employeeType='Software Arcitect'
          />
        </div>
        <div className='col-md-6 col-xxl-4'>
          <EmployeeCard
            color='danger'
            name='Olivia Wild'
            employeeType='System Admin'
            online={true}
          />
        </div>
        <div className='col-md-6 col-xxl-4'>
          <EmployeeCard
            color='primary'
            name='Neil Owen'
            employeeType='Account Manager'
            online={true}
          />
        </div>
        <div className='col-md-6 col-xxl-4'>
          <EmployeeCard
            avatar='/media/avatars/300-23.jpg'
            name='Dan Wilson'
            employeeType='Web Desinger'
          />
        </div>
        <div className='col-md-6 col-xxl-4'>
          <EmployeeCard
            color='danger'
            name='Emma Bold'
            employeeType='Corporate Finance'
            online={true}
          />
        </div>
        <div className='col-md-6 col-xxl-4'>
          <EmployeeCard
            avatar='/media/avatars/300-12.jpg'
            name='Ana Crown'
            employeeType='Customer Relationship'
          />
        </div>
      </div>

      <div className='d-flex flex-stack flex-wrap pt-10'>
        <div className='fs-6 fw-bold text-gray-700'>Showing 1 to 10 of 50 entries</div>

        <ul className='pagination'>
          <li className='page-item previous'>
            <a href='#' className='page-link'>
              <i className='previous'></i>
            </a>
          </li>

          <li className='page-item active'>
            <a href='#' className='page-link'>
              1
            </a>
          </li>

          <li className='page-item'>
            <a href='#' className='page-link'>
              2
            </a>
          </li>

          <li className='page-item'>
            <a href='#' className='page-link'>
              3
            </a>
          </li>

          <li className='page-item'>
            <a href='#' className='page-link'>
              4
            </a>
          </li>

          <li className='page-item'>
            <a href='#' className='page-link'>
              5
            </a>
          </li>

          <li className='page-item'>
            <a href='#' className='page-link'>
              6
            </a>
          </li>

          <li className='page-item next'>
            <a href='#' className='page-link'>
              <i className='next'></i>
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}

export default CompanyEmployees
