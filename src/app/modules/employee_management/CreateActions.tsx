import CreateEmployee from './CreateEmp'
import AddDepartmentWrapper from './modals/department_modals/AddDepartmentWrapper'
import {DynamicFieldsContext} from './FieldsContext'
import {useContext} from 'react'
import AddDesignationWrapper from './modals/designation_modals/AddDesignationWrapper'
import AddReportingManagerWrapper from './modals/reporting_manager_modals/AddReportingManagerWrapper'
import AddAccessGroupWrapper from './modals/access_group_modals/AddAccessGroupWrapper'

const DepartmentActions = () => {
  const {isDepartmentCreateModalOpen} = useContext(DynamicFieldsContext)
  const {isDesignationCreateModalOpen} = useContext(DynamicFieldsContext)
  const {isManagerCreateModalOpen} = useContext(DynamicFieldsContext)
  const {isAccessGroupCreateModalOpen} = useContext(DynamicFieldsContext)
  return (
    <div>
      {isDepartmentCreateModalOpen && <AddDepartmentWrapper />}
      {isDesignationCreateModalOpen && <AddDesignationWrapper />}
      {isManagerCreateModalOpen && <AddReportingManagerWrapper />}
      {isAccessGroupCreateModalOpen && <AddAccessGroupWrapper />}
      <CreateEmployee />
    </div>
  )
}

export default DepartmentActions
