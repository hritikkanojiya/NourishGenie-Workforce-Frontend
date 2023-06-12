import ReportingManager from '../ReportingManager/ReportingManagers'
import AddReportingManagerWrapper from '../ReportingManager/modal/add_reporting_manager/AddReportingManagerWrapper'
import {ReportingManagerContext} from '../context/ReportingManagerContext'
import {useContext} from 'react'

const ReportingManagerActions = () => {
  const {isCreateModalOpen} = useContext(ReportingManagerContext)
  console.log(isCreateModalOpen)
  return (
    <div>
      {isCreateModalOpen && <AddReportingManagerWrapper />}
      <ReportingManager />
    </div>
  )
}

export default ReportingManagerActions
