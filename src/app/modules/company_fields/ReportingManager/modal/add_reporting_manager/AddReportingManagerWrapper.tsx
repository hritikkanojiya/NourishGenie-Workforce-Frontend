import AddReportingManagerModal from './AddReportingManagerModal'
import AddReportingManagerHeader from './AddReportingManagerHeader'
const AddReportingManagerWrapper = () => {
  return (
    <>
      <div className='modal fade show d-block'>
        <div className='modal-dialog modal-dialog-centered mw-650px'>
          <div className='modal-content'>
            <AddReportingManagerHeader />
            <div className='modal-body scroll-y mx-5 mx-xl-15 my-7'>
              <AddReportingManagerModal />
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

export default AddReportingManagerWrapper
