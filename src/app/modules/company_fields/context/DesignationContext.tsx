import React, {useState, Dispatch, SetStateAction} from 'react'

type ModalFunction = Dispatch<SetStateAction<boolean>>

interface DesignationContextProps {
  isCreateModalOpen: boolean
  modalFunction: ModalFunction
  isEditModalOpen: boolean
  editModalFunction: ModalFunction
  designationId: string
  editDesignationId: Dispatch<SetStateAction<string>>
  designations: any[]
  loadDesignationFunction: Dispatch<SetStateAction<any[]>>
}

export const DesignationContext = React.createContext<DesignationContextProps>({
  isCreateModalOpen: false,
  modalFunction: () => {}, // Default empty function
  isEditModalOpen: false,
  editModalFunction: () => {}, // Default empty function
  designationId: '',
  editDesignationId: () => {}, // Default empty function
  designations: [],
  loadDesignationFunction: () => {}, // Default empty function
})

function DesignationContextProvider({children}: any) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [designations, setDesignations] = useState<any[]>([])
  const [designationId, setDesignationId] = useState<string>('')

  const modalFunction: ModalFunction = (value: SetStateAction<boolean>) => {
    setIsCreateModalOpen(value)
  }

  const editModalFunction: ModalFunction = (value: SetStateAction<boolean>) => {
    setIsEditModalOpen(value)
  }

  const editDesignationId: Dispatch<SetStateAction<string>> = (value: SetStateAction<string>) => {
    setDesignationId(value)
  }

  const loadDesignationFunction: Dispatch<SetStateAction<any[]>> = (
    value: SetStateAction<any[]>
  ) => {
    setDesignations(value)
  }

  return (
    <DesignationContext.Provider
      value={{
        isCreateModalOpen,
        modalFunction,
        isEditModalOpen,
        editModalFunction,
        designationId,
        editDesignationId,
        designations,
        loadDesignationFunction,
      }}
    >
      {children}
    </DesignationContext.Provider>
  )
}

export default DesignationContextProvider
