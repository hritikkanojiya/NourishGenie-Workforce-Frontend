/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {Spinner} from 'react-bootstrap'
import {useContext} from 'react'
import api from '../../RequestConfig'
import {DesignationContext} from '../context/DesignationContext'
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
export const GET_ALL_DESIGNATIONS = `${API_URL}/agent/fields/designation/get-designation`
export const DELETE_Designation = `${API_URL}/agent/fields/designation/delete-designation`

function Designation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [search, setSearch] = React.useState('')
  const {modalFunction} = useContext(DesignationContext)
  const {editModalFunction} = useContext(DesignationContext)
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const {designations, loadDesignationFunction} = useContext(DesignationContext)
  const {editDesignationId} = useContext(DesignationContext)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortOn, setSortOn] = useState<string | null>(null)
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  const [totalRecords, setTotalRecords] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  useEffect(() => {
    ;(async () => {
      await load_Designations()
    })()
  }, [currentPage, search, sortBy, sortOn, recordsPerPage])

  // Defining functions for pagination
  const changeCurrentPage = (n: any = true) => {
    setCurrentPage(n.selected + 1)
  }
  //load all the Designations from the backend
  async function load_Designations() {
    setIsLoading(true)
    const varToken = localStorage.getItem('token')
    try {
      const result = await api.post(
        GET_ALL_DESIGNATIONS,
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
      loadDesignationFunction(result.data.data.appDesignations)
      setTotalRecords(result.data.data.metaData.total_records)
      if (result.data.error === false) {
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }
  function handleEdit(appDesignationId: any): void {
    editModalFunction(true)
    editDesignationId(appDesignationId)
  }
  function handleCreateDesignation(): void {
    modalFunction(true)
  }

  async function delete_Designation(appDesignationId: any) {
    setIsLoading(true)
    const varToken = localStorage.getItem('token')
    const result = await api.delete(
      DELETE_Designation,

      {
        headers: {
          genie_access_token: 'Bearer ' + varToken,
        },
        data: {
          appDesignationIds: [appDesignationId],
        },
      }
    )
    console.log(result)
    if (result.data.error === false) {
      await load_Designations()
    }
    setIsLoading(false)
  }

  function handleSearchChange(search_value: any) {
    setSearch(search_value)
  }
  // Calculate total pages
  const totalPages = Math.ceil(totalRecords / recordsPerPage)

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
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
  return (
    <>
      <PageTitle breadcrumbs={permissionsBreadCrumbs}>Designations</PageTitle>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder my-2'>Nourish Genie Designations</h3>
        <div className='d-flex align-items-center my-2'>
          <div style={{display: 'inline-block', position: 'relative', zIndex: '1'}}>
            <button
              style={{
                padding: '0.5rem 1rem',
                marginRight: '10px',
                fontSize: '14px',
                lineHeight: '1.5',
              }}
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
                  <div className='fs-5 text-dark fw-bolder'>Search Designations:</div>
                  <div className='py-3'>
                    <div className='form-group'>
                      <input
                        type='text'
                        className='form-control form-control-solid fw-bold ps-10'
                        placeholder='Search Designations'
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
          <button onClick={handleCreateDesignation} className='btn btn-primary btn-sm'>
            Create New Designation
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
              {totalRecords} Designations
            </div>
            <select
              className='form-select form-select-solid mx-2'
              style={{width: '180px', marginTop: '10px', backgroundColor: '#ececec'}}
              data-kt-select2='true'
              data-placeholder='Show records'
              value={recordsPerPage}
              onChange={(e: any) => {
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
                  Designation Name{' '}
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
              {designations.map((Designation: any, index: number) => (
                <tr key={Designation.appDesignationId}>
                  <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                  <td>{Designation.name}</td>
                  <td>
                    <button
                      className='btn'
                      onClick={() => handleEdit(Designation.appDesignationId)}
                    >
                      <FontAwesomeIcon icon={faPencilAlt} size='1x' color='gray' />
                    </button>
                  </td>
                  <td>
                    <button
                      className='btn'
                      onClick={() => delete_Designation(Designation.appDesignationId)}
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

export default Designation
