import React, {useContext} from 'react'
import {useFormik} from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import {DynamicFieldsContext} from '../../FieldsContext'
const API_URL = process.env.REACT_APP_API_URL
export const CREATE_ACCESS_GROUP = `${API_URL}/agent/fields/accessGroup/create-group`
export const GET_ALL_ACCESSGROUP = `${API_URL}/agent/fields/accessGroup/get-group`
const accessGroupValidationSchema = Yup.object().shape({
  accessGroupName: Yup.string()
    .required('Department Name is required')
    .matches(/^[a-zA-Z\s]+$/, 'Department Name cannot contain numbers'),
  accessGroupDescription: Yup.string()
    .required('Department Description is required')
    .matches(/^[a-zA-Z\s]+$/, 'Department Description cannot contain numbers'),
})
const AddDepartmentModal = () => {
  const {AccessGroupmodalFunction} = useContext(DynamicFieldsContext)
  //load all the accessGroups from the backend
  async function load_accessGroups() {
    const varToken = localStorage.getItem('token')
    try {
      const result = await axios.post(
        GET_ALL_ACCESSGROUP,
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
      }
    } catch (err) {
      console.log(err)
    }
  }
  const formik = useFormik({
    initialValues: {
      accessGroupName: '',
      accessGroupDescription: '',
    },
    validationSchema: accessGroupValidationSchema,
    onSubmit: async (values) => {
      try {
        const varToken = localStorage.getItem('token')
        const result = await axios.post(
          CREATE_ACCESS_GROUP,
          {
            name: values.accessGroupName,
            description: values.accessGroupDescription,
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
          AccessGroupmodalFunction(false)
          load_accessGroups()
        }
      } catch (error) {
        console.log(error)
      }
    },
  })

  return (
    <div>
      <h6>Add Access Group</h6>
      <form onSubmit={formik.handleSubmit}>
        <div className='form-group row'>
          <label htmlFor='accessGroupName' className='col-sm-2 col-form-label'>
            Name
          </label>
          <div className='col-sm-10'>
            <input
              type='text'
              className='form-control form-control-sm'
              id='accessGroupName'
              name='accessGroupName'
              placeholder='Access Group Name'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.accessGroupName}
            />
            {formik.touched.accessGroupName && formik.errors.accessGroupName && (
              <div className='text-danger'>{formik.errors.accessGroupName}</div>
            )}
          </div>
        </div>
        <div className='form-group row'>
          <label htmlFor='accessGroupDescription' className='col-sm-2 col-form-label'>
            Description
          </label>
          <div className='col-sm-10'>
            <input
              type='text'
              className='form-control form-control-sm'
              id='accessGroupDescription'
              name='accessGroupDescription'
              placeholder='Access Group Description'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.accessGroupDescription}
            />
            {formik.touched.accessGroupDescription && formik.errors.accessGroupDescription && (
              <div className='text-danger'>{formik.errors.accessGroupDescription}</div>
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
