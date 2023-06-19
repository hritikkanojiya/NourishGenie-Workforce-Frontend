import React, {useContext} from 'react'
import {useFormik} from 'formik'
import api from '../../../RequestConfig'
import * as Yup from 'yup'
import {DynamicFieldsContext} from '../../FieldsContext'
const API_URL = process.env.REACT_APP_API_URL
export const CREATE_DEPARTMENT = `${API_URL}/agent/fields/department/create-department`
export const GET_ALL_DEPARTMENTS = `${API_URL}/agent/fields/department/get-department`
const departmentValidationSchema = Yup.object().shape({
  departmentName: Yup.string()
    .required('Department Name is required')
    .matches(/^[a-zA-Z\s]+$/, 'Department Name cannot contain numbers'),
  departmentDescription: Yup.string()
    .required('Department Description is required')
    .matches(/^[a-zA-Z\s]+$/, 'Department Description cannot contain numbers'),
})
const AddDepartmentModal = () => {
  const {DepartmentmodalFunction} = useContext(DynamicFieldsContext)
  const {loadDepartmentFunction} = useContext(DynamicFieldsContext)
  //load all the departments from the backend
  async function load_departments() {
    const varToken = localStorage.getItem('token')
    try {
      const result = await api.post(
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
      if (result.data.error === false) {
        loadDepartmentFunction(result.data.data.AppDepartment)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const formik = useFormik({
    initialValues: {
      departmentName: '',
      departmentDescription: '',
    },
    validationSchema: departmentValidationSchema,
    onSubmit: async (values) => {
      try {
        const varToken = localStorage.getItem('token')
        const result = await api.post(
          CREATE_DEPARTMENT,
          {
            name: values.departmentName,
            description: values.departmentDescription,
          },
          {
            headers: {
              genie_access_token: 'Bearer ' + varToken,
            },
          }
        )
        console.log(result)
        // Reset the form after successful submission
        formik.resetForm()

        if (result.data.error === false) {
          DepartmentmodalFunction(false)
          load_departments()
        }
      } catch (error) {
        console.log(error)
      }
    },
  })

  return (
    <div>
      <h6>Add Department</h6>
      <form onSubmit={formik.handleSubmit}>
        <div className='form-group row'>
          <label htmlFor='departmentName' className='col-sm-2 col-form-label'>
            Name
          </label>
          <div className='col-sm-10'>
            <input
              type='text'
              className='form-control form-control-sm'
              id='departmentName'
              name='departmentName'
              placeholder='Department Name'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.departmentName}
            />
            {formik.touched.departmentName && formik.errors.departmentName && (
              <div className='text-danger'>{formik.errors.departmentName}</div>
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
              id='departmentDescription'
              name='departmentDescription'
              placeholder='Department Description'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.departmentDescription}
            />
            {formik.touched.departmentDescription && formik.errors.departmentDescription && (
              <div className='text-danger'>{formik.errors.departmentDescription}</div>
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

export default AddDepartmentModal
