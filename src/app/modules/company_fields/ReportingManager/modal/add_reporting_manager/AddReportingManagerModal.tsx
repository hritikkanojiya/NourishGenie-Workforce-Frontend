import React, {useContext, useEffect} from 'react'
import {useFormik} from 'formik'
import axios from 'axios'
import {ReportingManagerContext} from '../../../context/ReportingManagerContext'
const API_URL = process.env.REACT_APP_API_URL
export const GET_ALL_MANAGERS = `${API_URL}/agent/fields/reporting_manager/getAppReportingManager`
export const CREATE_REPORTING_MANAGER = `${API_URL}/agent/fields/reporting_manager/createAppReportingManager`
export const GET_NON_MANAGER_EMPLOYEES = `${API_URL}/agent/fields/reporting_manager/getNonReportingManager`

const AddReportingManagerModal = () => {
  const [nonManagers, setNonManagers] = React.useState<any[]>([])
  const {modalFunction} = useContext(ReportingManagerContext)
  const {loadReportingManagerFunction} = useContext(ReportingManagerContext)
  useEffect(() => {
    get_non_managers()
  }, [])
  //load all the departments from the backend
  async function load_managers() {
    const varToken = localStorage.getItem('token')
    try {
      const result: any = await axios.post(
        GET_ALL_MANAGERS,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + varToken,
          },
        }
      )
      if (result.data.error === false) {
        loadReportingManagerFunction(result.data.data.AppReportingManager)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const formik = useFormik({
    initialValues: {
      managerId: '',
    },
    onSubmit: async (values) => {
      try {
        console.log(values.managerId)
        const varToken = localStorage.getItem('token')
        const result = await axios.post(
          CREATE_REPORTING_MANAGER,
          {
            appAgentId: values.managerId,
          },
          {
            headers: {
              Authorization: 'Bearer ' + varToken,
            },
          }
        )
        // Reset the form after successful submission
        formik.resetForm()
        if (result.data.error === false) {
          await load_managers()
          modalFunction(false)
        }
      } catch (error) {
        console.log(error)
      }
    },
  })

  async function get_non_managers() {
    const varToken = localStorage.getItem('token')
    try {
      const result: any = await axios.get(GET_NON_MANAGER_EMPLOYEES, {
        headers: {
          Authorization: 'Bearer ' + varToken,
        },
      })
      setNonManagers(result.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <h6>Add Reporting Manager</h6>
      <form onSubmit={formik.handleSubmit}>
        <div className='form-group row'>
          <label htmlFor='email' className='col-sm-2 col-form-label'>
            Email
          </label>
          <div className='col-sm-10'>
            <select
              id='email'
              className='form-control form-control-sm'
              {...formik.getFieldProps('managerId')}
            >
              <option value=''>Select Manager</option>
              {nonManagers.map((manager) => (
                <option key={manager._id} value={manager._id}>
                  {manager.email}
                </option>
              ))}
            </select>
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

export default AddReportingManagerModal
