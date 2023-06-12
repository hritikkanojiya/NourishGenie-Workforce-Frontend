import Department from './Department'
import AddDepartmentWrapper from '../Department/modals/add_department/AddDepartmentWrapper'
import {DepartmentContext} from '../context/DepartmentContext'
import {useContext} from 'react'
import EditDepartmentWrapper from '../Department/modals/edit_department/EditDepartmentWrapper'

const DepartmentActions = () => {
  const {isCreateModalOpen, isEditModalOpen} = useContext(DepartmentContext)
  return (
    <div>
      {isCreateModalOpen && <AddDepartmentWrapper />}
      <Department />
      {isEditModalOpen && <EditDepartmentWrapper />}
    </div>
  )
}

export default DepartmentActions
