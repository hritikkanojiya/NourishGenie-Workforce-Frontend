import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useLocation} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import dayjs from 'dayjs'
import api from '../RequestConfig'
const permissionsBreadCrumbs: Array<PageLink> = [
  {
    title: 'employee_management',
    path: '/crafted/employee_management',
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
export const GET_USER_UPDATE_DETAILS = `${API_URL}/agent/account/update-agent`
export const GET_USER_DETAILS = `${API_URL}/agent/account/get-agent-details`
export const GET_ALL_DEPARTMENTS = `${API_URL}/agent/fields/department/get-department`
export const GET_ALL_DESIGNATIONS = `${API_URL}/agent/fields/designation/get-designation`
export const GET_ALL_ACCESS_GROUPS = `${API_URL}/permission/access-group/get-group`
export const GET_ALL_MANAGERS = `${API_URL}/agent/fields/reporting_manager/get-manager`
export const LOAD_COUNTRIES = `${API_URL}/countries-states-cities/get-countries`
export const LOAD_STATE = `${API_URL}/countries-states-cities/get-states`
export const LOAD_CITY = `${API_URL}/countries-states-cities/get-cities`

const profileDetailsSchema = Yup.object().shape({
  //personal information
  first_name: Yup.string().required('First Name is required'),
  last_name: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  employee_type: Yup.string().required('Employee Type is required'),
  appReportingManagerId: Yup.string(),
  appDepartmentId: Yup.string().required('Department is required'),
  appDesignationId: Yup.string().required('Designation is required'),
  appAccessGroupId: Yup.string().required('Access Groups is required'),
  //work information
  company_email: Yup.string().email('Invalid email address').required('Company Email is required'),
  primary_email: Yup.string().email('Invalid email address').required('Primary Email is required'),
  gender: Yup.string().required('Gender is required'),
  contact_number: Yup.string()
    .required('Contact Number is required')
    .matches(/^[0-9]{10}$/, 'Invalid phone number'),
  date_of_birth: Yup.date()
    .nullable()
    .test('age', 'Age must be greater than 10', (value) => {
      if (value) {
        const today = new Date()
        const birthDate = new Date(value)
        const age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1 > 10
        }

        return age > 10
      }

      return true
    }),
  date_of_joining: Yup.date().required('Date of Joining is required'),
  working_hours: Yup.string().required('Working Hours is required'),
  salary: Yup.string().required('Salary is required'),
  marital_status: Yup.string().required('Marital Status is required'),
  //bank information
  account_number: Yup.string().required('Account Number is required'),
  name_as_per_bank: Yup.string().required('Name as per bank is required'),
  bank_name: Yup.string().required('Bank Name is required'),
  ifsc_code: Yup.string().required('IFSC Code is required'),
  //contact information
  number: Yup.string()
    .required('Contact Number is required')
    .matches(/^[0-9]{10}$/, 'Invalid phone number'),
  relation: Yup.string().required('Relation is required'),
  //address information
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  address: Yup.string().required('Address is required'),
  landmark: Yup.string().required('Landmark is required'),
  pincode: Yup.string().required('Pincode is required'),
})

const EditEmployeeDetails: React.FC = () => {
  const location: any = useLocation()
  const [loading, setLoading] = useState(false)
  const [uploadDetailsSuccessful, setUploadDetailsSuccessful] = useState('')
  const [uploadDetailsError, setUploadDetailsError] = useState('')
  const [data, setData] = useState<any>(null)
  const [dept, setDepartments] = useState<any>([])
  const [designations, setDesignation] = useState<any>([])
  const [accessGroup, setAccessGroup] = useState<any>([])
  const [managers, setManagers] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const [countries, setCountries] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  //load details of a single employee
  useEffect(() => {
    ;(async () => {
      const id = location.state
      await load_details(id)
      await load_departments()
      await load_designations()
      await access_groups()
      await load_managers()
    })()
  }, [location.state])
  async function load_details(id: any) {
    setIsLoading(true)
    const varToken = localStorage.getItem('token')
    //setLoading(true)
    try {
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
      setData(result.data.data)
      load_states(result.data.data.address_details.country.countryShortId)
      load_cities(result.data.data.address_details.state.stateShortId)
      if (result.data.error === false) {
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }

    //setLoading(false)
  }
  //get the total number of departments from the company
  async function load_departments() {
    setLoading(true)
    const varToken = localStorage.getItem('token')
    try {
      const result = await api.post(
        GET_ALL_DEPARTMENTS,
        {
          appDepartmentId: null,
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
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      console.log(result.data.data.AppDepartment)
      setDepartments(result.data.data.AppDepartment)
      if (result.data.error === false) {
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  //load the total designaiton in the company
  async function load_designations() {
    setLoading(true)
    const varToken = localStorage.getItem('token')
    try {
      const result = await api.post(
        GET_ALL_DESIGNATIONS,
        {
          search: null,
        },
        {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      setDesignation(result.data.data.appDesignations)
      if (result.data.error === false) {
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  //load the total access groups in the company
  async function access_groups() {
    setLoading(true)
    const varToken = localStorage.getItem('token')
    try {
      const result = await api.post(
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
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      setAccessGroup(result.data.data.appAccessGroups)
      if (result.data.error === false) {
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  async function load_managers() {
    setLoading(true)
    const varToken = localStorage.getItem('token')
    try {
      const result = await api.post(
        GET_ALL_MANAGERS,
        {
          appManagerId: null,
          appAgentId: null,
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
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      console.log(result.data.data)
      setManagers(result.data.data.appReportingManager)
      if (result.data.error === false) {
        console.log(result.data.data.appReportingManager)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const initialValues = {
    //profile information
    first_name: data && data.user_details.first_name ? data.user_details.first_name : '',
    last_name: data && data.user_details.last_name ? data.user_details.last_name : '',
    email: data && data.user_details.email ? data.user_details.email : '',
    employee_type: data && data.user_details.employee_type ? data.user_details.employee_type : '',
    appReportingManagerId:
      data && data.user_details.appReportingManagerId
        ? data.user_details.appReportingManagerId._id
        : '',
    appDepartmentId:
      data && data.user_details.appDepartmentId._id ? data.user_details.appDepartmentId._id : '',
    appDesignationId:
      data && data.user_details.appDesignationId._id ? data.user_details.appDesignationId._id : '',
    appAccessGroupId:
      data && data.user_details.appAccessGroupId._id ? data.user_details.appAccessGroupId._id : '',
    //work information
    company_email:
      data && data.company_details.company_email ? data.company_details.company_email : '',
    primary_email:
      data && data.company_details.primary_email ? data.company_details.primary_email : '',
    gender: data && data.company_details.gender ? data.company_details.gender : '',
    contact_number:
      data && data.company_details.contact_number ? data.company_details.contact_number : '',
    date_of_birth:
      data && data.company_details.date_of_birth
        ? dayjs(new Date(data.company_details.date_of_birth))
        : dayjs('2022-04-17'),
    date_of_joining:
      data && data.company_details.date_of_joining
        ? dayjs(new Date(data.company_details.date_of_joining))
        : dayjs('2022-04-17'),
    working_hours:
      data && data.company_details.working_hours ? data.company_details.working_hours : '',
    salary: data && data.company_details.salary ? data.company_details.salary : '',
    marital_status:
      data && data.company_details.marital_status ? data.company_details.marital_status : '',
    //bank information
    account_number:
      data && data.bank_details.account_number ? data.bank_details.account_number : '',
    name_as_per_bank:
      data && data.bank_details.name_as_per_bank ? data.bank_details.name_as_per_bank : '',
    bank_name: data && data.bank_details.bank_name ? data.bank_details.bank_name : '',
    ifsc_code: data && data.bank_details.ifsc_code ? data.bank_details.ifsc_code : '',
    //address information
    country: data && data.address_details.country ? data.address_details.country._id : '',
    state: data && data.address_details.state ? data.address_details.state._id : '',
    city: data && data.address_details.city ? data.address_details.city._id : '',
    address: data && data.address_details.address ? data.address_details.address : '',
    landmark: data && data.address_details.landmark ? data.address_details.landmark : '',
    pincode: data && data.address_details.pincode ? data.address_details.pincode : '',
    //contact information
    number: data && data.contact_details.number ? data.contact_details.number : '',
    relation: data && data.contact_details.relation ? data.contact_details.relation : '',
  }

  function formatDate(date: any) {
    console.log(date)
    const d = new Date(date['$d'])
    // const day = d.getDate()
    // const month = d.getMonth() + 1
    // const year = d.getFullYear()
    // const formattedDate = `${year}-${month}-${day}`
    return d.toISOString()
  }

  useEffect(() => {
    ;(async () => {
      const varToken = localStorage.getItem('token')
      try {
        const result = await api.get(LOAD_COUNTRIES, {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        })
        console.log(result.data.data)
        setCountries(result.data.data.counrties)
        if (result.data.data.length !== 0) {
          console.log('countries fetched yay')
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  async function load_states(country_id: any) {
    console.log(country_id)
    if (country_id) {
      console.log(country_id)
      const varToken = localStorage.getItem('token')
      try {
        const result = await api.post(
          LOAD_STATE,
          {
            country_id: country_id,
          },
          {
            headers: {
              genie_access_token: 'Bearer ' + varToken,
            },
          }
        )
        console.log(result.data.data)
        setStates(result.data.data.states)
        if (result.data.data.length !== 0) {
          console.log('states fetched yay')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  async function load_cities(state_id: any) {
    if (state_id) {
      const varToken = localStorage.getItem('token')
      try {
        const result = await api.post(
          LOAD_CITY,
          {
            state_id: state_id,
          },
          {
            headers: {
              genie_access_token: 'Bearer ' + varToken,
            },
          }
        )
        console.log(result.data.data)
        setCities(result.data.data.cities)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const formik: any = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: profileDetailsSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setIsLoading(true)
      setLoading(true)
      setUploadDetailsError('')
      setUploadDetailsSuccessful('')
      console.log(values)
      const url = GET_USER_UPDATE_DETAILS
      const varToken = localStorage.getItem('token')
      try {
        const id = location.state
        const res = await api.put(
          url,
          {
            appAgentId: id,
            //personal information
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            employee_type: values.employee_type,
            appReportingManagerId: values.appReportingManagerId
              ? values.appReportingManagerId
              : null,
            appDepartmentId: values.appDepartmentId,
            appDesignationId: values.appDesignationId,
            appAccessGroupId: values.appAccessGroupId,
            //company information
            company_email: values.company_email,
            primary_email: values.primary_email,
            gender: values.gender,
            contact_number: values.contact_number,
            date_of_birth: formatDate(values.date_of_birth),
            date_of_joining: formatDate(values.date_of_joining),
            working_hours: values.working_hours,
            salary: values.salary,
            marital_status: values.marital_status,
            //contact information
            number: values.number,
            relation: values.relation,

            //bank information
            account_number: values.account_number,
            name_as_per_bank: values.name_as_per_bank,
            bank_name: values.bank_name,
            ifsc_code: values.ifsc_code,
            //address information
            country: values.country,
            state: values.state,
            city: values.city,
            address: values.address,
            landmark: values.landmark,
            pincode: values.pincode,
          },
          {
            headers: {
              genie_access_token: 'Bearer ' + varToken,
            },
          }
        )
        console.log(res)
        // alert('Details updated successfully')
        setUploadDetailsSuccessful('Details updated successfully')
        setSubmitting(false)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setUploadDetailsError('The details entered are invalid')
        setSubmitting(false)
        setLoading(false)
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <>
      {uploadDetailsSuccessful && (
        <div className='alert alert-primary d-flex align-items-center p-5 mb-10'>
          <span className='svg-icon svg-icon-2hx svg-icon-primary me-3'>...</span>

          <div className='d-flex flex-column'>
            <h5 className='mb-1'>Success</h5>
            <span>{uploadDetailsSuccessful}</span>
          </div>
        </div>
      )}
      {uploadDetailsError && (
        <div className='alert alert-primary d-flex align-items-center p-5 mb-10'>
          <span className='svg-icon svg-icon-2hx svg-icon-primary me-3'>...</span>

          <div className='d-flex flex-column'>
            <h5 className='mb-1'>Invalid Details</h5>
            <span>{uploadDetailsError}</span>
          </div>
        </div>
      )}
      <div className='card mb-5 mb-xl-10'>
        <PageTitle breadcrumbs={permissionsBreadCrumbs}>View Employee</PageTitle>
        {isLoading ? (
          <div className='d-flex align-items-center justify-content-center loader-container'>
            <Spinner animation='border' variant='primary' />
          </div>
        ) : (
          <div id='kt_account_profile_details'>
            <form onSubmit={formik.handleSubmit}>
              {/* {Profile Section} */}
              <div className='card shadow' style={{width: '100%', margin: '0 auto'}}>
                <div className='card-body'>
                  <div>
                    <h1 style={{color: 'darkorange'}} className='card-title'>
                      Profile Section
                    </h1>
                  </div>

                  <div className='row'>
                    <div className='col'>
                      <div className='form-group'>
                        <label htmlFor='firstName'>First Name:</label>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          {...formik.getFieldProps('first_name')}
                        />
                        {formik.touched.first_name && formik.errors.first_name && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.first_name}</div>
                          </div>
                        )}
                      </div>
                      <br />
                      <div className='form-group'>
                        <label htmlFor='lastName'>Last Name:</label>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          {...formik.getFieldProps('last_name')}
                        />
                        {formik.touched.last_name && formik.errors.last_name && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.last_name}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='col'>
                      <div className='form-group'>
                        <label htmlFor='email'>Email:</label>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          {...formik.getFieldProps('email')}
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
              </div>

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
                        <div>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              value={formik.values.date_of_birth}
                              onChange={(newValue) =>
                                formik.setFieldValue('date_of_birth', newValue)
                              }
                            />
                          </LocalizationProvider>
                          {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                            <div className='fv-plugins-message-container'>
                              <div className='fv-help-block'>{formik.errors.date_of_birth}</div>
                            </div>
                          )}
                        </div>
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
                        <label htmlFor='gender'>Bank Name:</label>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          {...formik.getFieldProps('bank_name')}
                        />
                        {formik.touched.bank_name && formik.errors.bank_name && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.bank_name}</div>
                          </div>
                        )}
                      </div>
                      <br />
                      <div className='form-group'>
                        <label htmlFor='gender'>Account Number:</label>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          {...formik.getFieldProps('account_number')}
                        />
                        {formik.touched.account_number && formik.errors.account_number && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.account_number}</div>
                          </div>
                        )}
                      </div>
                      <div className='form-group'>
                        <label htmlFor='contact_number'>Name as per bank:</label>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          {...formik.getFieldProps('name_as_per_bank')}
                        />
                        {formik.touched.name_as_per_bank && formik.errors.name_as_per_bank && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.name_as_per_bank}</div>
                          </div>
                        )}
                      </div>
                      <br />
                      <div className='form-group'>
                        <label htmlFor='date_of_birth'>IFSC Code:</label>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          {...formik.getFieldProps('ifsc_code')}
                        />
                        {formik.touched.ifsc_code && formik.errors.ifsc_code && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.ifsc_code}</div>
                          </div>
                        )}
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
                        <label htmlFor='gender'>Country:</label>
                        {countries.length !== 0 && (
                          <select
                            style={{margin: '10px', width: '100%'}}
                            className='form-select form-select-lg form-select-solid'
                            value={formik.values.country}
                            onChange={(e) => {
                              console.log('Hello')
                              formik.setFieldValue('country', e.target.value)
                              load_states(
                                e.target.options[e.target.selectedIndex].dataset.countryShortId
                              )
                            }}
                          >
                            <option>Select Country</option>
                            {countries.map((country) => (
                              <option
                                key={country.countryShortId}
                                value={country._id}
                                data-country-short-id={country.countryShortId}
                              >
                                {country.name}
                              </option>
                            ))}
                          </select>
                        )}
                        {formik.touched.country && formik.errors.country && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.country}</div>
                          </div>
                        )}
                      </div>
                      <br />
                      <div className='form-group'>
                        <label htmlFor='gender'>State:</label>
                        <select
                          style={{margin: '10px', width: '100%'}}
                          className='form-select form-select-lg form-select-solid'
                          value={formik.values.state}
                          onChange={(e) => {
                            formik.setFieldValue('state', e.target.value)
                            load_cities(
                              e.target.options[e.target.selectedIndex].dataset.stateShortId
                            )
                          }}
                        >
                          <option>Select State</option>
                          {states.map((state) => (
                            <option
                              value={state._id}
                              key={state.stateShortId}
                              data-state-short-id={state.stateShortId}
                            >
                              {state.name}
                            </option>
                          ))}
                        </select>
                        {formik.touched.state && formik.errors.state && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.state}</div>
                          </div>
                        )}
                      </div>
                      <br />
                      <div className='form-group'>
                        <label htmlFor='contact_number'>City:</label>
                        <select
                          style={{margin: '10px', width: '100%'}}
                          className='form-select form-select-lg form-select-solid'
                          value={formik.values.city}
                          onChange={(e) => {
                            formik.setFieldValue('city', e.target.value)
                          }}
                        >
                          <option>Select City</option>
                          {cities.map((city) => (
                            <option value={city._id} key={city.cityShortId}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                        {formik.touched.city && formik.errors.city && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.city}</div>
                          </div>
                        )}
                      </div>
                      <br />

                      <div className='form-group'>
                        <label htmlFor='date_of_birth'>Address:</label>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          {...formik.getFieldProps('address')}
                        />
                        {formik.touched.address && formik.errors.address && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.address}</div>
                          </div>
                        )}
                      </div>
                      <br />
                      <div className='form-group'>
                        <label htmlFor='contact_number'>Landmark:</label>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          {...formik.getFieldProps('landmark')}
                        />
                        {formik.touched.landmark && formik.errors.landmark && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.landmark}</div>
                          </div>
                        )}
                      </div>
                      <br />
                      <div className='form-group'>
                        <label htmlFor='contact_number'>Pincode:</label>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          {...formik.getFieldProps('pincode')}
                        />
                        {formik.touched.pincode && formik.errors.pincode && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.pincode}</div>
                          </div>
                        )}
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
                          <label htmlFor='date_of_joining'>Date of Joining:</label>
                          <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                value={formik.values.date_of_joining}
                                onChange={(newValue) =>
                                  formik.setFieldValue('date_of_joining', newValue)
                                }
                              />
                            </LocalizationProvider>
                          </div>
                          {formik.touched.date_of_joining && formik.errors.date_of_joining && (
                            <div className='fv-plugins-message-container'>
                              <div className='fv-help-block'>{formik.errors.date_of_joining}</div>
                            </div>
                          )}
                        </div>
                        <br />
                        {/* employee type */}
                        <div className='form-group'>
                          <label htmlFor='employee_type'>Employee Type</label>
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
                                <option key={dep.appDepartmentId} value={dep.appDepartmentId}>
                                  {dep.name}
                                </option>
                              ))}
                            </select>
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
                              {designations.map((dn: any) => (
                                <option key={dn.appDesignationId} value={dn.appDesignationId}>
                                  {dn.name}
                                </option>
                              ))}
                            </select>
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
                                <option
                                  key={agroup.appAccessGroupId}
                                  value={agroup.appAccessGroupId}
                                >
                                  {agroup.name}
                                </option>
                              ))}
                            </select>
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
                              {...formik.getFieldProps('appReportingManagerId')}
                            >
                              <option value=''>Select Reporting Manager</option>
                              {managers.map((manager: any) => (
                                <option key={manager.appManagerId} value={manager.appManagerId}>
                                  {manager.appAgentId.email}
                                </option>
                              ))}
                            </select>
                          </div>
                          {formik.touched.appReportingManagerId &&
                            formik.errors.appReportingManagerId && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                  {formik.errors.appReportingManagerId}
                                </div>
                              </div>
                            )}
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
                        <label htmlFor='gender'>Number:</label>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          {...formik.getFieldProps('number')}
                        />
                        {formik.touched.number && formik.errors.number && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.number}</div>
                          </div>
                        )}
                      </div>
                      <br />
                      <div className='form-group'>
                        <label htmlFor='gender'>Relation:</label>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          {...formik.getFieldProps('relation')}
                        />
                        {formik.touched.relation && formik.errors.relation && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.relation}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button type='submit' className='btn btn-primary'>
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

export default EditEmployeeDetails
