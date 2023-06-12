import React, {useState, Dispatch, SetStateAction} from 'react'

type ModalFunction = Dispatch<SetStateAction<boolean>>

interface ReportingManagerContextProps {
  isCreateModalOpen: boolean
  modalFunction: ModalFunction
  ReportingManagers: any[]
  loadReportingManagerFunction: Dispatch<SetStateAction<any[]>>
}

export const ReportingManagerContext = React.createContext<ReportingManagerContextProps>({
  isCreateModalOpen: false,
  modalFunction: () => {}, // Default empty function
  ReportingManagers: [],
  loadReportingManagerFunction: () => {}, // Default empty function
})

function ReportingManagerContextProvider({children}: any) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [ReportingManagers, setReportingManagers] = useState<any[]>([])

  const modalFunction: ModalFunction = (value: SetStateAction<boolean>) => {
    setIsCreateModalOpen(value)
  }

  const loadReportingManagerFunction: Dispatch<SetStateAction<any[]>> = (
    value: SetStateAction<any[]>
  ) => {
    setReportingManagers(value)
  }

  return (
    <ReportingManagerContext.Provider
      value={{
        isCreateModalOpen,
        modalFunction,
        ReportingManagers,
        loadReportingManagerFunction,
      }}
    >
      {children}
    </ReportingManagerContext.Provider>
  )
}

export default ReportingManagerContextProvider
