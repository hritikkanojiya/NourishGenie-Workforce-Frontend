import React, {useEffect} from 'react'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import api from '../../RequestConfig'
import {Dropdown, Spinner} from 'react-bootstrap'
import {useContext} from 'react'
import {DepartmentContext} from '../context/DepartmentContext'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPencilAlt, faTrash} from '@fortawesome/free-solid-svg-icons'

const permissionsBreadCrumbs: Array<PageLink> = [
  {
    title: 'company_fields',
    path: '/crafted/company_fields',
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
export const GET_ALL_DEPARTMENTS = `${API_URL}/agent/fields/department/get-department`
export const DELETE_DEPARTMENT = `${API_URL}/agent/fields/department/delete-department`

function Department() {
  const {modalFunction, editModalFunction} = useContext(DepartmentContext)
  const {departments, loadDepartmentFunction} = useContext(DepartmentContext)
  const {editDepartmentId} = useContext(DepartmentContext)
  const [search, setSearch] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 5
  const [totalRecords, setTotalRecords] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)

  useEffect(() => {
    loadDepartments()
  }, [currentPage, search]) // Include currentPage and search as dependencies

  // Load departments from the backend
  async function loadDepartments() {
    setIsLoading(true)
    const varToken = localStorage.getItem('token')
    try {
      const result = await api.post(
        GET_ALL_DEPARTMENTS,
        {
          search: search ? search : null,
          metaData: {
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
          },
        },
        {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      loadDepartmentFunction(result.data.data.AppDepartment)
      setTotalRecords(result.data.data.metaData.total_records)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  function handleEdit(AppDepartmentId: any): void {
    editModalFunction(true)
    editDepartmentId(AppDepartmentId)
  }

  function handleCreateDepartment(): void {
    modalFunction(true)
  }

  async function deleteDepartment(AppDepartmentId: any) {
    setIsLoading(true)
    const varToken = localStorage.getItem('token')
    const result = await api.delete(DELETE_DEPARTMENT, {
      headers: {
        genie_access_token: 'Bearer ' + varToken,
      },
      data: {
        appDepartmentIds: [AppDepartmentId],
      },
    })
    console.log(result)
    if (result.data.error === false) {
      await loadDepartments()
    }
    setIsLoading(false)
  }

  function handleSearchChange(searchValue: any) {
    setSearch(searchValue)
  }

  // Handle page change
  function handlePageChange(page: number) {
    setCurrentPage(page)
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalRecords / itemsPerPage)

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <>
      <PageTitle breadcrumbs={permissionsBreadCrumbs}>Departments</PageTitle>
      <div className='mb-4 d-flex'>
        <input
          type='text'
          className='form-control'
          placeholder='Search...'
          value={search}
          onChange={(e) => {
            handleSearchChange(e.target.value)
          }}
        />
        <button type='button' className='btn btn-primary' onClick={loadDepartments}>
          Search
        </button>
      </div>
      {isLoading ? (
        <div className='d-flex align-items-center justify-content-center loader-container'>
          <Spinner animation='border' variant='primary' />
        </div>
      ) : (
        <>
          {/* Departments list */}
          <div className='d-flex flex-wrap flex-stack mb-6'>
            <h3 className='fw-bolder my-2'>Nourish Genie Departments</h3>
            <div className='d-flex align-items-center my-2'>
              <button onClick={handleCreateDepartment} className='btn btn-primary btn-sm'>
                Create New Department
              </button>
            </div>
          </div>
          <table
            id='kt_table_users'
            className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
          >
            <thead>
              <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                <th className='align-middle'>#</th>
                <th className='align-middle col-8'>Department Name</th>
                <th className='align-right'>Edit</th>
                <th className='align-left'>Delete</th>
              </tr>
            </thead>
            <tbody className='text-gray-600 fw-bold'>
              {departments.map((department: any, index: number) => (
                <tr key={department.appDepartmentId}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{department.name}</td>
                  <td>
                    <button className='btn' onClick={() => handleEdit(department.appDepartmentId)}>
                      <FontAwesomeIcon icon={faPencilAlt} size='1x' color='gray' />
                    </button>
                  </td>
                  <td>
                    <button
                      className='btn'
                      onClick={() => deleteDepartment(department.appDepartmentId)}
                    >
                      <FontAwesomeIcon icon={faTrash} size='1x' color='gray' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>
            Showing {departments.length} out of {totalRecords} entries
          </h3>
          {/* Pagination */}
          <nav>
            <ul className='pagination'>
              {pageNumbers.map((number) => (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                  <button className='page-link' onClick={() => handlePageChange(number)}>
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </>
  )
}

export default Department
