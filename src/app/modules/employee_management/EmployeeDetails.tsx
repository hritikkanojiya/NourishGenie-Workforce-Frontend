import {useEffect} from 'react'
import React from 'react'
import {useLocation} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'
import api from '../RequestConfig'
const API_URL = process.env.REACT_APP_API_URL
export const GET_USER_DETAILS = `${API_URL}/agent/account/get-agent-details`
function EmployeeDetails() {
  const location: any = useLocation()
  const [details, setDetails] = React.useState<any>({})
  const [isLoading, setIsLoading] = React.useState(false)
  useEffect(() => {
    ;(async () => {
      const id = location.state
      await load_details(id)
    })()
  }, [])

  function formatDate(date: any) {
    const date1 = new Date(date)
    const month = String(date1.getMonth() + 1).padStart(2, '0') // Add leading zero if necessary
    const day = String(date1.getDate()).padStart(2, '0') // Add leading zero if necessary
    const year = date1.getFullYear()

    return `${month}/${day}/${year}`
  }

  async function load_details(id: any) {
    setIsLoading(true)
    const varToken = localStorage.getItem('token')

    try {
      console.log(id)
      const result = await api.post(
        GET_USER_DETAILS,
        {
          appAgentId: id,
        },
        {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )

      setDetails(result.data.data)
      if (result.data.error === false) {
        console.log(result.data.data)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading ? (
        <div className='d-flex align-items-center justify-content-center loader-container'>
          <Spinner animation='border' variant='primary' />
        </div>
      ) : (
        <div>
          {/* {Profile Section} */}
          <div className='card shadow' style={{width: '100%', margin: '0 auto'}}>
            <div className='card-body'>
              <div style={{display: 'flex'}}>
                <div style={{flex: '1'}}>
                  <h1 style={{color: 'darkorange'}} className='card-title'>
                    Profile Section
                  </h1>
                </div>
              </div>

              <div style={{display: 'flex'}}>
                <div style={{flex: '1'}}>
                  <div className='form-group'>
                    <label
                      htmlFor='firstName'
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                    >
                      First Name:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.user_details ? details.user_details.first_name : ''}
                    </span>
                  </div>

                  <div className='form-group' style={{marginTop: '20px'}}>
                    <label
                      htmlFor='lastName'
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                    >
                      Last Name:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.user_details ? details.user_details.last_name : ''}
                    </span>
                  </div>
                </div>

                <div style={{flex: '1'}}>
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='email'
                    >
                      Email:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.user_details ? details.user_details.email : ''}
                    </span>
                  </div>

                  <div className='form-group' style={{marginTop: '20px'}}>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='appAgentIdOfDepartment'
                    >
                      Department Id:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.user_details ? details.user_details.appAgentIdOfDepartment : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* end of profile section */}
          {/* main div with display flex */}
          <div style={{display: 'flex', justifyContent: 'space-around', width: '100%'}}>
            {/* sub-div with display grid  (left side) */}
            <div style={{display: 'grid', width: '48%'}}>
              {/* {Basic Details} */}
              <div
                className='card shadow'
                style={{
                  alignContent: 'left',
                  marginTop: '20px',
                  padding: '20px',
                }}
              >
                <div className='card-body'>
                  <div>
                    <h1 style={{color: 'darkorange'}} className='card-title'>
                      Basic Details
                    </h1>
                    <br />
                  </div>
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='gender'
                    >
                      Gender
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.company_details ? details.company_details.gender : ''}
                    </span>
                  </div>

                  <br />
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='marital_status'
                    >
                      Marital Status:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.company_details ? details.company_details.marital_status : ''}
                    </span>
                  </div>
                  <br />
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='contact_number'
                    >
                      Contact Number:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.company_details ? details.company_details.contact_number : ''}
                    </span>
                  </div>
                  <br />
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='date_of_birth'
                    >
                      Date of Birth:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.company_details
                        ? formatDate(details.company_details.date_of_birth)
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
              {/* Bank Information */}
              <div
                className='card shadow'
                style={{
                  alignContent: 'left',
                  marginTop: '20px',
                  padding: '20px',
                }}
              >
                <div className='card-body'>
                  <div>
                    <h1 style={{color: 'darkorange'}} className='card-title'>
                      Bank Information
                    </h1>
                  </div>
                  <br />
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='account_number'
                    >
                      Account Number:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.bank_details ? details.bank_details.account_number : ''}
                    </span>
                  </div>
                  <br />
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='bank_name'
                    >
                      Bank Name:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.bank_details ? details.bank_details.bank_name : ''}
                    </span>
                  </div>
                  <br />
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='name_as_per_bank'
                    >
                      Name as per bank:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.bank_details ? details.bank_details.name_as_per_bank : ''}
                    </span>
                  </div>
                  <br />
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='ifsc_code'
                    >
                      IFSC CODE:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.bank_details ? details.bank_details.ifsc_code : ''}
                    </span>
                  </div>
                </div>
              </div>
              {/* Address Information */}
              <div
                className='card shadow'
                style={{
                  alignContent: 'left',
                  marginTop: '20px',
                  padding: '20px',
                }}
              >
                <div className='card-body'>
                  <div>
                    <h1 style={{color: 'darkorange'}} className='card-title'>
                      Address Information
                    </h1>
                  </div>
                  <br />
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='country'
                    >
                      Country:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.address_details ? details.address_details.country.name : ''}
                    </span>
                  </div>
                  <br />
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='state'
                    >
                      State:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.address_details ? details.address_details.state.name : ''}
                    </span>
                  </div>
                  <br />

                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='city'
                    >
                      City:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.address_details ? details.address_details.city.name : ''}
                    </span>
                  </div>
                  <br />
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='address'
                    >
                      Address:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.address_details ? details.address_details.address : ''}
                    </span>
                  </div>
                  <br />
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='landmark'
                    >
                      Landmark:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.address_details ? details.address_details.landmark : ''}
                    </span>
                  </div>
                  <br />
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='pincode'
                    >
                      Pincode:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.address_details ? details.address_details.pincode : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* sub div with display grid (right side) */}
            <div style={{display: 'grid', width: '48%'}}>
              {/* {Work Details} */}
              <div
                className='card shadow'
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '20px',
                  padding: '20px',
                }}
              >
                <div className='card-body'>
                  <div>
                    <h1 style={{color: 'darkorange'}} className='card-title'>
                      Work Information
                    </h1>

                    <br />
                    {/* primary email */}
                    <div className='form-group'>
                      <label
                        style={{
                          marginBottom: '8px',
                          fontWeight: 'bold',
                          color: 'blue',
                          fontSize: '1.2em',
                        }}
                        htmlFor='primary_email'
                      >
                        Primary Email:
                      </label>
                      <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                        {details.company_details ? details.company_details.primary_email : ''}
                      </span>
                    </div>
                    <br />
                    {/* company email */}
                    <div className='form-group'>
                      <label
                        style={{
                          marginBottom: '8px',
                          fontWeight: 'bold',
                          color: 'blue',
                          fontSize: '1.2em',
                        }}
                        htmlFor='company_email'
                      >
                        Company Email:
                      </label>
                      <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                        {details.company_details ? details.company_details.company_email : ''}
                      </span>
                    </div>
                    <br />
                    {/* salary */}
                    <div className='form-group'>
                      <label
                        style={{
                          marginBottom: '8px',
                          fontWeight: 'bold',
                          color: 'blue',
                          fontSize: '1.2em',
                        }}
                        htmlFor='salary'
                      >
                        Salary:
                      </label>
                      <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                        {details.company_details ? details.company_details.salary : ''}
                      </span>
                    </div>
                    <br />
                    {/* date of joining */}
                    <div className='form-group'>
                      <label
                        style={{
                          marginBottom: '8px',
                          fontWeight: 'bold',
                          color: 'blue',
                          fontSize: '1.2em',
                        }}
                        htmlFor='date_of_joining'
                      >
                        Date of Joining:
                      </label>
                      <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                        {details.company_details
                          ? formatDate(details.company_details.date_of_joining)
                          : ''}
                      </span>
                    </div>
                    <br />
                    {/* employee type */}
                    <div className='form-group'>
                      <label
                        style={{
                          marginBottom: '8px',
                          fontWeight: 'bold',
                          color: 'blue',
                          fontSize: '1.2em',
                        }}
                        htmlFor='employee_type'
                      >
                        Employee Type:
                      </label>
                      <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                        {details.user_details ? details.user_details.employee_type : ''}
                      </span>
                    </div>
                    <br />
                    {/* working hours */}
                    <div className='form-group'>
                      <label
                        style={{
                          marginBottom: '8px',
                          fontWeight: 'bold',
                          color: 'blue',
                          fontSize: '1.2em',
                        }}
                        htmlFor='working_hours'
                      >
                        Working Hours:
                      </label>
                      <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                        {details.company_details ? details.company_details.working_hours : ''}
                      </span>
                    </div>
                    <br />
                    {/* department */}
                    <div className='form-group'>
                      <label
                        style={{
                          marginBottom: '8px',
                          fontWeight: 'bold',
                          color: 'blue',
                          fontSize: '1.2em',
                        }}
                        htmlFor='department'
                      >
                        Department:
                      </label>
                      <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                        {details.user_details ? details.user_details.appDepartmentId.name : ''}
                      </span>
                    </div>
                    <br />
                    {/* designation */}
                    <div className='form-group'>
                      <label
                        style={{
                          marginBottom: '8px',
                          fontWeight: 'bold',
                          color: 'blue',
                          fontSize: '1.2em',
                        }}
                        htmlFor='designation'
                      >
                        Designation:
                      </label>
                      <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                        {details.user_details ? details.user_details.appDesignationId.name : ''}
                      </span>
                      <div style={{display: 'flex'}}></div>
                    </div>
                    <br />
                    {/* access group */}
                    <div className='form-group'>
                      <label
                        style={{
                          marginBottom: '8px',
                          fontWeight: 'bold',
                          color: 'blue',
                          fontSize: '1.2em',
                        }}
                        htmlFor='department'
                      >
                        Access Group:
                      </label>
                      <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                        {details.user_details ? details.user_details.appAccessGroupId.name : ''}
                      </span>
                      <div style={{display: 'flex'}}></div>
                    </div>
                    <br />
                    {/* reporting managers */}
                    <div className='form-group'>
                      <label
                        style={{
                          marginBottom: '8px',
                          fontWeight: 'bold',
                          color: 'blue',
                          fontSize: '1.2em',
                        }}
                        htmlFor='reporting_manager'
                      >
                        Reporting Manager:
                      </label>
                      <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                        {details.user_details
                          ? details.user_details.appReportingManagerId
                            ? details.user_details.appReportingManagerId.appAgentId.email
                            : 'No Manager Assigned'
                          : ''}
                      </span>
                      <div style={{display: 'flex'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Emergency contact information */}
              <div
                className='card shadow'
                style={{
                  alignContent: 'left',
                  marginTop: '20px',
                  padding: '20px',
                }}
              >
                <div className='card-body'>
                  <div>
                    <h1 style={{color: 'darkorange'}} className='card-title'>
                      Emergency Contact Information
                    </h1>
                  </div>
                  <br />
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='number'
                    >
                      Emergency Contact Number:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.contact_details ? details.contact_details.number : ''}
                    </span>
                  </div>
                  <br />
                  <div className='form-group'>
                    <label
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: 'blue',
                        fontSize: '1.2em',
                      }}
                      htmlFor='relation'
                    >
                      Relation with Employee:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em'}}>
                      {details.contact_details ? details.contact_details.relation : ''}
                    </span>
                  </div>
                </div>
              </div>
              {/* end of emergency information */}
            </div>
          </div>

          {/* {Files and Documents} */}
          {/* <div style={{width: '100%'}}>
            <div
              className='card shadow'
              style={{
                marginTop: '20px',
                padding: '20px',
              }}
            >
              <div className='card-body'>
                <div>
                  <h1 style={{color: 'darkorange'}} className='card-title'>
                    Files and Documents
                  </h1>
                  <br />
                  aadhar card number
                </div>
                <div className='form-group'>
                  <label htmlFor='aadhar_number'>Aadhar Number:</label>
                </div>
                <br />
                aadhar card file
                <div className='form-group'>
                  <label htmlFor='aadhar_number'>Aadhar File:</label>
                </div>
                <br />
                Pan number 
                <div className='form-group'>
                  <label htmlFor='aadhar_number'>Pan Number:</label>
                </div>
                <br />
                Pan card file
                <div className='form-group'>
                  <label htmlFor='pan_card'>Pan File:</label>
                </div>
                <br />
                Documents
                <div className='form-group'>
                  <label htmlFor='aadhar_number'>Documents:</label>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      )}
    </>
  )
}
export default EmployeeDetails
