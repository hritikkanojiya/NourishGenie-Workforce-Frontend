import React, {useEffect, useState} from 'react'
import api from '../RequestConfig'
import {useLocation} from 'react-router-dom'
import {UploadFileContext} from './FilesContext'

const API_URL = process.env.REACT_APP_API_URL
export const UPLOAD_FILES = `${API_URL}/agent/account_files/upload-file`
export const GET_ALL_FILES = `${API_URL}/agent/account_files/get-files`
export const DELETE_FILE = `${API_URL}/agent/account_files/delete-file`
export const UPDATE_FILE = `${API_URL}/agent/account_files/update-file`

function EmployeeFiles() {
  // States to store the files.
  const [profilePicture, setProfilePicture] = useState<any>({})
  const [aadharCard, setAadharCard] = useState<any>({})
  const [panCard, setPanCard] = useState<any>({})
  const [aadharCardNumber, setAadharCardNumber] = useState<any>({})
  const [panCardNumber, setPanCardNumber] = useState<any>({})
  const [otherFiles, setOtherFiles] = useState<any>([])
  const {FilemodalFunction} = React.useContext(UploadFileContext)
  const {loadFilesFunction} = React.useContext(UploadFileContext)

  //handlers to handle when change happens to the files
  // const handleProfileChange = (event: any = true) => {
  //   setProfilePicture(event.target.files[0])
  // }

  // const handleAadharChange = (event: any = true) => {
  //   setAadharCard(event.target.files[0])
  // }

  // const handlePanChange = (event: any = true) => {
  //   setPanCard(event.target.files[0])
  // }

  //api call to upload files
  // const uploadAgentFiles = async () => {
  //   // Getting the token
  //   const varToken = localStorage.getItem('token')
  //   console.log(varToken)

  //   // Creating an object to store the files
  //   const formData = new FormData()
  //   formData.append('profiePicture', profilePicture)
  //   formData.append('aadharCard', aadharCard)
  //   formData.append('panCard', panCard)

  //   // Calling the api for the upload files = agent/account_files/upload-file
  //   const id = location.state
  //   try {
  //     const result = await api.post(
  //       UPLOAD_FILES,
  //       {appAgentId: id, formData},
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           genie_access_token: 'Bearer ' + varToken,
  //         },
  //       }
  //     )
  //     console.log(result.data)
  //   } catch (error) {
  //     console.log('Error while uploading the file: ', error)
  //   }
  // }

  //delete file function

  //delete file function

  async function delete_file(file: any) {
    const id = location.state
    const varToken = localStorage.getItem('token')
    try {
      const result = await api.post(
        DELETE_FILE,
        {
          appAgentId: id,
        },
        {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  //api call to update files
  async function update_file(file: any) {
    const id = location.state
    const varToken = localStorage.getItem('token')
    try {
      const result = await api.post(
        UPDATE_FILE,
        {
          appAgentId: id,
        },
        {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  //api call to get all files
  const location = useLocation()
  useEffect(() => {
    ;(async () => {
      const id = location.state
      await load_files(id)
    })()
  }, [location.state])

  async function load_files(id: any) {
    //function
    const varToken = localStorage.getItem('token')
    console.log(id)
    try {
      const result = await api.post(
        GET_ALL_FILES,
        {
          appAgentId: id,
        },
        {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      console.log(result)
      setProfilePicture(result.data.data.appAgentFiles.profile_picture)
      setPanCardNumber(result.data.data.appAgentFiles.pan_card_number)
      setPanCard(result.data.data.appAgentFiles.pan_card_file)
      setAadharCardNumber(result.data.data.appAgentFiles.aadhar_card_number)
      setAadharCard(result.data.data.appAgentFiles.aadhar_card_file)
      setOtherFiles(result.data.data.appAgentFiles.otherFiles)
      if (result.status === 200) {
        console.log(result.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function preview_file(file: any) {
    const id = location.state
    window.open(`http://localhost:5500/${id}/documents/${file}`, '_blank')
  }
  console.log(profilePicture)
  console.log(aadharCard)
  console.log(panCard)
  console.log(aadharCardNumber)
  console.log(panCardNumber)
  return (
    <div style={{display: 'grid'}}>
      {/* info card 01 */}
      <div className='card shadow' style={{width: '100%', margin: '0 auto'}}>
        <div className='card-body'>
          <div style={{display: 'flex'}}>
            <div style={{flex: '1'}}>
              <h1 style={{color: 'darkorange'}} className='card-title'>
                Profile Section
              </h1>
            </div>
          </div>

          <div style={{display: 'flex'}}>
            <div style={{flex: '1'}}>
              <div className='form-group'>
                <label
                  htmlFor='firstName'
                  style={{
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: 'blue',
                    fontSize: '1.2em',
                  }}
                >
                  Aaadhar Number:
                </label>
                <span style={{marginLeft: '8px', fontSize: '1.2em'}}></span>
              </div>

              <div className='form-group' style={{marginTop: '20px'}}>
                <label
                  htmlFor='lastName'
                  style={{
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: 'blue',
                    fontSize: '1.2em',
                  }}
                >
                  Pan Number:
                </label>
                <span style={{marginLeft: '8px', fontSize: '1.2em'}}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      {/* file card 02 */}
      <div className='card shadow' style={{width: '100%', margin: '0 auto'}}>
        <div className='card-body'>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h1 style={{color: 'darkorange'}} className='card-title'>
              Employee Files
            </h1>
            <button
              onClick={() => {
                FilemodalFunction(true)
              }}
              className='btn btn-primary btn-sm'
            >
              Upload Files
            </button>
          </div>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '15px',
            }}
          >
            <thead>
              <br />
              <tr>
                <th scope='col'>Serial Number</th>
                <th scope='col'>File Type</th>
                <th scope='col'>File Names</th>
                <th scope='col'></th>
                <th style={{textAlign: 'center'}} scope='col'>
                  Actions
                </th>
              </tr>
            </thead>
            <br />

            <tbody>
              {/* profile picture row */}
              <tr>
                <td>1.</td>
                <td>Profile Photo</td>
                <td>{profilePicture.original_name}</td>
                <td>
                  <button
                    onClick={() => {
                      delete_file(profilePicture._id)
                    }}
                    className='btn'
                    style={{color: 'red'}}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    type='button'
                    className='btn'
                    onClick={() => {
                      const fileInput = document.createElement('input')
                      fileInput.type = 'file'
                      fileInput.onchange = (event: any) => {
                        const files = event.target.files
                        // update_file(files, file._id)
                      }
                      fileInput.click()
                    }}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    type='button'
                    className='btn'
                    onClick={() => {
                      preview_file(profilePicture.name)
                    }}
                  >
                    Preview
                  </button>
                </td>
              </tr>
              {/* aadhar number  */}
              <tr>
                <td>2.</td>
                <td>Aadhar Number</td>
                <td>{aadharCard.original_name}</td>
                <td>
                  <button
                    onClick={() => {
                      delete_file(aadharCard._id)
                    }}
                    className='btn'
                    style={{color: 'red'}}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    type='button'
                    className='btn'
                    onClick={() => {
                      const fileInput = document.createElement('input')
                      fileInput.type = 'file'
                      fileInput.onchange = (event: any) => {
                        const files = event.target.files
                        // update_file(files, file._id)
                      }
                      fileInput.click()
                    }}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    type='button'
                    className='btn'
                    onClick={() => {
                      preview_file(aadharCard.name)
                    }}
                  >
                    Preview
                  </button>
                </td>
              </tr>
              {/* pan card */}
              <tr>
                <td>2.</td>
                <td>Pan Card</td>
                <td>{panCard.original_name}</td>
                <td>
                  <button
                    onClick={() => {
                      delete_file(panCard._id)
                    }}
                    className='btn'
                    style={{color: 'red'}}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    type='button'
                    className='btn'
                    onClick={() => {
                      const fileInput = document.createElement('input')
                      fileInput.type = 'file'
                      fileInput.onchange = (event: any) => {
                        const files = event.target.files
                        // update_file(files, file._id)
                      }
                      fileInput.click()
                    }}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    type='button'
                    className='btn'
                    onClick={() => {
                      preview_file(panCard.name)
                    }}
                  >
                    Preview
                  </button>
                </td>
              </tr>
              {/* other files */}
              {otherFiles.map((file: any, index: any) => {
                return (
                  <tr key={index}>
                    <td>{index + 3}</td>
                    <td>Other Files</td>
                    <td>{file.original_name}</td>
                    <td>
                      <button
                        onClick={() => {
                          delete_file(file._id)
                        }}
                        className='btn'
                        style={{color: 'red'}}
                      >
                        Delete
                      </button>
                    </td>
                    <td>
                      <button
                        type='button'
                        className='btn'
                        onClick={() => {
                          const fileInput = document.createElement('input')
                          fileInput.type = 'file'
                          fileInput.onchange = (event: any) => {
                            const files = event.target.files
                            // update_file(files, file._id)
                          }
                          fileInput.click()
                        }}
                      >
                        Update
                      </button>
                    </td>
                    <td>
                      <button
                        type='button'
                        className='btn'
                        onClick={() => {
                          preview_file(profilePicture.name)
                        }}
                      >
                        Preview
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default EmployeeFiles
