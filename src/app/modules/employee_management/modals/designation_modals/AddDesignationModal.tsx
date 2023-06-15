import React, {useContext} from 'react'
import {useFormik} from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import {DynamicFieldsContext} from '../../FieldsContext'
const API_URL = process.env.REACT_APP_API_URL
export const CREATE_Designation = `${API_URL}/agent/fields/designation/create-designation`
export const GET_ALL_DesignationS = `${API_URL}/agent/fields/designation/get-designation`
const DesignationValidationSchema = Yup.object().shape({
  DesignationName: Yup.string()
    .required('Designation Name is required')
    .matches(/^[a-zA-Z\s]+$/, 'Designation Name cannot contain numbers'),
  DesignationDescription: Yup.string()
    .required('Designation Description is required')
    .matches(/^[a-zA-Z\s]+$/, 'Designation Description cannot contain numbers'),
})
const AddDesignationModal = () => {
  const {DesignationmodalFunction} = useContext(DynamicFieldsContext)
  //load all the Designations from the backend
  async function load_Designations() {
    const varToken = localStorage.getItem('token')
    try {
      const result = await axios.post(
        GET_ALL_DesignationS,
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
        DesignationmodalFunction(false)
        load_Designations()
      }
    } catch (err) {
      console.log(err)
    }
  }
  const formik = useFormik({
    initialValues: {
      DesignationName: '',
      DesignationDescription: '',
    },
    validationSchema: DesignationValidationSchema,
    onSubmit: async (values) => {
      try {
        const varToken = localStorage.getItem('token')
        const result = await axios.post(
          CREATE_Designation,
          {
            name: values.DesignationName,
            description: values.DesignationDescription,
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
        if (result.data.status === 'success') {
          DesignationmodalFunction(false)
          load_Designations()
        }
      } catch (error) {
        console.log(error)
      }
    },
  })

  return (
    <div>
      <h6>Add Designation</h6>
      <form onSubmit={formik.handleSubmit}>
        <div className='form-group row'>
          <label htmlFor='DesignationName' className='col-sm-2 col-form-label'>
            Name
          </label>
          <div className='col-sm-10'>
            <input
              type='text'
              className='form-control form-control-sm'
              id='DesignationName'
              name='DesignationName'
              placeholder='Designation Name'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.DesignationName}
            />
            {formik.touched.DesignationName && formik.errors.DesignationName && (
              <div className='text-danger'>{formik.errors.DesignationName}</div>
            )}
          </div>
        </div>
        <div className='form-group row'>
          <label htmlFor='DesignationDescription' className='col-sm-2 col-form-label'>
            Description
          </label>
          <div className='col-sm-10'>
            <input
              type='text'
              className='form-control form-control-sm'
              id='DesignationDescription'
              name='DesignationDescription'
              placeholder='Designation Description'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.DesignationDescription}
            />
            {formik.touched.DesignationDescription && formik.errors.DesignationDescription && (
              <div className='text-danger'>{formik.errors.DesignationDescription}</div>
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

export default AddDesignationModal
