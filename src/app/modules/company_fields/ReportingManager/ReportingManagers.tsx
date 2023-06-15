import {useContext, useEffect} from 'react'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import axios from 'axios'
import React from 'react'
import {Dropdown} from 'react-bootstrap'
import {ReportingManagerContext} from '../context/ReportingManagerContext'

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
  useEffect(() => {
    ;(async () => {
      await load_managers()
    })()
  }, [])
  const {ReportingManagers, loadReportingManagerFunction} = useContext(ReportingManagerContext)
  const [currentPage, setCurrentPage] = React.useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(10)
  const [totalRecords, setTotalRecords] = React.useState(0)
  const {modalFunction} = useContext(ReportingManagerContext)

  //load all the Reporting Managers from the backend
  async function load_managers() {
    const varToken = localStorage.getItem('token')
    try {
      const result = await axios.post(
        GET_ALL_MANAGERS,
        {},
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
    }
  }

  async function delete_manager(appManagerId: any) {
    const varToken = localStorage.getItem('token')
    const result = await axios.post(
      DELETE_MANAGER,
      {
        appManagerId: [appManagerId],
      },
      {
        headers: {
          genie_access_token: 'Bearer ' + varToken,
        },
      }
    )
    console.log(result)
    if (result.data.error === false) {
      await load_managers()
    }
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
  function handleCreateManager(): void {
    modalFunction(true)
  }
  return (
    <>
      <PageTitle breadcrumbs={permissionsBreadCrumbs}>Reporting Managers</PageTitle>
      <div className='mb-4 d-flex'>
        <input
          type='text'
          className='form-control'
          placeholder='Search...'
          onChange={(e) => {
            //handleSearchChange(e.target.value)
          }}
        />
        <button
          type='button'
          className='btn btn-primary'
          onClick={() => {
            //load_Designations()
          }}
        >
          Search
        </button>
      </div>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder my-2'>Nourish Genie Reporting Managers</h3>
        <div className='d-flex align-items-center my-2'>
          <button onClick={handleCreateManager} className='btn btn-primary btn-sm'>
            Create New Manager
          </button>
        </div>
      </div>
      <table className='table table-bordered table-hover'>
        <thead>
          <tr>
            <th className='align-middle'>#</th>
            <th className='align-middle'>Reporitng Manager Name</th>
            <th className='align-middle'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ReportingManagers.map((manager: any, index: number) => (
            <tr key={manager.appManagerId}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{manager.appAgentId.email}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle
                    id={`dropdown-${manager.appManagerId}`}
                    className=' bg-transparent'
                  >
                    Actions
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      className='dropdown-item'
                      onClick={() => delete_manager(manager.appManagerId)}
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
        Showing {ReportingManagers.length} out of {totalRecords} entries
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

export default ReportingManagers
