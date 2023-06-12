import Designation from './Designation'
import AddDesignationWrapper from '../Designation/modals/add_designation/AddDesignationWrapper'
import {DesignationContext} from '../context/DesignationContext'
import {useContext} from 'react'
import EditDesignationWrapper from '../Designation/modals/edit_designation/EditDesignationWrapper'

const DesignationActions = () => {
  const {isCreateModalOpen, isEditModalOpen} = useContext(DesignationContext)
  console.log(isCreateModalOpen, isEditModalOpen)
  return (
    <div>
      {isCreateModalOpen && <AddDesignationWrapper />}
      <Designation />
      {isEditModalOpen && <EditDesignationWrapper />}
    </div>
  )
}

export default DesignationActions
