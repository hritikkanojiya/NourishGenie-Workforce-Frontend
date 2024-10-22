import {KTSVG} from '../../../../../_metronic/helpers'
import {useContext} from 'react'
import {DynamicFieldsContext} from '../../FieldsContext'
const DepartmentModalHeader = () => {
  const {AccessGroupmodalFunction} = useContext(DynamicFieldsContext)
  return (
    <div className='modal-header'>
      <h2 className='fw-bolder'>Create New Access Group</h2>
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={() => {
          AccessGroupmodalFunction(false)
        }}
        style={{cursor: 'pointer'}}
      >
        <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
      </div>
    </div>
  )
}

export default DepartmentModalHeader
