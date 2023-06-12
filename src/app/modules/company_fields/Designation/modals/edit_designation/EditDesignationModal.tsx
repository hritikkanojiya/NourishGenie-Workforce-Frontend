import React, {useContext, useEffect} from 'react'
import {useFormik} from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import {DesignationContext} from '../../../context/DesignationContext'
const API_URL = process.env.REACT_APP_API_URL
export const GET_ALL_DETAILS = `${API_URL}/agent/fields/Designation/getSingleDesignation`
export const GET_ALL_DesignationS = `${API_URL}/agent/fields/Designation/getAppDesignation`
export const UPDATE_Designation = `${API_URL}/agent/fields/Designation/updateAppDesignation`

const DesignationValidationSchema = Yup.object().shape({
  Designation_name: Yup.string()
    .required('Designation Name is required')
    .matches(/^[a-zA-Z\s]+$/, 'Designation Name cannot contain numbers'),
  Designation_description: Yup.string()
    .required('Designation Description is required')
    .matches(/^[a-zA-Z\s]+$/, 'Designation Description cannot contain numbers'),
})

const EditDesignationModal = () => {
  const {loadDesignationFunction} = useContext(DesignationContext)
  const {editModalFunction} = useContext(DesignationContext)
  const {designationId} = useContext(DesignationContext)
  const [data, setData] = React.useState<any>({})
  //load the Designation details from the backend
  useEffect(() => {
    ;(async () => {
      await load_details()
    })()
  }, [])

  //load all the Designations from the backend
  async function load_Designations() {
    const varToken = localStorage.getItem('token')
    try {
      const result = await axios.post(
        GET_ALL_DesignationS,
        {
          search: '',
        },
        {
          headers: {
            Authorization: 'Bearer ' + varToken,
          },
        }
      )
      loadDesignationFunction(result.data.data.AppDesignation)
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
          appDesignationId: designationId,
        },
        {
          headers: {
            Authorization: 'Bearer ' + varToken,
          },
        }
      )
      setData(result.data.data.designation)
      if (result.data.error === false) {
      }
    } catch (err) {
      console.log(err)
    }
  }
  const formik: any = useFormik({
    initialValues: {
      Designation_name: data && data.name ? data.name : '',
      Designation_description: data && data.description ? data.description : '',
    },
    enableReinitialize: true,
    validationSchema: DesignationValidationSchema,
    onSubmit: async (values) => {
      try {
        const varToken = localStorage.getItem('token')
        const result = await axios.patch(
          UPDATE_Designation,
          {
            appDesignationId: designationId,
            name: values.Designation_name,
            description: values.Designation_description,
          },
          {
            headers: {
              Authorization: 'Bearer ' + varToken,
            },
          }
        )
        console.log(result)
        if (result.data.data.error !== false) {
          load_Designations()
          editModalFunction(false)
        }
      } catch (error) {
        console.log(error)
      }
    },
  })
  return (
    <div>
      <h6>Edit Designation Details</h6>
      <form onSubmit={formik.handleSubmit}>
        <div className='form-group row'>
          <label htmlFor='DesignationName' className='col-sm-2 col-form-label'>
            Name
          </label>
          <div className='col-sm-10'>
            <input
              type='text'
              className='form-control form-control-sm'
              placeholder='Designation Name'
              {...formik.getFieldProps('Designation_name')}
            />
            {formik.touched.Designation_name && formik.errors.Designation_name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>{formik.errors.Designation_name}</div>
              </div>
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
              placeholder='Designation Description'
              {...formik.getFieldProps('Designation_description')}
            />
            {formik.touched.Designation_description && formik.errors.Designation_description && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>{formik.errors.Designation_description}</div>
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

export default EditDesignationModal
