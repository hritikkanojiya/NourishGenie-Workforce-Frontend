import React, {useEffect} from 'react'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import axios from 'axios'
import {Dropdown} from 'react-bootstrap'
import {useContext} from 'react'
import {DepartmentContext} from '../context/DepartmentContext'

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
export const GET_ALL_DEPARTMENTS = `${API_URL}/agent/fields/department/getAppDepartment`
export const DELETE_DEPARTMENT = `${API_URL}/agent/fields/department/deleteAppDepartment`

function Department() {
  const {modalFunction, editModalFunction} = useContext(DepartmentContext)
  const {departments, loadDepartmentFunction} = useContext(DepartmentContext)
  const {editDepartmentId} = useContext(DepartmentContext)
  const [search, setSearch] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 3
  const [totalRecords, setTotalRecords] = React.useState(0)

  useEffect(() => {
    loadDepartments()
  }, [currentPage, search]) // Include currentPage and search as dependencies

  // Load departments from the backend
  async function loadDepartments() {
    const varToken = localStorage.getItem('token')
    try {
      const result = await axios.post(
        GET_ALL_DEPARTMENTS,
        {
          search: search,
          metaData: {
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + varToken,
          },
        }
      )
      loadDepartmentFunction(result.data.data.AppDepartment)
      setTotalRecords(result.data.data.metaData.total_records)
    } catch (err) {
      console.log(err)
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
    const varToken = localStorage.getItem('token')
    const result = await axios.post(
      DELETE_DEPARTMENT,
      {
        appDepartmentId: [AppDepartmentId],
      },
      {
        headers: {
          Authorization: 'Bearer ' + varToken,
        },
      }
    )
    console.log(result)
    if (result.data.error === false) {
      await loadDepartments()
    }
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
      {/* Departments list */}
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder my-2'>Nourish Genie Departments</h3>
        <div className='d-flex align-items-center my-2'>
          <button onClick={handleCreateDepartment} className='btn btn-primary btn-sm'>
            Create New Department
          </button>
        </div>
      </div>
      <table className='table table-bordered table-hover'>
        <thead>
          <tr>
            <th className='align-middle'>#</th>
            <th className='align-middle'>Department Name</th>
            <th className='align-middle'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department: any, index: number) => (
            <tr key={department.AppDepartmentId}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{department.name}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle
                    id={`dropdown-${department.AppDepartmentId}`}
                    className=' bg-transparent'
                  >
                    Actions
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      className='dropdown-item'
                      onClick={() => handleEdit(department.AppDepartmentId)}
                    >
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item
                      className='dropdown-item'
                      onClick={() => deleteDepartment(department.AppDepartmentId)}
                    >
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
  )
}

export default Department
