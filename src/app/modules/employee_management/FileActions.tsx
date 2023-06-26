import EmployeeFiles from './EmployeeFiles'
import UploadFileWrapper from './modals/upload_files_modals/UploadFileWrapper'
import {useContext} from 'react'
import {UploadFileContext} from './FilesContext'

const FileActions = () => {
  const {isFileUploadModalOpen} = useContext(UploadFileContext)
  console.log(isFileUploadModalOpen)
  return (
    <div>
      {isFileUploadModalOpen && <UploadFileWrapper />}
      <EmployeeFiles />
    </div>
  )
}
export default FileActions
