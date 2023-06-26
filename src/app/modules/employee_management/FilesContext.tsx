import React, {useState, Dispatch, SetStateAction} from 'react'

type ModalFunction = Dispatch<SetStateAction<boolean>>

interface FilesContextProps {
  isFileUploadModalOpen: boolean
  FilemodalFunction: ModalFunction

  //aadharNumber as string
  aadharNumber: string
  loadAadharNumber: Dispatch<SetStateAction<string>>
  //agent id as string
  agentId: string
  loadAgentId: Dispatch<SetStateAction<string>>
  //panNumber as string
  panNumber: string
  loadPanNumber: Dispatch<SetStateAction<string>>
  //profile picture as object
  profilePicture: any
  loadProfilePicture: Dispatch<SetStateAction<any>>

  //aadharCard as object
  aadharCard: any
  loadAadharCard: Dispatch<SetStateAction<any>>

  //panCard as object
  panCard: any
  loadPanCard: Dispatch<SetStateAction<any>>

  //otherFiles as array
  otherFiles: any[]
  loadOtherFilesFunction: Dispatch<SetStateAction<any[]>>
}

export const UploadFileContext = React.createContext<FilesContextProps>({
  isFileUploadModalOpen: false,
  FilemodalFunction: () => {}, // Default empty function
  profilePicture: {},
  loadProfilePicture: () => {},
  aadharCard: {},
  loadAadharCard: () => {},
  panCard: {},
  loadPanCard: () => {},
  otherFiles: [],
  loadOtherFilesFunction: () => {}, // Default empty function
  aadharNumber: '',
  loadAadharNumber: () => {},
  panNumber: '',
  loadPanNumber: () => {},
  agentId: '',
  loadAgentId: () => {},
})

function FilesContextProvider({children}: any) {
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState<boolean>(false)
  const [profilePicture, setProfilePicture] = useState<any>({})
  const [aadharCard, setAadharCard] = useState<any>({})
  const [panCard, setPanCard] = useState<any>({})
  const [aadharNumber, setAadharNumber] = useState<string>('')
  const [panNumber, setPanNumber] = useState<string>('')
  const [agentId, setAgentId] = useState<string>('')
  const [otherFiles, setOtherFiles] = useState<any[]>([])

  const FilemodalFunction: ModalFunction = (value: SetStateAction<boolean>) => {
    setIsFileUploadModalOpen(value)
  }

  const loadAgentId: Dispatch<SetStateAction<string>> = (value: SetStateAction<string>) => {
    setAgentId(value)
  }

  const loadAadharNumber: Dispatch<SetStateAction<string>> = (value: SetStateAction<string>) => {
    setAadharNumber(value)
  }
  const loadPanNumber: Dispatch<SetStateAction<string>> = (value: SetStateAction<string>) => {
    setPanNumber(value)
  }
  const loadProfilePicture: Dispatch<SetStateAction<any>> = (value: SetStateAction<any>) => {
    setProfilePicture(value)
  }
  const loadAadharCard: Dispatch<SetStateAction<any>> = (value: SetStateAction<any>) => {
    setAadharCard(value)
  }
  const loadPanCard: Dispatch<SetStateAction<any>> = (value: SetStateAction<any>) => {
    setPanCard(value)
  }
  const loadOtherFilesFunction: Dispatch<SetStateAction<any[]>> = (
    value: SetStateAction<any[]>
  ) => {
    setOtherFiles(value)
  }
  return (
    <UploadFileContext.Provider
      value={{
        isFileUploadModalOpen,
        FilemodalFunction,
        agentId,
        loadAgentId,
        aadharNumber,
        loadAadharNumber,
        panNumber,
        loadPanNumber,
        profilePicture,
        loadProfilePicture,
        aadharCard,
        loadAadharCard,
        panCard,
        loadPanCard,
        otherFiles,
        loadOtherFilesFunction,
      }}
    >
      {children}
    </UploadFileContext.Provider>
  )
}
export default FilesContextProvider
