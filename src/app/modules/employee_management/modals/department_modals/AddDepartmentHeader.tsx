import {KTSVG} from '../../../../../_metronic/helpers'
import {useContext} from 'react'
import {DynamicFieldsContext} from '../../FieldsContext'
const DepartmentModalHeader = () => {
  const {modalFunction} = useContext(DynamicFieldsContext)
  return (
    <div className='modal-header'>
      <h2 className='fw-bolder'>Create New Department</h2>
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={() => {
          modalFunction(false)
        }}
        style={{cursor: 'pointer'}}
      >
        <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
      </div>
    </div>
  )
}

export default DepartmentModalHeader
