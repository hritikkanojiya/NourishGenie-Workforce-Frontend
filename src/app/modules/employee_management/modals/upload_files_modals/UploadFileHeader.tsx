import {KTSVG} from '../../../../../_metronic/helpers'
import {useContext} from 'react'
import {UploadFileContext} from '../../FilesContext'
const UploadFileHeader = () => {
  const {FilemodalFunction} = useContext(UploadFileContext)
  return (
    <div className='modal-header'>
      <h2 className='fw-bolder'>Upload New Files</h2>
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={() => {
          FilemodalFunction(false)
        }}
        style={{cursor: 'pointer'}}
      >
        <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
      </div>
    </div>
  )
}

export default UploadFileHeader
