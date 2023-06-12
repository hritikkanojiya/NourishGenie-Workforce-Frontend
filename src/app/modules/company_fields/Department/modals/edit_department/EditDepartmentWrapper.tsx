import EditDepartmentModal from './EditDepartmentModal'
import EditDepartmentHeader from './EditDepartmentHeader'
const AddDepartmentWrapper = () => {
  return (
    <>
      <div className='modal fade show d-block'>
        {/* begin::Modal dialog */}
        <div className='modal-dialog modal-dialog-centered mw-650px'>
          {/* begin::Modal content */}
          <div className='modal-content'>
            <EditDepartmentHeader />
            {/* begin::Modal body */}
            <div className='modal-body scroll-y mx-5 mx-xl-15 my-7'>
              <EditDepartmentModal />
            </div>
            {/* end::Modal body */}
          </div>
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
    </>
  )
}

export default AddDepartmentWrapper
