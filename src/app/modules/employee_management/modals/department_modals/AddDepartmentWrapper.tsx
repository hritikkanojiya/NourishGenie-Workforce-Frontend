import AddDepartmentModal from './AddDepartmentModal'
import AddDepartmentHeader from './AddDepartmentHeader'
const AddDepartmentWrapper = () => {
  return (
    <>
      <div className='modal fade show d-block'>
        <div className='modal-dialog modal-dialog-centered mw-650px'>
          <div className='modal-content'>
            <AddDepartmentHeader />
            <div className='modal-body scroll-y mx-5 mx-xl-15 my-7'>
              <AddDepartmentModal />
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
