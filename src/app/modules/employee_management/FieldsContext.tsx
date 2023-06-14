import React, {useState, Dispatch, SetStateAction} from 'react'

type ModalFunction = Dispatch<SetStateAction<boolean>>

interface FieldsContextProps {
  isDynamicCreateModalOpen: boolean
  modalFunction: ModalFunction
}

export const DynamicFieldsContext = React.createContext<FieldsContextProps>({
  isDynamicCreateModalOpen: false,
  modalFunction: () => {}, // Default empty function
})

function FieldsContextProvider({children}: any) {
  const [isDynamicCreateModalOpen, setIsDynamicCreateModalOpen] = useState<boolean>(false)

  const modalFunction: ModalFunction = (value: SetStateAction<boolean>) => {
    setIsDynamicCreateModalOpen(value)
  }

  return (
    <DynamicFieldsContext.Provider
      value={{
        isDynamicCreateModalOpen,
        modalFunction,
      }}
    >
      {children}
    </DynamicFieldsContext.Provider>
  )
}

export default FieldsContextProvider
