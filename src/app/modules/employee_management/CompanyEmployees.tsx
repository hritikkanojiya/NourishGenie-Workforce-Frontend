/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {EmployeeCard} from '../../../_metronic/partials/content/cards/EmployeeCard'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Link} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'
import api from '../RequestConfig'

import ReactPaginate from 'react-paginate'

// font-awesome import
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro'
import {log} from 'console'

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [employees, setEmployees] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [appDesignationId, setAppDesignationId] = React.useState<string | null>(null)
  const [appDepartmentId, setAppDepartmentId] = React.useState<string | null>(null)
  const [designations, setDesignations] = React.useState([])
  const [departments, setDepartments] = React.useState([])
  const [totalRecords, setTotalRecords] = React.useState(0)

  // Defining variables for the pagination part

  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  useEffect(() => {
    ;(async () => {
      await load_Designations()
      await load_Departments()
    })()
  }, [])

  function handleSearch(searchValue: string) {
    setSearch(searchValue)
  }

  useEffect(() => {
    ;(async () => {
      await Load()
    })()
  }, [appDesignationId, appDepartmentId, currentPage, search, recordsPerPage])

  async function Load(parameter?: any) {
    setIsLoading(true)
    const varToken = localStorage.getItem('token')
    const result = await api.post(
      GET_ALL_USERS,
      {
        appDesignationId: appDesignationId,
        appDepartmentId: appDepartmentId,
        search: search ? search : null,
        metaData: {
          sortBy: null,
          sortOn: null,
          limit: recordsPerPage,
          offset: search ? null : recordsPerPage * (currentPage - 1),
        },
      },
      {
        headers: {
          genie_access_token: 'Bearer ' + varToken,
        },
      }
    )
    setEmployees(result.data.data.AppUsers)
    setTotalRecords(result.data.data.metaData.total_records)
    setIsLoading(false)
  }
  async function DeleteSingleUser(id: any) {
    setIsLoading(true)
    const varToken = localStorage.getItem('token')
    const result = await api.post(
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
  const employeeCards = employees.map((employee: any) => {
    return (
      <div key={employee.appAgentId} className='col-md-6 col-xxl-4'>
        <EmployeeCard
          avatar='/media/avatars/300-25.jpg'
          name={employee.first_name + ' ' + employee.last_name}
          employeeType={employee.employee_type}
          id={employee.appUserId}
          DeleteSingleUser={DeleteSingleUser}
        />
      </div>
    )
  })

  // Style for dropdown
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  const dropdownStyle: any = {
    display: 'inline-block',
    position: 'relative',
    zIndex: '1',
  }
  const buttonStyle = {
    padding: '0.5rem 1rem',
    fontSize: '14px',
    lineHeight: '1.5',
  }

  const menuStyle: any = {
    display: isMenuOpen ? 'block' : 'none',
    minWidth: 'auto',
    padding: '0',
    position: 'absolute',
    top: '100%',
    right: '0',
    zIndex: '2',
  }

  // Defining functions for pagination
  const changeCurrentPage = (n: any = true) => {
    setCurrentPage(n.selected + 1)
  }

  return (
    <>
      <PageTitle breadcrumbs={permissionsBreadCrumbs}>Company Employees</PageTitle>

      <div className='d-flex   flex-wrap flex-stack mb-6'>
        {/* Showing the number of employees on page */}
        <div style={{display: 'grid'}}>
          <div className='d-flex justify-content-start fs-6 fw-bold text-gray-700'>
            Showing {firstIndex + 1} to {lastIndex <= totalRecords ? lastIndex : totalRecords} of{' '}
            {totalRecords} Employees
          </div>
          {/* Dropdown menu to display records */}
          <select
            className='form-select form-select-solid mx-2'
            style={{width: '180px', marginTop: '10px', backgroundColor: '#ececec'}}
            data-kt-select2='true'
            data-placeholder='Show records'
            value={recordsPerPage}
            onChange={(e: any) => {
              console.log(e.target.value)
              setRecordsPerPage(e.target.value)
            }}
          >
            <option value={10}>10 Records</option>
            <option value={15}>15 Records</option>
            <option value={25}>25 Records</option>
            <option value={50}>50 Records</option>
          </select>
        </div>
        {/* Dropdown menu for filter */}
        <div className='d-flex justify-content-start flex-wrap flex-stack mb-6'>
          <div style={{display: 'flex'}}>
            <div style={dropdownStyle}>
              <button
                style={buttonStyle}
                className='btn btn-primary dropdown-toggle'
                type='button'
                data-toggle='dropdown'
                onClick={toggleMenu}
              >
                Filter
                <FontAwesomeIcon icon={icon({name: 'filter'})} />
              </button>
              {isMenuOpen && (
                <div
                  style={menuStyle}
                  className='menu menu-sub menu-sub-dropdown w-250px w-md-300px'
                  data-kt-menu='true'
                >
                  <div className='px-7 py-5'>
                    <div className='fs-5 text-dark fw-bolder'>Search Employees:</div>
                    <div className='py-3'>
                      <div className='form-group'>
                        <input
                          type='text'
                          className='form-control form-control-solid fw-bold ps-10'
                          placeholder='Search Employees'
                          onChange={(e: any) => {
                            handleSearch(e.target.value)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='px-7 py-5'>
                    <div className='fs-5 text-dark fw-bolder'>Filter Options</div>
                  </div>

                  <div className='separator border-gray-200'></div>

                  <div className='px-7 py-5'>
                    <div className='mb-10'>
                      <label className='form-label fw-bold'>Filter Employees By Department:</label>

                      <div>
                        <select
                          className='form-select form-select-solid'
                          data-kt-select2='true'
                          data-placeholder='Select option'
                          data-allow-clear='true'
                          onChange={(e) => {
                            setAppDepartmentId(e.target.value !== 'null' ? e.target.value : null)
                          }}
                        >
                          <option value={'null'}>Filter by Department</option>
                          {departments.map((dn: any) => (
                            <option key={dn.appDepartmentId} value={dn.appDepartmentId}>
                              {dn.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className='mb-10'>
                      <label className='form-label fw-bold'>Filter Employees By Designation:</label>

                      <div>
                        <select
                          className='form-select form-select-solid'
                          data-kt-select2='true'
                          data-placeholder='Select option'
                          data-allow-clear='true'
                          onChange={(e) => {
                            setAppDesignationId(e.target.value !== 'null' ? e.target.value : null)
                          }}
                        >
                          <option value={'null'}>Filter by Designation</option>
                          {designations.map((dn: any) => (
                            <option key={dn.appDesignationId} value={dn.appDesignationId}>
                              {dn.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className='d-flex justify-content-end'>
                      <button
                        type='reset'
                        className='btn btn-sm btn-light btn-active-light-primary me-2'
                        data-kt-menu-dismiss='true'
                        onClick={() => {
                          setAppDepartmentId(null)
                          setAppDesignationId(null)
                          setSearch('')
                          toggleMenu()
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Create New Genie Button */}

            <Link
              style={{marginLeft: '10px'}}
              to={'/crafted/employee_management/create-employee'}
              className='btn btn-primary btn-sm'
              data-bs-toggle='tooltip'
            >
              Create a new Genie
            </Link>
          </div>
        </div>
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
      {/* Pagination Component */}
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        pageCount={Math.ceil(totalRecords / recordsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={changeCurrentPage}
        containerClassName={'pagination justify-content-end'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        activeClassName={'active'}
      />
    </>
  )
}

export default CompanyEmployees
