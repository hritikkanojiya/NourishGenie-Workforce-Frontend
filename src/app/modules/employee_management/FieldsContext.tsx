import React, {useState, Dispatch, SetStateAction} from 'react'

type ModalFunction = Dispatch<SetStateAction<boolean>>

interface FieldsContextProps {
  isDepartmentCreateModalOpen: boolean
  DepartmentmodalFunction: ModalFunction
  isDesignationCreateModalOpen: boolean
  DesignationmodalFunction: ModalFunction
  isManagerCreateModalOpen: boolean
  ManagermodalFunction: ModalFunction
  isAccessGroupCreateModalOpen: boolean
  AccessGroupmodalFunction: ModalFunction
  departments: any[]
  loadDepartmentFunction: Dispatch<SetStateAction<any[]>>
  designations: any[]
  loadDesignationFunction: Dispatch<SetStateAction<any[]>>
  reportingManagers: any[]
  loadReportingManagerFunction: Dispatch<SetStateAction<any[]>>
  accessGroups: any[]
  loadAccessGroupFunction: Dispatch<SetStateAction<any[]>>
}

export const DynamicFieldsContext = React.createContext<FieldsContextProps>({
  isDepartmentCreateModalOpen: false,
  DepartmentmodalFunction: () => {}, // Default empty function
  isDesignationCreateModalOpen: false,
  DesignationmodalFunction: () => {}, // Default empty function
  isManagerCreateModalOpen: false,
  ManagermodalFunction: () => {}, // Default empty function
  isAccessGroupCreateModalOpen: false,
  AccessGroupmodalFunction: () => {}, // Default empty function
  departments: [],
  loadDepartmentFunction: () => {}, // Default empty function
  designations: [],
  loadDesignationFunction: () => {}, // Default empty function
  reportingManagers: [],
  loadReportingManagerFunction: () => {}, // Default empty function
  accessGroups: [],
  loadAccessGroupFunction: () => {}, // Default empty function
})

function FieldsContextProvider({children}: any) {
  const [isDepartmentCreateModalOpen, setIsDepartmentCreateModalOpen] = useState<boolean>(false)
  const [isDesignationCreateModalOpen, setIsDesignationCreateModalOpen] = useState<boolean>(false)
  const [isManagerCreateModalOpen, setIsManagerCreateModalOpen] = useState<boolean>(false)
  const [isAccessGroupCreateModalOpen, setIsAccessGroupCreateModalOpen] = useState<boolean>(false)
  const [departments, setDepartments] = useState<any[]>([])
  const [designations, setDesignations] = useState<any[]>([])
  const [reportingManagers, setReportingManagers] = useState<any[]>([])
  const [accessGroups, setAccessGroups] = useState<any[]>([])

  const DepartmentmodalFunction: ModalFunction = (value: SetStateAction<boolean>) => {
    setIsDepartmentCreateModalOpen(value)
  }
  const DesignationmodalFunction: ModalFunction = (value: SetStateAction<boolean>) => {
    setIsDesignationCreateModalOpen(value)
  }
  const ManagermodalFunction: ModalFunction = (value: SetStateAction<boolean>) => {
    setIsManagerCreateModalOpen(value)
  }
  const AccessGroupmodalFunction: ModalFunction = (value: SetStateAction<boolean>) => {
    setIsAccessGroupCreateModalOpen(value)
  }
  const loadDepartmentFunction: Dispatch<SetStateAction<any[]>> = (
    value: SetStateAction<any[]>
  ) => {
    setDepartments(value)
  }
  const loadDesignationFunction: Dispatch<SetStateAction<any[]>> = (
    value: SetStateAction<any[]>
  ) => {
    setDesignations(value)
  }
  const loadReportingManagerFunction: Dispatch<SetStateAction<any[]>> = (
    value: SetStateAction<any[]>
  ) => {
    setReportingManagers(value)
  }
  const loadAccessGroupFunction: Dispatch<SetStateAction<any[]>> = (
    value: SetStateAction<any[]>
  ) => {
    setAccessGroups(value)
  }

  return (
    <DynamicFieldsContext.Provider
      value={{
        isDepartmentCreateModalOpen,
        DepartmentmodalFunction,
        isDesignationCreateModalOpen,
        DesignationmodalFunction,
        isManagerCreateModalOpen,
        ManagermodalFunction,
        isAccessGroupCreateModalOpen,
        AccessGroupmodalFunction,
        departments,
        loadDepartmentFunction,
        designations,
        loadDesignationFunction,
        reportingManagers,
        loadReportingManagerFunction,
        accessGroups,
        loadAccessGroupFunction,
      }}
    >
      {children}
    </DynamicFieldsContext.Provider>
  )
}

export default FieldsContextProvider
