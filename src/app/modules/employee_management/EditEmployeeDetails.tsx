import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import axios from 'axios'
import {useLocation} from 'react-router-dom'
const API_URL = process.env.REACT_APP_API_URL
export const GET_USER_UPDATE_DETAILS = `${API_URL}/agent/account/update-agents`
export const GET_USER_DETAILS = `${API_URL}/agent/account/get-agent-details`
export const GET_ALL_DEPARTMENTS = `${API_URL}/agent/fields/department/get-department`
export const GET_ALL_DESIGNATIONS = `${API_URL}/agent/fields/designation/get-designation`
export const GET_ALL_ACCESS_GROUPS = `${API_URL}/permission/access-group/get-group`
const profileDetailsSchema = Yup.object().shape({
  //personal information
  first_name: Yup.string().required('First Name is required'),
  last_name: Yup.string().required('Last Name is required'),
  email: Yup.string().required('Email is required'),
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
  const [data, setData] = useState<any>(null)
  const [dept, setDepartments] = useState<any>([])
  const [designations, setDesignation] = useState<any>([])
  const [accessGroup, setAccessGroup] = useState<any>([])

  //load details of a single employee
  useEffect(() => {
    ;(async () => {
      const id = location.state
      await load_details(id)
      await load_departments()
      await load_designations()
      await access_groups()
    })()
  }, [location.state])
  async function load_details(id: any) {
    const varToken = localStorage.getItem('token')
    //setLoading(true)
    try {
      const result = await axios.post(
        GET_USER_DETAILS,
        {
          appUserId: id,
        },
        {
          headers: {
            Authorization: 'Bearer ' + varToken,
          },
        }
      )
      console.log(result.data.data)
      setData(result.data.data)
      if (result.data.error === false) {
      }
    } catch (err) {
      console.log(err)
    }
    //setLoading(false)
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

  const initialValues = {
    //profile information
    first_name: data && data.user_details.first_name ? data.user_details.first_name : '',
    last_name: data && data.user_details.last_name ? data.user_details.last_name : '',
    email: data && data.user_details.email ? data.user_details.email : '',
    employee_type: data && data.user_details.employee_type ? data.user_details.employee_type : '',
    // appReportingManagerId:
    //  data && data.user_details.appReportingManagerId
    //    ? data.user_details.appReportingManagerId
    //   : '',
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
      data && data.company_details.date_of_birth ? data.company_details.date_of_birth : '',
    date_of_joining:
      data && data.company_details.date_of_joining ? data.company_details.date_of_joining : '',
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
    country: data && data.address_details.country ? data.address_details.country : '',
    state: data && data.address_details.state ? data.address_details.state : '',
    city: data && data.address_details.city ? data.address_details.city : '',
    address: data && data.address_details.address ? data.address_details.address : '',
    landmark: data && data.address_details.landmark ? data.address_details.landmark : '',
    pincode: data && data.address_details.pincode ? data.address_details.pincode : '',
    //contact information
    number: data && data.contact_details.number ? data.contact_details.number : '',
    relation: data && data.contact_details.relation ? data.contact_details.relation : '',
  }

  const formik: any = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: profileDetailsSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      console.log(values)
      const url = GET_USER_UPDATE_DETAILS
      const varToken = localStorage.getItem('token')
      try {
        const id = location.state
        const res = await axios.patch(
          url,
          {
            appUserId: id,
            //personal information
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            employee_type: values.employee_type,
            //appReportingManagerId: values.appReportingManagerId,
            appDepartmentId: values.appDepartmentId,
            appDesignationId: values.appDesignationId,
            appAccessGroupId: values.appAccessGroupId,
            //company information
            company_email: values.company_email,
            primary_email: values.primary_email,
            gender: values.gender,
            contact_number: values.contact_number,
            date_of_birth: values.date_of_birth,
            date_of_joining: values.date_of_joining,
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
              Authorization: 'Bearer ' + varToken,
            },
          }
        )
        console.log(res)
        alert('Details updated successfully')
        setSubmitting(false)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setSubmitting(false)
        setLoading(false)
      }
    },
  })
  return (
    <div className='card mb-5 mb-xl-10'>
      <div id='kt_account_profile_details'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          {/* {heading1-edit profile details} */}
          <div className='card-header border-0 cursor-pointer'>
            <div className='card-title m-0'>
              <h3 className='fw-bolder m-0'>Edit Profile Details</h3>
            </div>
          </div>
          <div className='card-body border-top p-9'>
            {/* {First Name} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>First Name</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
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
                </div>
              </div>
            </div>
            {/* {Last Name} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Last Name</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
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
              </div>
            </div>
            {/* {Email} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Email</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
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
            {/* {Employee Type} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Employee Type</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <select
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
                </div>
              </div>
            </div>
            {/* {Department} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Department</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <select
                      className='form-select form-select-lg form-select-solid'
                      {...formik.getFieldProps('appDepartmentId')}
                    >
                      <option value={formik.getFieldProps('appDepartmentId')}>
                        Select Department
                      </option>
                      {dept.map((dep: any) => (
                        <option key={dep.AppDepartmentId} value={dep.AppDepartmentId}>
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
              </div>
            </div>
            {/* {Reporting Manager} */}
            {/* <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                Reporting Manager
              </label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>{'Hrutika '}</div>
                </div>
              </div>
            </div> */}
            {/* {Designation} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Designation</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <select
                      className='form-select form-select-lg form-select-solid'
                      {...formik.getFieldProps('appDesignationId')}
                    >
                      <option value={formik.getFieldProps('appDesignationId')}>
                        Select Designation
                      </option>
                      {designations.map((designation: any) => (
                        <option
                          key={designation.AppDesignationId}
                          value={designation.AppDesignationId}
                        >
                          {designation.name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.appDesignationId && formik.errors.appDesignationId && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.appDesignationId}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* {Access Groups} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Access Groups</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <select
                      className='form-select form-select-lg form-select-solid'
                      {...formik.getFieldProps('appAccessGroupId')}
                    >
                      <option value={formik.getFieldProps('appAccessGroupId')}>
                        Select Access Groups
                      </option>
                      {accessGroup.map((agroup: any) => (
                        <option key={agroup.appAccessGroupId} value={agroup.appAccessGroupId}>
                          {agroup.name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.appAccessGroupId && formik.errors.appAccessGroupId && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.appAccessGroupId}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* {heading2-edit work details} */}
          <div
            className='card-header border-0 cursor-pointer'
            role='button'
            data-bs-toggle='collapse'
            data-bs-target='#kt_account_profile_details'
            aria-expanded='true'
            aria-controls='kt_account_profile_details'
          >
            <div className='card-title m-0'>
              <h3 className='fw-bolder m-0'>Edit Work Information</h3>
            </div>
          </div>
          <div className='card-body border-top p-9'>
            {/* {Commpany Email} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Company Email</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      {...formik.getFieldProps('company_email')}
                    />
                    {formik.touched.company_email && formik.errors.company_email && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.company_email}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* {Primary Email} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Primary Email</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      {...formik.getFieldProps('primary_email')}
                    />
                    {formik.touched.primary_email && formik.errors.primary_email && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.primary_email}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* { Gender} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Gender</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <select
                      className='form-select form-select-lg form-select-solid'
                      {...formik.getFieldProps('gender')}
                    >
                      <option>Select Genderr</option>
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
              </div>
            </div>
            {/* {Contact Number} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                Contact Number
              </label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      {...formik.getFieldProps('contact_number')}
                    />
                    {formik.touched.contact_number && formik.errors.contact_number && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.contact_number}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* {Date of Birth} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Date of Birth</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      {...formik.getFieldProps('date_of_birth')}
                    />
                    {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.date_of_birth}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* {Date of Joining} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                Date of Joining
              </label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      {...formik.getFieldProps('date_of_joining')}
                    />
                    {formik.touched.date_of_joining && formik.errors.date_of_joining && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.date_of_joining}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* {Working Hours} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Working Hours</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <select
                      className='form-select form-select-lg form-select-solid'
                      {...formik.getFieldProps('working_hours')}
                    >
                      <option value={formik.getFieldProps('working_hours')}>
                        Select Working Hours
                      </option>
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
                </div>
              </div>
            </div>
            {/* { Salary} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Salary</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      {...formik.getFieldProps('salary')}
                    />
                    {formik.touched.salary && formik.errors.salary && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.salary}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* {Marital status} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                Marital Status
              </label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <select
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
            </div>
          </div>
          {/* {heading3-edit bank details} */}
          <div className='card-header border-0 cursor-pointer' role='button'>
            <div className='card-title m-0'>
              <h3 className='fw-bolder m-0'>Edit Bank Information</h3>
            </div>
          </div>
          <div className='card-body border-top p-9'>
            {/* {Account Number} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                Account Number
              </label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
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
                </div>
              </div>
            </div>
            {/* {Name as per bank} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                Name as per bank
              </label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
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
                </div>
              </div>
            </div>
            {/* {Bank Name} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Bank Name</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
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
                </div>
              </div>
            </div>
            {/* {IFSC Code} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>IFSC Code</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
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
            </div>
          </div>

          {/* {heading4-edit emergency contact information} */}
          <div className='card-header border-0 cursor-pointer' role='button'>
            <div className='card-title m-0'>
              <h3 className='fw-bolder m-0'>Edit Emergency Contact Information</h3>
            </div>
          </div>
          <div className='card-body border-top p-9'>
            {/* {Contact number} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                Contact Number
              </label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
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
                </div>
              </div>
            </div>
            {/* {Contact Relation} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Relation</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <select
                      className='form-select form-select-lg form-select-solid'
                      {...formik.getFieldProps('relation')}
                    >
                      <option>Select Relation</option>
                      <option>Father</option>
                      <option>Mother</option>
                      <option>Sibling</option>
                      <option>Friend</option>
                      <option>Other</option>
                    </select>
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
          {/* {heading5-edit address information} */}
          <div className='card-header border-0 cursor-pointer' role='button'>
            <div className='card-title m-0'>
              <h3 className='fw-bolder m-0'>Edit Address Information</h3>
            </div>
          </div>
          <div className='card-body border-top p-9'>
            {/* {Country} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Country</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      {...formik.getFieldProps('country')}
                    />
                    {formik.touched.country && formik.errors.country && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.country}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* {State} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>State</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      {...formik.getFieldProps('state')}
                    />
                    {formik.touched.state && formik.errors.state && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.state}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* {City} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>City</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      {...formik.getFieldProps('city')}
                    />
                    {formik.touched.city && formik.errors.city && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.city}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* {Address} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Address</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      {...formik.getFieldProps('address')}
                    />
                    {formik.touched.naddressame && formik.errors.address && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.address}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* {Landmark} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Landmark</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
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
                </div>
              </div>
            </div>
            {/* {Pincode} */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Pincode</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
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
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn-primary'>
              {!loading && 'Save Changes'}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditEmployeeDetails
