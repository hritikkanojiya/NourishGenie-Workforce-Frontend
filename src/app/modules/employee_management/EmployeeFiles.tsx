import React, {useEffect, useState} from 'react'
import api from '../RequestConfig'
import {useLocation} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'
import {UploadFileContext} from './FilesContext'

const API_URL = process.env.REACT_APP_API_URL
export const GET_ALL_FILES = `${API_URL}/agent/account_files/get-files`
export const DELETE_FILE = `${API_URL}/agent/account_files/delete-file`
export const UPDATE_FILE = `${API_URL}/agent/account_files/update-file`

function EmployeeFiles() {
  // States to store the files.
  const [profilePicture, setProfilePicture] = useState<any>({})
  const [aadharCard, setAadharCard] = useState<any>({})
  const [panCard, setPanCard] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [aadharCardNumber, setAadharCardNumber] = useState<any>('')
  const [panCardNumber, setPanCardNumber] = useState<any>('')
  const [otherFiles, setOtherFiles] = useState<any>([])
  const {FilemodalFunction} = React.useContext(UploadFileContext)

  async function delete_file(file_name: string, file_id: any) {
    const varToken = localStorage.getItem('token')
    try {
      const result = await api.post(
        DELETE_FILE,
        {
          file_name: file_id,
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

  async function update_file(file: any, file_id: any, field_name: string) {
    const id: any = location.state
    const formData = new FormData()
    formData.append('appAgentId', id)
    formData.append(field_name, file_id)
    formData.append('file', file)
    if (field_name === 'profile_pictureId') {
      formData.append('profile_picture', file)
    }
    if (field_name === 'aadhar_cardId') {
      formData.append('aadhar_card', file)
    }
    if (field_name === 'pan_cardId') {
      formData.append('pan_card', file)
    }
    if (field_name === 'otherFilesId') {
      formData.append('otherFiles', file)
    }

    const varToken = localStorage.getItem('token')
    try {
      const result = await api.post(
        UPDATE_FILE,
        formData,

        {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      console.log(result.data)
      if (result.data.error === false) {
        alert('file uploaded successfully.')
      }
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
    setLoading(true)
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
      if (result.data.error === false) {
        console.log(result.data)
      }
      if (result.data.data.appAgentFiles === null) {
        setProfilePicture({})
        setPanCard({})
        setAadharCard({})
        setPanCardNumber('')
        setAadharCardNumber('')
        setOtherFiles([])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function preview_file(file: any) {
    const id = location.state
    window.open(`http://localhost:5500/${id}/documents/${file}`, '_blank')
  }
  return (
    <>
      {loading ? (
        <div className='d-flex align-items-center justify-content-center loader-container'>
          <Spinner animation='border' variant='primary' />
        </div>
      ) : (
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
                    <span style={{marginLeft: '8px', fontSize: '1.2em', fontWeight: 'bold'}}>
                      {aadharCardNumber}
                    </span>
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
                    <span style={{marginLeft: '8px', fontSize: '1.2em', fontWeight: 'bold'}}>
                      {panCardNumber}
                    </span>
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

                <tbody>
                  {/* profile picture row */}
                  <tr>
                    <td>1.</td>
                    <td>Profile Photo</td>
                    <td>
                      {profilePicture
                        ? profilePicture.original_name
                        : 'No Profile Picture Uploaded'}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          delete_file('profile_pictureId', profilePicture._id)
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
                            console.log('hello hrutika')
                            const files = event.target.files
                            update_file(files[0], profilePicture._id, 'profile_pictureId')
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
                    <td>{aadharCard ? aadharCard.original_name : 'No Aadhar Card Uploaded'}</td>
                    <td>
                      <button
                        onClick={() => {
                          delete_file('aadhar_cardId', aadharCard._id)
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
                            console.log('hello')
                            const files = event.target.files
                            update_file(files[0], aadharCard._id, 'aadhar_cardId')
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
                    <td>{panCard ? panCard.original_name : 'No Pan Card Uploaded'}</td>
                    <td>
                      <button
                        onClick={() => {
                          delete_file('pan_cardId', panCard._id)
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
                            console.log('hello')
                            const file = event.target.files
                            update_file(file[0], panCard._id, 'pan_cardId')
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
                              delete_file('otherFilesId', file._id)
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
                                update_file(files[0], file._id, 'otherFilesId')
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
                              preview_file(`otherFiles/${file.name}`)
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
      )}
    </>
  )
}

export default EmployeeFiles