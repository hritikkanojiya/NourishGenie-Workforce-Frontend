import React, {useEffect, useState} from 'react'
import api from '../RequestConfig'
import {GET_ALL_DEPARTMENTS} from './CompanyEmployees'

const API_URL = process.env.REACT_APP_API_URL
export const GET_EMPLOYEES_ATTENDANCE = `${API_URL}/user/attendance/get-attendance`

interface Employee {
  fullName: string
  status: string
  createdAt: string
}

interface AllEmployees {
  [key: string]: Employee[]
}

function AttendancePage() {
  const [allEmployees, setAllEmployees] = useState<AllEmployees>({})
  const [employee, setEmployee] = useState<Employee[]>([])
  const [departments, setDepartments] = useState([])
  const [currentDepartment, setCurrentDepartment] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  // Variables for Year and Month
  const year = new Date().getFullYear()
  const monthOptions = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ]
  const yearOptions = Array.from({length: 10}, (_, index) => year - index)
  const [currentMonth, setCurrentMonth] = useState<string>(monthOptions[new Date().getMonth()])
  const [currentYear, setCurrentYear] = useState<string>(new Date().getFullYear().toString())
  const daysInMonth = new Date(
    parseInt(currentYear),
    monthOptions.indexOf(currentMonth) + 1,
    0
  ).getDate()
  const dates = Array.from({length: daysInMonth}, (_, index) => index + 1)

  // Function to get all employees attendance
  const loadAttendance = async () => {
    const varToken = localStorage.getItem('token')

    try {
      const result = await api.post(
        GET_EMPLOYEES_ATTENDANCE,
        {
          search: search !== '' && search !== ' ' ? search : null,
          month: currentMonth,
          year: currentYear,
          departmentName: currentDepartment,
        },
        {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      console.log('Attendance data = ', result.data.data.usersAttendances)
      console.log('Dates = ', dates)
      setAllEmployees(result.data.data.usersAttendances)
      //   setRecordsPerPage(result.data.data.userAttendance.metaData.total_records)
    } catch (error) {
      console.log('Attendance Page error = ', error)
    }
  }

  const loadDepartments = async () => {
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
    }
  }

  useEffect(() => {
    loadAttendance()
    loadDepartments()
  }, [currentDepartment, search, currentMonth, currentYear])

  // Function for the table rows
  const tableRows = Object.entries(allEmployees).map(([key, value]: [string, Employee[]]) => {
    return (
      <tr key={key}>
        <td>{value[0].fullName}</td>
        {value.map((emp: Employee) => {
          const dateStr = new Date(emp.createdAt)
          const dateNum = dateStr.getDate()
          const lastDate = dates[dates.length - 1]
          console.log('DateNum = ', dateNum)

          return (
            <>
              {dates.map((e: any) => {
                if (dateNum < e) {
                  return null
                } else if (dateNum === e) {
                  return (
                    <td>{emp.status === 'ABSENT' ? 'A' : emp.status === 'PRESENT' ? 'P' : 'HD'}</td>
                  )
                }
                return <td>N/A</td>
              })}
            </>
          )
        })}
      </tr>
    )
  })

  // const tableRows = Promise.all(
  //   Object.entries(allEmployees).map(async ([key, value]) => {
  //     return (
  //       <tr key={key}>
  //         <td>{value[0].fullName}</td>
  //         {await Promise.all(
  //           value.map(async (emp) => {
  //             const dateStr = new Date(emp.createdAt)
  //             const dateNum = dateStr.getDate()
  //             console.log('DateNum = ', dateNum)

  //             const tdElements = await Promise.all(
  //               dates.map(async (e) => {
  //                 if (dateNum < e) {
  //                   return null
  //                 } else if (dateNum === e) {
  //                   return (
  //                     <td>{emp.status === 'ABSENT' ? 'A' : emp.status === 'PRESENT' ? 'P' : 'HD'}</td>
  //                   )
  //                 }
  //                 return <td>N/A</td>
  //               })
  //             )

  //             return tdElements
  //           })
  //         )}
  //       </tr>
  //     )
  //   })
  // )

  // Function for handling search
  function handleSearch(searchValue: string) {
    setSearch(searchValue)
  }

  return (
    <>
      <div className='d-inline-flex justify-items-center flex-wrap flex-stack mb-6'>
        <div className='px-7 py-5'>
          <div className='fs-5 text-dark fw-bolder'>Filter Employees By Department:</div>
          <select
            className='form-select form-select-solid'
            data-kt-select2='true'
            data-placeholder='Select option'
            data-allow-clear='true'
            onChange={(e) => {
              setCurrentDepartment(e.target.value !== 'null' ? e.target.value : null)
            }}
          >
            <option value={'null'}>All Departments</option>
            {departments.map((dn: any) => (
              <option key={dn.appDepartmentId} value={dn.name}>
                {dn.name}
              </option>
            ))}
          </select>
        </div>
        <div className='px-7 py-5'>
          <div className='fs-5 text-dark fw-bolder'>Search Employees:</div>
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
        <div className='px-7 py-5'>
          <div className='fs-5 text-dark fw-bolder'>Select Month:</div>
          <select
            className='form-select form-select-solid'
            data-kt-select2='true'
            data-placeholder='Select option'
            data-allow-clear='true'
            onChange={(e) => {
              if (e.target.value !== 'null') {
                setCurrentMonth(e.target.value)
              }
            }}
          >
            <option value={'null'}>Month</option>
            {monthOptions.map((dn: any) => (
              <option value={dn}>{dn}</option>
            ))}
          </select>
        </div>
        <div className='px-7 py-5'>
          <div className='fs-5 text-dark fw-bolder'>Select Year:</div>
          <select
            className='form-select form-select-solid'
            data-kt-select2='true'
            data-placeholder='Select option'
            data-allow-clear='true'
            onChange={(e) => {
              if (e.target.value !== 'null') {
                setCurrentYear(e.target.value)
              }
            }}
          >
            <option value={'null'}>Year</option>
            {yearOptions.map((dn: any) => (
              <option value={dn}>{dn}</option>
            ))}
          </select>
        </div>
      </div>
      <table className='table table-hover table-rounded table-striped border gy-7 gs-7'>
        <thead>
          <tr className='py-5 fw-bolder fs-4 text-gray-800 border-bottom-2 border-gray-400'>
            <th>Name</th>
            {dates.map((e: any) => {
              return <th>{e}</th>
            })}
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </>
  )
}

export default AttendancePage
