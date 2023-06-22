import React, {useState, Dispatch, SetStateAction} from 'react'

type ModalFunction = Dispatch<SetStateAction<boolean>>

interface FilesContextProps {
  isFileUploadModalOpen: boolean
  FilemodalFunction: ModalFunction

  files: any[]
  loadFilesFunction: Dispatch<SetStateAction<any[]>>
}

export const UploadFileContext = React.createContext<FilesContextProps>({
  isFileUploadModalOpen: false,
  FilemodalFunction: () => {}, // Default empty function
  files: [],
  loadFilesFunction: () => {}, // Default empty function
})

function FilesContextProvider({children}: any) {
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState<boolean>(false)
  const [files, setFiles] = useState<any[]>([])

  const FilemodalFunction: ModalFunction = (value: SetStateAction<boolean>) => {
    setIsFileUploadModalOpen(value)
  }
  const loadFilesFunction: Dispatch<SetStateAction<any[]>> = (value: SetStateAction<any[]>) => {
    setFiles(value)
  }
  return (
    <UploadFileContext.Provider
      value={{
        isFileUploadModalOpen,
        FilemodalFunction,
        files,
        loadFilesFunction,
      }}
    >
      {children}
    </UploadFileContext.Provider>
  )
}
export default FilesContextProvider
