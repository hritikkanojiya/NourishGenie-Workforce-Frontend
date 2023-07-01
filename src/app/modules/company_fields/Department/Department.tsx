import React, {useEffect, useState} from 'react'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import api from '../../RequestConfig'
import {Spinner} from 'react-bootstrap'
import {useContext} from 'react'
import {DepartmentContext} from '../context/DepartmentContext'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronDown, faChevronUp, faPencilAlt, faTrash} from '@fortawesome/free-solid-svg-icons'
import {faFilter} from '@fortawesome/free-solid-svg-icons'
import ReactPaginate from 'react-paginate'

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {modalFunction, editModalFunction} = useContext(DepartmentContext)
  const {departments, loadDepartmentFunction} = useContext(DepartmentContext)
  const {editDepartmentId} = useContext(DepartmentContext)
  const [search, setSearch] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalRecords, setTotalRecords] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortOn, setSortOn] = useState<string | null>(null)
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  useEffect(() => {
    loadDepartments()
  }, [currentPage, search, sortBy, sortOn, recordsPerPage])

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
            limit: recordsPerPage,
            sortBy: sortBy ? sortBy : null,
            sortOn: sortOn ? sortOn : null,
            offset: search ? null : (currentPage - 1) * recordsPerPage,
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

  function handleSort() {
    if (sortBy === 'asc') {
      setSortBy('desc')
      setSortOn('name')
    } else if (sortBy === 'desc') {
      setSortBy(null)
      setSortOn(null)
    } else {
      setSortBy('asc')
      setSortOn('name')
    }
  }

  // Defining functions for pagination
  const changeCurrentPage = (n: any = true) => {
    setCurrentPage(n.selected + 1)
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

  // Calculate total pages
  const totalPages = Math.ceil(totalRecords / recordsPerPage)

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <>
      <PageTitle breadcrumbs={permissionsBreadCrumbs}>Departments</PageTitle>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder my-2'>Nourish Genie Departments</h3>
        <div style={{display: 'flex'}} className='d-flex align-items-center my-2'>
          <div style={{display: 'inline-block', position: 'relative', zIndex: '1'}}>
            <button
              style={{padding: '0.5rem 1rem', fontSize: '14px', lineHeight: '1.5'}}
              className='btn btn-primary dropdown-toggle'
              type='button'
              data-toggle='dropdown'
              onClick={() => {
                setIsMenuOpen(!isMenuOpen)
              }}
            >
              Filter
              <FontAwesomeIcon icon={faFilter} />
            </button>
            {isMenuOpen && (
              <div
                style={{
                  display: isMenuOpen ? 'block' : 'none',
                  minWidth: 'auto',
                  padding: '0',
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  zIndex: '2',
                }}
                className='menu menu-sub menu-sub-dropdown w-250px w-md-300px'
                data-kt-menu='true'
              >
                <div className='px-7 py-5'>
                  <div className='fs-5 text-dark fw-bolder'>Search Departments:</div>
                  <div className='py-3'>
                    <div className='form-group'>
                      <input
                        type='text'
                        className='form-control form-control-solid fw-bold ps-10'
                        placeholder='Search Departments'
                        value={search}
                        onChange={(e) => {
                          handleSearchChange(e.target.value)
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className='d-flex justify-content-end'>
                  <button
                    style={{marginBottom: '10px'}}
                    type='reset'
                    className='btn btn-sm btn-light btn-active-light-primary me-2'
                    data-kt-menu-dismiss='true'
                    onClick={() => {
                      setIsMenuOpen(!isMenuOpen)
                      setSearch('')
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            style={{marginLeft: '20px'}}
            onClick={handleCreateDepartment}
            className='btn btn-primary btn-sm'
          >
            Create New Department
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className='d-flex align-items-center justify-content-center loader-container'>
          <Spinner animation='border' variant='primary' />
        </div>
      ) : (
        <>
          {/* Departments list */}
          <div style={{display: 'grid'}}>
            <div className='d-flex justify-content-start fs-6 fw-bold text-gray-700'>
              Showing {firstIndex + 1} to {lastIndex <= totalRecords ? lastIndex : totalRecords} of{' '}
              {totalRecords} Departments
            </div>
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

          <table
            id='kt_table_users'
            className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
          >
            <thead>
              <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                <th className='align-middle'>#</th>
                <th style={{cursor: 'pointer'}} onClick={handleSort} className='align-middle col-8'>
                  Department Name{' '}
                  {sortBy === 'asc' && (
                    <FontAwesomeIcon icon={faChevronUp} size='1x' color='black' />
                  )}{' '}
                  {sortBy === 'desc' && (
                    <FontAwesomeIcon icon={faChevronDown} size='1x' color='black' />
                  )}
                </th>
                <th className='align-right'>Edit</th>
                <th className='align-left'>Delete</th>
              </tr>
            </thead>
            <tbody className='text-gray-600 fw-bold'>
              {departments.map((department: any, index: number) => (
                <tr key={department.appDepartmentId}>
                  <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
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
        </>
      )}
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

export default Department
