import React, {useState, Dispatch, SetStateAction} from 'react'

type ModalFunction = Dispatch<SetStateAction<boolean>>

interface DepartmentContextProps {
  isCreateModalOpen: boolean
  modalFunction: ModalFunction
  isEditModalOpen: boolean
  editModalFunction: ModalFunction
  departmentId: string
  editDepartmentId: Dispatch<SetStateAction<string>>
  departments: any[]
  loadDepartmentFunction: Dispatch<SetStateAction<any[]>>
}

export const DepartmentContext = React.createContext<DepartmentContextProps>({
  isCreateModalOpen: false,
  modalFunction: () => {}, // Default empty function
  isEditModalOpen: false,
  editModalFunction: () => {}, // Default empty function
  departmentId: '',
  editDepartmentId: () => {}, // Default empty function
  departments: [],
  loadDepartmentFunction: () => {}, // Default empty function
})

function DepartmentContextProvider({children}: any) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [departments, setDepartments] = useState<any[]>([])
  const [departmentId, setDepartmentId] = useState<string>('')

  const modalFunction: ModalFunction = (value: SetStateAction<boolean>) => {
    setIsCreateModalOpen(value)
  }

  const editModalFunction: ModalFunction = (value: SetStateAction<boolean>) => {
    setIsEditModalOpen(value)
  }

  const editDepartmentId: Dispatch<SetStateAction<string>> = (value: SetStateAction<string>) => {
    setDepartmentId(value)
  }

  const loadDepartmentFunction: Dispatch<SetStateAction<any[]>> = (
    value: SetStateAction<any[]>
  ) => {
    setDepartments(value)
  }

  return (
    <DepartmentContext.Provider
      value={{
        isCreateModalOpen,
        modalFunction,
        isEditModalOpen,
        editModalFunction,
        departmentId,
        editDepartmentId,
        departments,
        loadDepartmentFunction,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  )
}

export default DepartmentContextProvider
