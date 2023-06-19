import React, {useContext, useEffect} from 'react'
import {useFormik} from 'formik'
import api from '../../../../RequestConfig'
import * as Yup from 'yup'
import {DesignationContext} from '../../../context/DesignationContext'
const API_URL = process.env.REACT_APP_API_URL
export const GET_ALL_DETAILS = `${API_URL}/agent/fields/designation/get-single-designation`
export const GET_ALL_DESIGNATIONS = `${API_URL}/agent/fields/designation/get-designation`
export const UPDATE_DESIGNATION = `${API_URL}/agent/fields/designation/update-designation`

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
      loadDesignationFunction(result.data.data.appDesignations)
      if (result.data.error === false) {
      }
    } catch (err) {
      console.log(err)
    }
  }
  async function load_details() {
    const varToken = localStorage.getItem('token')
    console.log(designationId)
    try {
      const result = await api.post(
        GET_ALL_DETAILS,
        {
          appDesignationId: designationId,
        },
        {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      console.log(result.data.data)
      setData(result.data.data.appDesignation)
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
        const result = await api.put(
          UPDATE_DESIGNATION,
          {
            appDesignationId: designationId,
            name: values.Designation_name,
            description: values.Designation_description,
          },
          {
            headers: {
              genie_access_token: 'Bearer ' + varToken,
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
  console.log(data)
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
