import {useContext, useEffect, useState} from 'react'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import api from '../../RequestConfig'
import React from 'react'
import {Dropdown, Spinner} from 'react-bootstrap'
import {ReportingManagerContext} from '../context/ReportingManagerContext'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronDown, faChevronUp, faTrash} from '@fortawesome/free-solid-svg-icons'
import {faFilter} from '@fortawesome/free-solid-svg-icons'
import ReactPaginate from 'react-paginate'

// import {SearchComponent} from '../../../../_metronic/assets/ts/components'
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
export const GET_ALL_MANAGERS = `${API_URL}/agent/fields/reporting_manager/get-manager`
export const DELETE_MANAGER = `${API_URL}/agent/fields/reporting_manager/delete-manager`

function ReportingManagers() {
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const {ReportingManagers, loadReportingManagerFunction} = useContext(ReportingManagerContext)
  const [currentPage, setCurrentPage] = React.useState<number>(1)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [totalRecords, setTotalRecords] = React.useState(0)
  const {modalFunction} = useContext(ReportingManagerContext)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [search, setSearch] = React.useState('')
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortOn, setSortOn] = useState<string | null>(null)
  // Defining functions for pagination
  const changeCurrentPage = (n: any = true) => {
    setCurrentPage(n.selected + 1)
  }

  //load all the Reporting Managers from the backend
  async function load_managers() {
    setIsLoading(true)
    const varToken = localStorage.getItem('token')
    try {
      const result = await api.post(
        GET_ALL_MANAGERS,
        {
          search: search ? search : null,
          metaData: {
            limit: recordsPerPage,
            sortBy: sortBy ? sortBy : null,
            sortOn: sortOn ? sortOn : null,
            offset: (currentPage - 1) * recordsPerPage,
          },
        },
        {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      if (result.data.error === false) {
        loadReportingManagerFunction(result.data.data.appReportingManager)
        setTotalRecords(result.data.data.metaData.total_records)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function delete_manager(appManagerId: any) {
    setIsLoading(true)
    const varToken = localStorage.getItem('token')
    const result = await api.delete(
      DELETE_MANAGER,

      {
        headers: {
          genie_access_token: 'Bearer ' + varToken,
        },
        data: {
          appManagerIds: [appManagerId],
        },
      }
    )
    console.log(result)
    if (result.data.error === false) {
      await load_managers()
    }
    setIsLoading(false)
  }
  // Handle page change
  function handlePageChange(page: number) {
    setCurrentPage(page)
  }
  // Calculate total pages
  const totalPages = Math.ceil(totalRecords / recordsPerPage)

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }
  function handleCreateManager(): void {
    modalFunction(true)
  }

  function handleSearchChange(searchValue: any): void {
    setSearch(searchValue)
  }

  function handleSort() {
    if (sortBy === 'asc') {
      setSortBy('desc')
      setSortOn('email')
    } else if (sortBy === 'desc') {
      setSortBy(null)
      setSortOn(null)
    } else {
      setSortBy('asc')
      setSortOn('email')
    }
  }
  useEffect(() => {
    ;(async () => {
      await load_managers()
    })()
  }, [currentPage, search, sortBy, sortOn, recordsPerPage])
  return (
    <>
      <PageTitle breadcrumbs={permissionsBreadCrumbs}>Reporting Managers</PageTitle>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder my-2'>Nourish Genie Reporting Managers</h3>
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
                  <div className='fs-5 text-dark fw-bolder'>Search Managers:</div>
                  <div className='py-3'>
                    <div className='form-group'>
                      <input
                        type='text'
                        className='form-control form-control-solid fw-bold ps-10'
                        placeholder='Search Managers'
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
            onClick={handleCreateManager}
            className='btn btn-primary btn-sm'
          >
            Create New Manager
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className='d-flex align-items-center justify-content-center loader-container'>
          <Spinner animation='border' variant='primary' />
        </div>
      ) : (
        <>
          <div style={{display: 'grid'}}>
            <div className='d-flex justify-content-start fs-6 fw-bold text-gray-700'>
              Showing {firstIndex + 1} to {lastIndex <= totalRecords ? lastIndex : totalRecords} of{' '}
              {totalRecords} Reporting Managers
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
                <th onClick={handleSort} style={{cursor: 'pointer'}} className='align-middle col-8'>
                  Reporitng Manager Name
                  {sortBy === 'asc' && (
                    <FontAwesomeIcon icon={faChevronUp} size='1x' color='black' />
                  )}{' '}
                  {sortBy === 'desc' && (
                    <FontAwesomeIcon icon={faChevronDown} size='1x' color='black' />
                  )}
                </th>
                <th className='align-middle'>Delete</th>
              </tr>
            </thead>
            <tbody className='text-gray-600 fw-bold'>
              {ReportingManagers.map((manager: any, index: number) => (
                <tr key={manager.appManagerId}>
                  <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                  <td>{manager.appAgentId.email}</td>
                  <td>
                    <button className='btn' onClick={() => delete_manager(manager.appManagerId)}>
                      <FontAwesomeIcon icon={faTrash} size='1x' color='gray' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      )}
    </>
  )
}

export default ReportingManagers
