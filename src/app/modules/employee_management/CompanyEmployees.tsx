/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {EmployeeCard} from '../../../_metronic/partials/content/cards/EmployeeCard'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Link} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'
import api from '../RequestConfig'

// font-awesome import
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro'

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
export const GET_ALL_DEPARTMENTS = `${API_URL}/agent/fields/department/get-department`
function CompanyEmployees() {
  //State for dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [employees, setEmployees] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [appDesignationId, setAppDesignationId] = React.useState<string | null>(null)
  const [appDepartmentId, setAppDepartmentId] = React.useState<string | null>(null)
  const [designations, setDesignations] = React.useState([])
  const [departments, setDepartments] = React.useState([])

  // Defining variables for the pagination part
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 5
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  const records = employees.slice(firstIndex, lastIndex)
  const noOfPages = Math.ceil(employees.length / recordsPerPage)
  const numbers = Array.from({length: noOfPages}, (_, i) => i + 1)

  //api calling
  useEffect(() => {
    ;(async () => {
      await load_Designations()
      await load_Departments()
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      await Load()
    })()
  }, [appDesignationId, appDepartmentId])

  async function Load(parameter?: any) {
    setIsLoading(true)
    const varToken = localStorage.getItem('token')
    console.log(varToken)
    const result = await api.post(
      GET_ALL_USERS,
      {
        appDesignationId: appDesignationId,
        appDepartmentId: appDepartmentId,
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
  async function load_Departments() {
    setIsLoading(true)
    const varToken = localStorage.getItem('token')
    try {
      const result = await api.post(
        GET_ALL_DEPARTMENTS,
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
      setDepartments(result.data.data.AppDepartment)
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

  // Employee Card Function
  // const employeeCards = employees.map((employee: any) => {
  const employeeCards = records.map((employee: any) => {
    return (
      <div key={employee.appAgentId} className='col-md-6 col-xxl-4'>
        <EmployeeCard
          avatar='/media/avatars/300-25.jpg'
          name={employee.first_name + ' ' + employee.last_name}
          employeeType={employee.employee_type}
          id={employee.appAgentId}
          DeleteSingleUser={DeleteSingleUser}
        />
      </div>
    )
  })

  // Style for dropdown
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const dropdownStyle = {
    display: 'inline-block',
  }
  const buttonStyle = {
    padding: '0.5rem 1rem',
    fontSize: '14px',
    lineHeight: '1.5',
  }

  const menuStyle = {
    display: isMenuOpen ? 'block' : 'none',
    minWidth: 'auto',
    padding: '0',
  }

  const selectStyle = {
    borderRadius: '0',
    fontSize: '14px',
  }

  const containerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '20px',
    marginRight: '40px',
  }

  const containerStyleLeft = {
    // display: 'flex',
    // justifyContent: 'flex-start',
    // marginLeft: 'auto',
    // position: 'absolute' as 'absolute',
    marginLeft: '10px',
    marginRight: '10px',
  }

  // Defining functions for pagination
  const prevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const nextPage = () => {
    if (currentPage !== noOfPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const changeCurrentPage = (n: any = true) => {
    setCurrentPage(n)
  }

  return (
    <>
      <PageTitle breadcrumbs={permissionsBreadCrumbs}>Company Employees</PageTitle>

      <div className='d-flex flex-wrap flex-stack mb-6' style={containerStyle}>
        {/* Showing the number of employees on page */}
        <div className='fs-6 fw-bold text-gray-700' style={containerStyleLeft}>
          Showing {firstIndex + 1} to {lastIndex <= employees.length ? lastIndex : employees.length}{' '}
          of {employees.length} Employees
        </div>
        {/* Dropdown menu for filter */}
        <div style={dropdownStyle}>
          <button
            style={buttonStyle}
            className='btn btn-primary dropdown-toggle'
            type='button'
            data-toggle='dropdown'
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={icon({name: 'filter'})} />
          </button>
          <div style={menuStyle} className='dropdown-menu dropdown-menu-sm dropdown-menu-right'>
            <select
              style={selectStyle}
              className='form-select form-select-lg form-select-solid'
              onChange={(e) => {
                setAppDesignationId(e.target.value !== 'null' ? e.target.value : null)
              }}
            >
              <option value={'null'}>Filter Employees Designation</option>
              {designations.map((dn: any) => (
                <option key={dn.appDesignationId} value={dn.appDesignationId}>
                  {dn.name}
                </option>
              ))}
            </select>
            <select
              style={selectStyle}
              className='form-select form-select-lg form-select-solid'
              onChange={(e) => {
                setAppDepartmentId(e.target.value !== 'null' ? e.target.value : null)
              }}
            >
              <option value={'null'}>Filter Employees Department</option>
              {departments.map((dn: any) => (
                <option key={dn.appDepartmentId} value={dn.appDepartmentId}>
                  {dn.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Create New Genie Button */}
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
          {employees ? (
            <>
              <div className='row g-6 g-xl-9'>{employeeCards}</div>

              <div className='d-flex flex-stack flex-wrap pt-10'>
                {/* <div className='fs-6 fw-bold text-gray-700'></div> */}
              </div>
            </>
          ) : (
            <div className='d-flex align-items-center justify-content-center loader-container'>
              <h1>No Employees Found</h1>
            </div>
          )}
        </>
      )}
      <ul className='pagination'>
        <li className='page-item previous'>
          {/* eslint-disable-next-line */}
          <a href='#' className='page-link'>
            <i className='previous' onClick={prevPage}></i>
          </a>
        </li>
        {numbers.map((n, i) => (
          <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
            {/* eslint-disable-next-line */}
            <a href='#' className='page-link' onClick={() => changeCurrentPage(n)}>
              {n}
            </a>
          </li>
        ))}
        <li className='page-item next'>
          {/* eslint-disable-next-line */}
          <a href='#' className='page-link'>
            <i className='next' onClick={nextPage}></i>
          </a>
        </li>
      </ul>
    </>
  )
}

export default CompanyEmployees
