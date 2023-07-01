import React, {useState, useEffect} from 'react'
import {AtWorkCard} from '../../../_metronic/partials/content/cards/AtWorkCard'
import api from '../RequestConfig'

const API_URL = process.env.REACT_APP_API_URL
export const LOAD_ALL_EMPLOYEES = `${API_URL}/agent/activity/get-users-activity`

function EmployeeWorkPage() {
  const [loggedInEmployees, setLoggedInEmployees] = useState([])
  const [breakInEmployees, setBreakInEmployees] = useState([])
  const [currentEmployee, setCurrentEmployee] = useState('null')

  // Employee Types:
  const employeeTypes = ['Permanent', 'Internship', 'Part-time', 'Freelancer']

  const loadAllEmployees = async (s: any = null, e: any = null) => {
    try {
      const data = await api.post(LOAD_ALL_EMPLOYEES, {
        search: s !== '' ? s : null,
        employeeType: e !== 'null' ? e : null,
      })
      console.log('Data = ', data.data)
      console.log('Logged in Users = ', data.data.data.loggedInUsers)
      console.log('Break in users = ', data.data.data.breakInUsers)

      setLoggedInEmployees(data.data.data.loggedInUsers)
      setBreakInEmployees(data.data.data.breakInUsers)
    } catch (error) {
      console.log('Error = ', error)
    }
  }

  useEffect(() => {
    loadAllEmployees()
  }, [])

  // Function to load the cards
  const AtWorkCards = loggedInEmployees.map((e: any) => {
    return (
      <div className='col-md-6 col-xxl-4'>
        <AtWorkCard
          name={e.fullname}
          avatar='/media/avatars/300-25.jpg'
          online={true}
          email={e.email}
          id={e.appUserId}
        />
      </div>
    )
  })

  const AwayCards = breakInEmployees.map((e: any) => {
    return (
      <div className='col-md-6 col-xxl-4'>
        <AtWorkCard
          name={e.fullname}
          avatar='/media/avatars/300-25.jpg'
          online={false}
          email={e.email}
          id={e.appUserId}
        />
      </div>
    )
  })

  // Styles
  // const buttonStyle = {
  //   padding: '0.5rem 1rem',
  //   fontSize: '14px',
  //   lineHeight: '1.5',
  // }

  // const containerStyle = {
  //   gap: '20px',
  //   marginRight: '40px',
  // }

  // Styles
  const selectStyle = {
    borderRadius: '0',
    fontSize: '14px',
  }

  // const searchBarStyle = {
  //   padding: '8px',
  //   border: '1px solid #ccc',
  //   borderRadius: '5px',
  //   boxShadow: 'none',
  //   width: '100%',
  //   fontSize: '16px',
  //   fontFamily: 'Arial, sans-serif',
  //   color: '#333',
  //   backgroundColor: '#fff',
  //   backgroundImage: 'none',
  //   outline: 'none',
  //   marginBottom: '10px',
  //   // marginRight: '50%',
  // }

  const searchBarStyle = {
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '20px', // Adjust the border radius to control roundness
    boxShadow: 'none',
    width: '90%',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    backgroundColor: '#fff',
    backgroundImage: 'none',
    outline: 'none',
    marginBottom: '10px',
  }

  return (
    <>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <div className='d-flex justify-content-start fs-6 fw-bold text-gray-700'>
          {/* Dropdown Content */}
          <select
            style={selectStyle}
            className='form-select form-select-lg form-select-solid'
            onChange={(e) => {
              setCurrentEmployee(e.target.value)
              loadAllEmployees(null, e.target.value)
            }}
          >
            <option value={'null'}>Nourish Genie</option>
            {employeeTypes.map((e: any) => (
              <option>{e}</option>
            ))}
          </select>
        </div>
        <div
          className='d-flex justify-content-center fs-6 fw-bold text-gray-700'
          style={{marginRight: '45%'}}
        >
          {/* Search input bar */}
          <input
            type='search'
            placeholder='Search Employees'
            style={searchBarStyle}
            onChange={(e) => {
              console.log('Before sending = ', e.target.value)

              loadAllEmployees(e.target.value, currentEmployee)
            }}
          />
        </div>
        {/* <div
          className='d-flex justify-content-end flex-wrap flex-stack mb-6'
          style={containerStyle}
        >
          <button className='btn btn-success btn-text-white' style={buttonStyle}>
            Check In
          </button>
        </div> */}
      </div>
      {/* At Work Card Implementation */}
      <div className='row g-5'>
        <div className='col-lg-4'>
          <div className='card card-custom card-stretch shadow mb-5 card-rounded-bottom card-rounded-top'>
            <div className='card-header py-1' style={{background: '#8c8c8f'}}>
              {/* #d5d7db */}
              <h6 className='card-title'>At Work</h6>
            </div>
            <div
              className='card-body p-0'
              style={{
                overflowY: 'auto',
                maxHeight: '300px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#ccc #aaa',
              }}
            >
              {AtWorkCards}
            </div>
          </div>
        </div>
        {/* Away Card Implementation */}
        <div className='col-lg-4'>
          <div className='card card-custom card-stretch shadow mb-5 card-rounded-bottom card-rounded-top'>
            <div className='card-header py-1' style={{background: '#8c8c8f'}}>
              {/* Grey - #d5d7db Light Grey - #e3e8e5 */}
              <h6 className='card-title'>Away</h6>
            </div>
            <div
              className='card-body p-0'
              style={{
                overflowY: 'auto',
                maxHeight: '300px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#ccc #aaa',
              }}
            >
              {AwayCards}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EmployeeWorkPage
