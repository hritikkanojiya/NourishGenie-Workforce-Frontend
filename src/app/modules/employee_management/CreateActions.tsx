import CreateEmployee from './CreateEmp'
import AddDepartmentWrapper from './modals/department_modals/AddDepartmentWrapper'
import {DynamicFieldsContext} from './FieldsContext'
import {useContext} from 'react'

const DepartmentActions = () => {
  const {isDynamicCreateModalOpen} = useContext(DynamicFieldsContext)
  return (
    <div>
      {isDynamicCreateModalOpen && <AddDepartmentWrapper />}
      <CreateEmployee />
    </div>
  )
}

export default DepartmentActions
