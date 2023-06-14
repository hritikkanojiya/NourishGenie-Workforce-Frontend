import React, {useContext, useEffect} from 'react'
import {useFormik} from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import {DepartmentContext} from '../../../context/DepartmentContext'
const API_URL = process.env.REACT_APP_API_URL
export const GET_ALL_DETAILS = `${API_URL}/agent/fields/department/get-single-department`
export const GET_ALL_DEPARTMENTS = `${API_URL}/agent/fields/department/get-department`
export const UPDATE_DEPARTMENT = `${API_URL}/agent/fields/department/update-department`

const departmentValidationSchema = Yup.object().shape({
  department_name: Yup.string()
    .required('Department Name is required')
    .matches(/^[a-zA-Z\s]+$/, 'Department Name cannot contain numbers'),
  department_description: Yup.string()
    .required('Department Description is required')
    .matches(/^[a-zA-Z\s]+$/, 'Department Description cannot contain numbers'),
})

const EditDepartmentModal = () => {
  const {loadDepartmentFunction} = useContext(DepartmentContext)
  const {editModalFunction} = useContext(DepartmentContext)
  const {departmentId} = useContext(DepartmentContext)
  console.log(departmentId)
  const [data, setData] = React.useState<any>({})
  //load the department details from the backend
  useEffect(() => {
    ;(async () => {
      await load_details()
    })()
  }, [])

  //load all the departments from the backend
  async function load_departments() {
    const varToken = localStorage.getItem('token')
    try {
      const result = await axios.post(
        GET_ALL_DEPARTMENTS,
        {
          search: null,
        },
        {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      loadDepartmentFunction(result.data.data.AppDepartment)
      if (result.data.error === false) {
      }
    } catch (err) {
      console.log(err)
    }
  }
  async function load_details() {
    const varToken = localStorage.getItem('token')
    try {
      const result = await axios.post(
        GET_ALL_DETAILS,
        {
          appDepartmentId: departmentId,
        },
        {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      setData(result.data.data.appDepartment)
      if (result.data.error === false) {
      }
    } catch (err) {
      console.log(err)
    }
  }
  const formik: any = useFormik({
    initialValues: {
      department_name: data && data.name ? data.name : '',
      department_description: data && data.description ? data.description : '',
    },
    enableReinitialize: true,
    validationSchema: departmentValidationSchema,
    onSubmit: async (values) => {
      try {
        const varToken = localStorage.getItem('token')
        const result = await axios.patch(
          UPDATE_DEPARTMENT,
          {
            appDepartmentId: departmentId,
            name: values.department_name,
            description: values.department_description,
          },
          {
            headers: {
              genie_access_token: 'Bearer ' + varToken,
            },
          }
        )
        console.log(result)
        if (result.data.data.error !== false) {
          load_departments()
          editModalFunction(false)
        }
      } catch (error) {
        console.log(error)
      }
    },
  })
  return (
    <div>
      <h6>Edit Department Details</h6>
      <form onSubmit={formik.handleSubmit}>
        <div className='form-group row'>
          <label htmlFor='departmentName' className='col-sm-2 col-form-label'>
            Name
          </label>
          <div className='col-sm-10'>
            <input
              type='text'
              className='form-control form-control-sm'
              placeholder='Department Name'
              {...formik.getFieldProps('department_name')}
            />
            {formik.touched.department_name && formik.errors.department_name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>{formik.errors.department_name}</div>
              </div>
            )}
          </div>
        </div>
        <div className='form-group row'>
          <label htmlFor='departmentDescription' className='col-sm-2 col-form-label'>
            Description
          </label>
          <div className='col-sm-10'>
            <input
              type='text'
              className='form-control form-control-sm'
              placeholder='Department Description'
              {...formik.getFieldProps('department_description')}
            />
            {formik.touched.department_description && formik.errors.department_description && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>{formik.errors.department_description}</div>
              </div>
            )}
          </div>
        </div>
        <div className='d-flex justify-content-center'>
          <button type='submit' className='btn btn-primary'>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditDepartmentModal
