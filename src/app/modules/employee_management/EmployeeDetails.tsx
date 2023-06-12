import axios from 'axios'
import {useEffect} from 'react'
import React from 'react'
import {useLocation} from 'react-router-dom'
const API_URL = process.env.REACT_APP_API_URL
export const GET_USER_DETAILS = `${API_URL}/agent/account/getSingleUserDetails`
function EmployeeDetails() {
  const location: any = useLocation()
  const [details, setDetails] = React.useState<any>({})
  // const [loading, setLoading] = useState(true)
  useEffect(() => {
    ;(async () => {
      const id = location.state
      await load_details(id)
    })()
  }, [])

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

      setDetails(result.data.data)
      if (result.data.error === false) {
      }
    } catch (err) {
      console.log(err)
    }
    //setLoading(false)
  }

  return (
    <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
      <div className='card-header cursor-pointer'>
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Profile Details</h3>
        </div>
      </div>
      <div className='card-body p-9'>
        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>First Name</label>
          <div className='col-lg-8'>
            <span className='fw-bolder fs-6 text-dark'>
              {details.user_details ? details.user_details.first_name : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Last Name</label>

          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.user_details ? details.user_details.last_name : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Email</label>
          <div className='col-lg-8 d-flex align-items-center'>
            <span className='fw-bolder fs-6 me-2'>
              {details.user_details ? details.user_details.email : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Employee Type</label>

          <div className='col-lg-8'>
            <span className='fw-bolder fs-6 text-dark'>
              {details.user_details ? details.user_details.employee_type : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Department</label>

          <div className='col-lg-8'>
            <span className='fw-bolder fs-6 text-dark'>
              {details.user_details ? details.user_details.appDepartmentId.name : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Designation</label>

          <div className='col-lg-8'>
            <span className='fw-bolder fs-6 text-dark'>
              {details.user_details ? details.user_details.appDesignationId.name : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Access Group</label>

          <div className='col-lg-8'>
            <span className='fw-bolder fs-6 text-dark'>
              {details.user_details ? details.user_details.appAccessGroupId.name : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Communication</label>
          <div className='col-lg-8'>
            <span className='fw-bolder fs-6 text-dark'>Email, Phone</span>
          </div>
        </div>
      </div>

      <div className='card-header cursor-pointer'>
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Work Information</h3>
        </div>
      </div>
      <div className='card-body p-9'>
        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Company Email</label>
          <div className='col-lg-8'>
            <span className='fw-bolder fs-6 text-dark'>
              {details.company_details ? details.company_details.company_email : ''}
            </span>
          </div>
        </div>
        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Primary Email</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.company_details ? details.company_details.primary_email : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Gender</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.company_details ? details.company_details.gender : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Contact Number</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.company_details ? details.company_details.contact_number : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Date of Birth</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.company_details ? details.company_details.date_of_birth : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Date of Joining</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.company_details ? details.company_details.date_of_joining : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Working Hours</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.company_details ? details.company_details.working_hours : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Salary</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.company_details ? details.company_details.salary : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Marital Status</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.company_details ? details.company_details.marital_status : ''}
            </span>
          </div>
        </div>
      </div>
      <div className='card-header cursor-pointer'>
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Bank Information</h3>
        </div>
      </div>
      <div className='card-body p-9'>
        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Account Number</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.bank_details ? details.bank_details.account_number : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Name as per Bank</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.bank_details ? details.bank_details.name_as_per_bank : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Bank Name</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.bank_details ? details.bank_details.bank_name : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>IFSC Code</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.bank_details ? details.bank_details.ifsc_code : ''}
            </span>
          </div>
        </div>
      </div>
      <div className='card-header cursor-pointer'>
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Contact Information</h3>
        </div>
      </div>
      <div className='card-body p-9'>
        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Emergency Contact Number</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.contact_details ? details.contact_details.number : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Relation</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.contact_details ? details.contact_details.relation : ''}
            </span>
          </div>
        </div>
      </div>

      <div className='card-header cursor-pointer'>
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Address Information</h3>
        </div>
      </div>

      <div className='card-body p-9'>
        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Country</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.address_details ? details.address_details.country : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>State</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.address_details ? details.address_details.state : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>City</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.address_details ? details.address_details.city : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Address</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.address_details ? details.address_details.address : ''}
            </span>
          </div>
        </div>

        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Pincode</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.address_details ? details.address_details.pincode : ''}
            </span>
          </div>
        </div>
        <div className='row mb-7'>
          <label className='col-lg-4 fw-bold text-muted'>Landmark</label>
          <div className='col-lg-8 fv-row'>
            <span className='fw-bold fs-6'>
              {details.address_details ? details.address_details.landmark : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default EmployeeDetails
