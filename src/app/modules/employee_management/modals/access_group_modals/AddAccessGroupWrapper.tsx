import AddAccessGroupModal from './AddAccessGroupModal'
import AddAccessGroupHeader from './AddAccessGroupHeader'
const AddDepartmentWrapper = () => {
  return (
    <>
      <div className='modal fade show d-block'>
        <div className='modal-dialog modal-dialog-centered mw-650px'>
          <div className='modal-content'>
            <AddAccessGroupHeader />
            <div className='modal-body scroll-y mx-5 mx-xl-15 my-7'>
              <AddAccessGroupModal />
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
