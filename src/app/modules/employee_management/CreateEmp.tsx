import React, {useEffect, useState} from 'react'
import {useFormik} from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
// import ReactDatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'
import dayjs, {Dayjs} from 'dayjs'
import {DemoContainer} from '@mui/x-date-pickers/internals/demo'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
const API_URL = process.env.REACT_APP_API_URL
export const CREATE_USER = `${API_URL}/agent/account/createAppAccount`
export const GET_ALL_DEPARTMENTS = `${API_URL}/agent/fields/department/getAppDepartment`
export const GET_ALL_DESIGNATIONS = `${API_URL}/agent/fields/designation/getAppDesignation`
export const GET_ALL_ACCESS_GROUPS = `${API_URL}/permission/access-group/get-group`
export const GET_ALL_MANAGERS = `${API_URL}/agent/fields/reporting_manager/getAppReportingManager`
const ProfileCard = () => {
  const profileDetailsSchema = Yup.object().shape({
    profile_picture: Yup.mixed().test('fileType', 'Only JPG or PNG files are allowed', (value) => {
      if (!value) return true
      const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg']
      const fileType = value.type
      return supportedFormats.includes(fileType)
    }),
    //personal information
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
    employee_type: Yup.string().required('Employee Type is required'),
    //appReportingManagerId: Yup.string().required('Reporting Manager is required'),
    appDepartmentId: Yup.string().required('Department is required'),
    appDesignationId: Yup.string().required('Designation is required'),
    appAccessGroupId: Yup.string().required('Access Groups is required'),
    //work information
    company_email: Yup.string().required('Company Email is required'),
    primary_email: Yup.string().required('Primary Email is required'),
    gender: Yup.string().required('Gender is required'),
    contact_number: Yup.string().required('Contact Number is required'),
    date_of_birth: Yup.string().required('Date of Birth is required'),
    date_of_joining: Yup.string().required('Date of Joining is required'),
    working_hours: Yup.string().required('Working Hours is required'),
    salary: Yup.string().required('Salary is required'),
    marital_status: Yup.string().required('Marital Status is required'),
    //bank information
    account_number: Yup.string().required('Account Number is required'),
    name_as_per_bank: Yup.string().required('Name as per bank is required'),
    bank_name: Yup.string().required('Bank Name is required'),
    ifsc_code: Yup.string().required('IFSC Code is required'),
    //contact information
    number: Yup.string().required('Number is required'),
    relation: Yup.string().required('Relation is required'),
    //address information
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    address: Yup.string().required('Address is required'),
    landmark: Yup.string().required('Landmark is required'),
    pincode: Yup.string().required('Pincode is required'),
  })
  useEffect(() => {
    ;(async () => {
      await load_departments()
      await load_designations()
      await access_groups()
      await load_reporting_managers()
    })()
  }, [])
  const [loading, setLoading] = useState(false)
  const [dept, setDepartments] = useState<any>([])
  const [designations, setDesignation] = useState<any>([])
  const [accessGroup, setAccessGroup] = useState<any>([])
  const [managers, setManagers] = useState<any>([])
  const [date, setDate] = useState<Dayjs | null>(dayjs('2022-04-17'))
  const initialValues = {
    //profile information
    profile_picture: [],
    first_name: '',
    last_name: '',
    email: '',
    employee_type: '',
    //appReportingManagerId:'',
    appDepartmentId: '',
    appDesignationId: '',
    appAccessGroupId: '',
    reportingManagerId: '',
    //work information
    company_email: '',
    primary_email: '',
    gender: '',
    contact_number: '',
    date_of_birth: '',
    date_of_joining: '',
    working_hours: '',
    salary: '',
    marital_status: '',
    //bank information
    account_number: '',
    name_as_per_bank: '',
    bank_name: '',
    ifsc_code: '',
    //address information
    country: '',
    state: '',
    city: '',
    address: '',
    landmark: '',
    pincode: '',
    //contact information
    number: '',
    relation: '',
    //file information
    aadhar_number: '',
    pan_number: '',
    aadhar_card: [],
    pan_card: [],
    documents: [],
  }
  //get the total number of reporting managers in the company
  async function load_reporting_managers() {
    const varToken = localStorage.getItem('token')
    try {
      const result = await axios.post(
        GET_ALL_MANAGERS,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + varToken,
          },
        }
      )
      setManagers(result.data.data.AppReportingManager)
    } catch (err) {
      console.log(err)
    }
  }
  //get the total number of departments from the company
  async function load_departments() {
    const varToken = localStorage.getItem('token')
    try {
      const result = await axios.post(
        GET_ALL_DEPARTMENTS,
        {
          search: '',
        },
        {
          headers: {
            Authorization: 'Bearer ' + varToken,
          },
        }
      )
      setDepartments(result.data.data.AppDepartment)
      if (result.data.error === false) {
      }
    } catch (err) {
      console.log(err)
    }
  }
  //load the total designaiton in the company
  async function load_designations() {
    const varToken = localStorage.getItem('token')
    try {
      const result = await axios.post(
        GET_ALL_DESIGNATIONS,
        {
          search: '',
        },
        {
          headers: {
            Authorization: 'Bearer ' + varToken,
          },
        }
      )
      setDesignation(result.data.data.AppDesignation)
      if (result.data.error === false) {
      }
    } catch (err) {
      console.log(err)
    }
  }
  //load the total access groups in the company
  async function access_groups() {
    const varToken = localStorage.getItem('token')
    try {
      const result = await axios.post(
        GET_ALL_ACCESS_GROUPS,
        {
          appAccessGroupId: null,
          search: null,
          metaData: {
            sortBy: null,
            sortOn: null,
            limit: 0,
            offset: 0,
            fields: [],
          },
        },
        {
          headers: {
            Authorization: 'Bearer ' + varToken,
          },
        }
      )
      setAccessGroup(result.data.data.appAccessGroups)
      if (result.data.error === false) {
      }
    } catch (err) {
      console.log(err)
    }
  }
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      // Handle form submission logic here
      console.log(values)
    },
  })
  function handleModalOpen() {
    console.log(true)
  }
  return (
    <form onSubmit={formik.handleSubmit}>
      {/* {Profile Section} */}
      <div className='card shadow' style={{width: '100%', margin: '0 auto'}}>
        <div className='card-body' style={{display: 'flex'}}>
          <div style={{flex: '1'}}>
            <h1 style={{color: 'darkorange'}} className='card-title'>
              Profile Section
            </h1>
            <div className='form-group'>
              <label htmlFor='profilePicture'>Profile Picture:</label>
              <input
                style={{marginTop: '10px', width: '60%'}}
                type='file'
                accept='.jpg,.png,.jpeg'
                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                onChange={(event) => {
                  formik.setFieldValue('profile_picture', event.target.files)
                }}
              />
              <p style={{color: 'red', textAlign: 'left'}}>
                (upload only in jpg, png, jpeg format)
              </p>
              {formik.touched.profile_picture && formik.errors.profile_picture && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>{formik.errors.profile_picture}</div>
                </div>
              )}
            </div>
          </div>

          <div style={{flex: '1'}}>
            <div className='form-group'>
              <label htmlFor='firstName'>First Name:</label>
              <input
                type='text'
                style={{margin: '10px', width: '60%'}}
                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                // {...formik.getFieldProps('first_name')}
                onChange={formik.handleChange}
              />
              {formik.touched.first_name && formik.errors.first_name && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>{formik.errors.first_name}</div>
                </div>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='lastName'>Last Name:</label>
              <input
                type='text'
                style={{margin: '10px', width: '60%'}}
                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                // {...formik.getFieldProps('first_name')}
                onChange={formik.handleChange}
              />
              {formik.touched.last_name && formik.errors.last_name && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>{formik.errors.last_name}</div>
                </div>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='email'>Email:</label>
              <input
                type='text'
                style={{margin: '10px', width: '60%'}}
                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                // {...formik.getFieldProps('first_name')}
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>{formik.errors.email}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-around', width: '100%'}}>
        {/* {Basic Details} */}
        <div
          className='card shadow'
          style={{
            width: '48%',
            alignContent: 'left',
            marginTop: '20px',
            padding: '20px',
            height: '50%',
          }}
        >
          <div className='card-body'>
            <div>
              <h1 style={{color: 'darkorange'}} className='card-title'>
                Basic Details
              </h1>
              <br />

              <div className='form-group'>
                <label htmlFor='gender'>Gender</label>
                <select
                  style={{margin: '10px', width: '80%', marginBottom: '10px'}}
                  className='form-select form-select-lg form-select-solid'
                  {...formik.getFieldProps('gender')}
                >
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Others</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.gender}</div>
                  </div>
                )}
              </div>
            </div>
            <br />
            <div className='form-group'>
              <label htmlFor='contact_number'>Contact Number</label>
              <input
                type='text'
                style={{margin: '10px', width: '80%'}}
                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                {...formik.getFieldProps('contact_number')}
                onChange={formik.handleChange}
              />
              {formik.touched.contact_number && formik.errors.contact_number && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>{formik.errors.contact_number}</div>
                </div>
              )}
            </div>
            <br />
            <div className='form-group'>
              <label htmlFor='date_of_birth'>Date of Birth:</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker value={date} onChange={(newValue) => setDate(newValue)} />
                </DemoContainer>
              </LocalizationProvider>
              {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>{formik.errors.date_of_birth}</div>
                </div>
              )}
            </div>
            <br />
            <div className='form-group'>
              <label htmlFor='marital_status'>Marital Status</label>
              <select
                style={{margin: '10px', width: '80%'}}
                className='form-select form-select-lg form-select-solid'
                {...formik.getFieldProps('marital_status')}
              >
                <option>Select Marital Status</option>
                <option>Single</option>
                <option>Married</option>
                <option>Seperated</option>
                <option>Divorced</option>
                <option>Widowed</option>
                <option>Other</option>
              </select>
              {formik.touched.marital_status && formik.errors.marital_status && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>{formik.errors.marital_status}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* {Work Details} */}
        <div
          className='card shadow'
          style={{
            width: '48%',
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
                <label htmlFor='contact_number'>Primary Email:</label>
                <input
                  type='text'
                  style={{margin: '10px', width: '80%'}}
                  className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  {...formik.getFieldProps('primary_email')}
                  onChange={formik.handleChange}
                />
                {formik.touched.primary_email && formik.errors.primary_email && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.primary_email}</div>
                  </div>
                )}
              </div>
              <br />
              {/* company email */}
              <div className='form-group'>
                <label htmlFor='contact_number'>Company Email:</label>
                <input
                  type='text'
                  style={{margin: '10px', width: '80%'}}
                  className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  {...formik.getFieldProps('company_email')}
                  onChange={formik.handleChange}
                />
                {formik.touched.company_email && formik.errors.company_email && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.company_email}</div>
                  </div>
                )}
              </div>
              <br />
              {/* salary */}
              <div className='form-group'>
                <label htmlFor='contact_number'>Salary:</label>
                <input
                  type='text'
                  style={{margin: '10px', width: '80%'}}
                  className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                  {...formik.getFieldProps('salary')}
                  onChange={formik.handleChange}
                />
                {formik.touched.salary && formik.errors.salary && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.salary}</div>
                  </div>
                )}
              </div>
              <br />
              {/* date of joining */}
              <div className='form-group'>
                <label htmlFor='date_of_birth'>Date of Joining:</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker value={date} onChange={(newValue) => setDate(newValue)} />
                  </DemoContainer>
                </LocalizationProvider>
                {formik.touched.date_of_joining && formik.errors.date_of_joining && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.date_of_joining}</div>
                  </div>
                )}
              </div>
              <br />
              {/* employee type */}
              <div className='form-group'>
                <label htmlFor='gender'>Employee Type</label>
                <select
                  style={{margin: '10px', width: '80%'}}
                  className='form-select form-select-lg form-select-solid'
                  {...formik.getFieldProps('employee_type')}
                >
                  <option>Select Employee Type</option>
                  <option>Permanent</option>
                  <option>Internship</option>
                  <option>Part-time</option>
                  <option>Freelancer</option>
                </select>
                {formik.touched.employee_type && formik.errors.employee_type && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.employee_type}</div>
                  </div>
                )}
              </div>
              <br />
              {/* working hours */}
              <div className='form-group'>
                <label htmlFor='gender'>Working Hours</label>
                <select
                  style={{margin: '10px', width: '80%'}}
                  className='form-select form-select-lg form-select-solid'
                  {...formik.getFieldProps('working_hours')}
                >
                  <option value=''>Select Working Hours</option>
                  <option>4-5 hrs</option>
                  <option>5-6 hrs</option>
                  <option>6-7 hrs</option>
                  <option>8-9 hrs</option>
                </select>
                {formik.touched.working_hours && formik.errors.working_hours && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.working_hours}</div>
                  </div>
                )}
              </div>
              <br />
              {/* department */}
              <div className='form-group'>
                <label htmlFor='department'>Department:</label>
                <div style={{display: 'flex'}}>
                  <select
                    style={{margin: '10px', width: '80%'}}
                    className='form-select form-select-lg form-select-solid'
                    {...formik.getFieldProps('appDepartmentId')}
                  >
                    <option value=''>Select Department</option>
                    {dept.map((dep: any) => (
                      <option key={dep.AppDepartmentId} value={dep.AppDepartmentId}>
                        {dep.name}
                      </option>
                    ))}
                  </select>

                  <button
                    style={{background: 'transparent', border: 'none'}}
                    type='button'
                    onClick={handleModalOpen}
                  >
                    <i className='fas fa-plus'></i>
                  </button>
                </div>
                {formik.touched.appDepartmentId && formik.errors.appDepartmentId && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.appDepartmentId}</div>
                  </div>
                )}
              </div>
              {/* designation */}
              <div className='form-group'>
                <label htmlFor='designatioin'>Designaiton:</label>
                <div style={{display: 'flex'}}>
                  <select
                    style={{margin: '10px', width: '80%'}}
                    className='form-select form-select-lg form-select-solid'
                    {...formik.getFieldProps('appDesignationId')}
                  >
                    <option value=''>Select Designation</option>
                    {designations.map((designation: any) => (
                      <option
                        key={designation.AppDesignationId}
                        value={designation.AppDesignationId}
                      >
                        {designation.name}
                      </option>
                    ))}
                  </select>

                  <button
                    style={{background: 'transparent', border: 'none'}}
                    type='button'
                    onClick={handleModalOpen}
                  >
                    <i className='fas fa-plus'></i>
                  </button>
                </div>
                {formik.touched.appDesignationId && formik.errors.appDesignationId && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.appDesignationId}</div>
                  </div>
                )}
              </div>
              {/* access group */}
              <div className='form-group'>
                <label htmlFor='accessGroup'>Access Group:</label>
                <div style={{display: 'flex'}}>
                  <select
                    style={{margin: '10px', width: '80%'}}
                    className='form-select form-select-lg form-select-solid'
                    {...formik.getFieldProps('appAccessGroupId')}
                  >
                    <option value=''>Select Access Groups</option>
                    {accessGroup.map((agroup: any) => (
                      <option key={agroup.appAccessGroupId} value={agroup.appAccessGroupId}>
                        {agroup.name}
                      </option>
                    ))}
                  </select>
                  <button
                    style={{background: 'transparent', border: 'none'}}
                    type='button'
                    onClick={handleModalOpen}
                  >
                    <i className='fas fa-plus'></i>
                  </button>
                </div>
                {formik.touched.appAccessGroupId && formik.errors.appAccessGroupId && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.appAccessGroupId}</div>
                  </div>
                )}
              </div>
              {/* reporting managers */}
              <div className='form-group'>
                <label htmlFor='accessGroup'>Reporting Managers:</label>
                <div style={{display: 'flex'}}>
                  <select
                    style={{margin: '10px', width: '80%'}}
                    className='form-select form-select-lg form-select-solid'
                    {...formik.getFieldProps('reportingManagerId')}
                  >
                    <option value=''>Select Reporting Manager</option>
                    {managers.map((manager: any) => (
                      <option key={manager.ReportingManagerId} value={manager.ReportingManagerId}>
                        {manager.appUserId.email}
                      </option>
                    ))}
                  </select>
                  {formik.touched.reportingManagerId && formik.errors.reportingManagerId && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.reportingManagerId}</div>
                    </div>
                  )}
                  <button
                    style={{background: 'transparent', border: 'none'}}
                    type='button'
                    onClick={handleModalOpen}
                  >
                    <i className='fas fa-plus'></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default ProfileCard
