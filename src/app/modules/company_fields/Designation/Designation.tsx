/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect} from 'react'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {Dropdown, Spinner} from 'react-bootstrap'
import {useContext} from 'react'
import api from '../../RequestConfig'
import {DesignationContext} from '../context/DesignationContext'

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
  const [search, setSearch] = React.useState('')
  const {modalFunction} = useContext(DesignationContext)
  const {editModalFunction} = useContext(DesignationContext)
  const {designations, loadDesignationFunction} = useContext(DesignationContext)
  const {editDesignationId} = useContext(DesignationContext)
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 5
  const [totalRecords, setTotalRecords] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  useEffect(() => {
    ;(async () => {
      await load_Designations()
    })()
  }, [currentPage, search])
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
      <PageTitle breadcrumbs={permissionsBreadCrumbs}>Designations</PageTitle>
      {isLoading ? (
        <div className='d-flex align-items-center justify-content-center loader-container'>
          <Spinner animation='border' variant='primary' />
        </div>
      ) : (
        <>
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
            <button
              type='button'
              className='btn btn-primary'
              onClick={() => {
                load_Designations()
              }}
            >
              Search
            </button>
          </div>
          <div className='d-flex flex-wrap flex-stack mb-6'>
            <h3 className='fw-bolder my-2'>Nourish Genie Designations</h3>
            <div className='d-flex align-items-center my-2'>
              <button onClick={handleCreateDesignation} className='btn btn-primary btn-sm'>
                Create New Designation
              </button>
            </div>
          </div>
          <table className='table table-bordered table-hover'>
            <thead>
              <tr>
                <th className='align-middle'>#</th>
                <th className='align-middle'>Designation Name</th>
                <th className='align-middle'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {designations.map((Designation: any, index: number) => (
                <tr key={Designation.appDesignationId}>
                  <td>{index + 1}</td>
                  <td>{Designation.name}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        id={`dropdown-${Designation.appDesignationId}`}
                        className=' bg-transparent'
                        style={{color: 'black'}}
                      >
                        Actions
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          className='dropdown-item'
                          onClick={() => handleEdit(Designation.appDesignationId)}
                        >
                          Edit
                          {}
                        </Dropdown.Item>
                        <Dropdown.Item
                          className='dropdown-item'
                          onClick={() => delete_Designation(Designation.appDesignationId)}
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
            {' '}
            Showing {designations.length} out of {totalRecords} entries
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

export default Designation
