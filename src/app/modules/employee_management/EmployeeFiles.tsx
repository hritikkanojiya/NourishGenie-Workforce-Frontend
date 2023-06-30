import React, {useEffect, useState} from 'react'
import api from '../RequestConfig'
import {useLocation} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'
import {UploadFileContext} from './FilesContext'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faTrashRestoreAlt} from '@fortawesome/free-solid-svg-icons'
import {faEye} from '@fortawesome/free-solid-svg-icons'
import {faBan} from '@fortawesome/free-solid-svg-icons'
import {faUpload} from '@fortawesome/free-solid-svg-icons'
import {faPencilAlt} from '@fortawesome/free-solid-svg-icons'
const API_URL = process.env.REACT_APP_API_URL
export const GET_ALL_FILES = `${API_URL}/agent/account_files/get-files`
export const DELETE_FILE = `${API_URL}/agent/account_files/delete-file`
export const UPDATE_FILE = `${API_URL}/agent/account_files/update-file`
export const UPLOAD_SINGLE = `${API_URL}/agent/account_files/upload-single-file`

function EmployeeFiles() {
  // States to store the files.
  const {
    loadProfilePicture,
    loadAadharNumber,
    loadPanNumber,
    loadAadharCard,
    loadPanCard,
    loadAgentId,
    loadOtherFilesFunction,
  } = React.useContext(UploadFileContext)
  const {profilePicture, aadharNumber, panNumber, aadharCard, panCard, otherFiles} =
    React.useContext(UploadFileContext)
  const [loading, setLoading] = useState<boolean>(false)
  const {FilemodalFunction} = React.useContext(UploadFileContext)

  async function delete_file(file_name: string, file_id: string) {
    const varToken = localStorage.getItem('token')
    let query: any = {}
    if (file_name === 'profile_pictureId') {
      query = {
        profile_pictureId: file_id,
      }
    } else if (file_name === 'aadhar_cardId') {
      query = {
        aadhar_cardId: file_id,
      }
    } else if (file_name === 'pan_cardId') {
      query = {
        pan_cardId: file_id,
      }
    } else if (file_name === 'otherFilesId') {
      query = {
        otherFilesId: file_id,
      }
    }
    setLoading(true)
    try {
      console.log(file_name, file_id)
      const result = await api.post(DELETE_FILE, query, {
        headers: {
          genie_access_token: 'Bearer ' + varToken,
        },
      })
      console.log(result.data)
      if (result.data.error === false) {
        const id = location.state
        load_files(id)
        alert('file deleted successfully.')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  //api call to update files

  async function update_file(file: any, file_id: any, field_name: string) {
    const id: any = location.state
    const formData = new FormData()
    formData.append('appAgentId', id)

    formData.append(field_name, file_id)
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
    setLoading(true)
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
        load_files(id)
        alert('file updated successfully.')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  //api call to update single file
  async function update_single_file(file: any, file_id: any, field_name: string) {
    const id: any = location.state
    const formData = new FormData()
    formData.append('appAgentId', id)

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
    setLoading(true)
    try {
      const result = await api.post(
        UPLOAD_SINGLE,
        formData,

        {
          headers: {
            genie_access_token: 'Bearer ' + varToken,
          },
        }
      )
      console.log(result.data)
      if (result.data.error === false) {
        load_files(id)
        alert('file updated successfully.')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  //api call to get all files
  const location = useLocation()
  loadAgentId(location.state as any)
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

      if (result.data.error === false) {
        console.log(result.data)
      }
      if (result.data.data.appAgentFiles.length === 0) {
        console.log('no files')
        loadProfilePicture({})
        loadPanCard({})
        loadAadharCard({})
        loadAadharNumber('')
        loadPanNumber('')
        // setPanCardNumber('')
        // setAadharCardNumber('')
        loadOtherFilesFunction([])
      } else {
        loadProfilePicture(result.data.data.appAgentFiles.profile_picture)
        //setPanCardNumber(result.data.data.appAgentFiles.pan_card_number)
        loadPanCard(result.data.data.appAgentFiles.pan_card_file)
        loadAadharNumber(result.data.data.appAgentFiles.aadhar_card_number)
        loadPanNumber(result.data.data.appAgentFiles.pan_card_number)
        //setAadharCardNumber(result.data.data.appAgentFiles.aadhar_card_number)
        loadAadharCard(result.data.data.appAgentFiles.aadhar_card_file)
        loadOtherFilesFunction(result.data.data.appAgentFiles.otherFiles)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function preview_file(file: any) {
    const id = location.state
    window.open(`http://localhost:8000/${id}/documents/${file}`, '_blank')
  }
  console.log(
    aadharCard && aadharCard.original_name ? aadharCard.original_name : 'No Aadhar Card Uploaded'
  )

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
                  <h1 style={{color: 'black'}} className='card-title'>
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
                        fontSize: '1.2em',
                      }}
                    >
                      Aaadhar Number:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em', fontWeight: 'bold'}}>
                      {aadharNumber ? aadharNumber : 'No Aadhar Card Number Uploaded'}
                    </span>
                  </div>

                  <div className='form-group' style={{marginTop: '20px'}}>
                    <label
                      htmlFor='lastName'
                      style={{
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        fontSize: '1.2em',
                      }}
                    >
                      Pan Number:
                    </label>
                    <span style={{marginLeft: '8px', fontSize: '1.2em', fontWeight: 'bold'}}>
                      {panNumber ? panNumber : 'No Pan Card Number Uploaded'}
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
                <h1 style={{color: 'black'}} className='card-title'>
                  Employee Files
                </h1>
                {/* show button only if files are not uploaded */}

                {aadharNumber && !!otherFiles && (
                  <button
                    type='button'
                    className='btn btn-primary btn-sm'
                    onClick={() => {
                      const fileInput = document.createElement('input')
                      fileInput.type = 'file'
                      fileInput.onchange = (event: any) => {
                        const files = event.target.files
                        update_single_file(files[0], aadharCard._id, 'otherFilesId')
                      }
                      fileInput.click()
                    }}
                  >
                    Upload Other Files
                  </button>
                )}

                {!aadharNumber && (
                  <button
                    onClick={() => {
                      FilemodalFunction(true)
                    }}
                    className='btn btn-primary btn-sm'
                  >
                    <FontAwesomeIcon icon={faUpload} size='1x' color='black' />
                  </button>
                )}
              </div>

              <table
                id='kt_table_users'
                className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '15px',
                }}
              >
                <thead>
                  <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                    <th scope='col'>Serial Number</th>
                    <th scope='col'>File Type</th>
                    <th scope='col'>File Names</th>
                    <th scope='col'>Delete</th>
                    <th style={{textAlign: 'center'}} scope='col'>
                      Update/Upload
                    </th>
                    <th style={{textAlign: 'right'}} scope='col'>
                      Preview
                    </th>
                  </tr>
                </thead>

                <tbody className='text-gray-600 fw-bold'>
                  {/* profile picture row */}
                  <tr>
                    <td>1.</td>
                    <td>Profile Photo</td>
                    <td>
                      {profilePicture &&
                      profilePicture.original_name &&
                      profilePicture.isDeleted === false
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
                        {profilePicture.isDeleted === false ? (
                          <FontAwesomeIcon icon={faTrash} size='1x' color='black' />
                        ) : (
                          <FontAwesomeIcon icon={faBan} size='1x' color='gray' />
                        )}
                      </button>
                    </td>
                    <td style={{textAlign: 'center'}}>
                      {profilePicture.isDeleted === false && (
                        <button
                          type='button'
                          className='btn'
                          onClick={() => {
                            const fileInput = document.createElement('input')
                            fileInput.type = 'file'
                            fileInput.onchange = (event: any) => {
                              const files = event.target.files
                              update_file(files[0], profilePicture._id, 'profile_pictureId')
                            }
                            fileInput.click()
                          }}
                        >
                          <FontAwesomeIcon icon={faPencilAlt} size='1x' color='black' />
                        </button>
                      )}
                      {profilePicture.isDeleted === true && (
                        <button
                          type='button'
                          className='btn'
                          onClick={() => {
                            const fileInput = document.createElement('input')
                            fileInput.type = 'file'
                            fileInput.onchange = (event: any) => {
                              const files = event.target.files
                              update_single_file(files[0], profilePicture._id, 'profile_pictureId')
                            }
                            fileInput.click()
                          }}
                        >
                          <FontAwesomeIcon icon={faUpload} size='1x' color='black' />
                        </button>
                      )}
                      {Object.keys(profilePicture).length === 0 && (
                        <button type='button' className='btn'>
                          <FontAwesomeIcon icon={faBan} size='1x' color='gray' />
                        </button>
                      )}
                    </td>
                    <td style={{textAlign: 'right'}}>
                      <button
                        type='button'
                        className='btn'
                        onClick={() => {
                          preview_file(profilePicture.name)
                        }}
                      >
                        {profilePicture.isDeleted === false ? (
                          <FontAwesomeIcon icon={faEye} size='1x' color='black' />
                        ) : (
                          <FontAwesomeIcon icon={faBan} size='1x' color='gray' />
                        )}
                      </button>
                    </td>
                  </tr>
                  {/* aadhar card  */}
                  <tr>
                    <td>2.</td>
                    <td>Aadhar Card</td>
                    <td>
                      {aadharCard && aadharCard.original_name && aadharCard.isDeleted === false
                        ? aadharCard.original_name
                        : 'No Aadhar Card Uploaded'}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          delete_file('aadhar_cardId', aadharCard._id)
                        }}
                        className='btn'
                        style={{color: 'red'}}
                      >
                        {aadharCard.isDeleted === false ? (
                          <FontAwesomeIcon icon={faTrash} size='1x' color='black' />
                        ) : (
                          <FontAwesomeIcon icon={faBan} size='1x' color='gray' />
                        )}
                      </button>
                    </td>
                    <td style={{textAlign: 'center'}}>
                      {aadharCard.isDeleted === false && (
                        <button
                          type='button'
                          className='btn'
                          onClick={() => {
                            const fileInput = document.createElement('input')
                            fileInput.type = 'file'
                            fileInput.onchange = (event: any) => {
                              const files = event.target.files
                              update_file(files[0], aadharCard._id, 'aadhar_cardId')
                            }
                            fileInput.click()
                          }}
                        >
                          <FontAwesomeIcon icon={faPencilAlt} size='1x' color='black' />
                        </button>
                      )}
                      {aadharCard.isDeleted === true && (
                        <button
                          type='button'
                          className='btn'
                          onClick={() => {
                            const fileInput = document.createElement('input')
                            fileInput.type = 'file'
                            fileInput.onchange = (event: any) => {
                              const files = event.target.files
                              update_single_file(files[0], aadharCard._id, 'aadhar_cardId')
                            }
                            fileInput.click()
                          }}
                        >
                          <FontAwesomeIcon icon={faUpload} size='1x' color='black' />
                        </button>
                      )}
                      {Object.keys(aadharCard).length === 0 && (
                        <button type='button' className='btn'>
                          <FontAwesomeIcon icon={faBan} size='1x' color='gray' />
                        </button>
                      )}
                    </td>
                    <td style={{textAlign: 'right'}}>
                      <button
                        type='button'
                        className='btn'
                        onClick={() => {
                          preview_file(aadharCard.name)
                        }}
                      >
                        {aadharCard.isDeleted === false ? (
                          <FontAwesomeIcon icon={faEye} size='1x' color='black' />
                        ) : (
                          <FontAwesomeIcon icon={faBan} size='1x' color='gray' />
                        )}
                      </button>
                    </td>
                  </tr>
                  {/* pan card */}
                  <tr>
                    <td>3.</td>
                    <td>Pan Card</td>
                    <td>
                      {panCard && panCard.original_name && panCard.isDeleted === false
                        ? panCard.original_name
                        : 'No Pan Card Uploaded'}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          delete_file('pan_cardId', panCard._id)
                        }}
                        className='btn'
                        style={{color: 'red'}}
                      >
                        {panCard.isDeleted === false ? (
                          <FontAwesomeIcon icon={faTrash} size='1x' color='black' />
                        ) : (
                          <FontAwesomeIcon icon={faBan} size='1x' color='gray' />
                        )}
                      </button>
                    </td>
                    <td style={{textAlign: 'center'}}>
                      {panCard.isDeleted === false && (
                        <button
                          type='button'
                          className='btn'
                          onClick={() => {
                            const fileInput = document.createElement('input')
                            fileInput.type = 'file'
                            fileInput.onchange = (event: any) => {
                              const file = event.target.files
                              update_file(file[0], panCard._id, 'pan_cardId')
                            }
                            fileInput.click()
                          }}
                        >
                          <FontAwesomeIcon icon={faPencilAlt} size='1x' color='black' />
                        </button>
                      )}
                      {panCard.isDeleted === true && (
                        <button
                          type='button'
                          className='btn'
                          onClick={() => {
                            const fileInput = document.createElement('input')
                            fileInput.type = 'file'
                            fileInput.onchange = (event: any) => {
                              const file = event.target.files
                              update_single_file(file[0], panCard._id, 'pan_cardId')
                            }
                            fileInput.click()
                          }}
                        >
                          <FontAwesomeIcon icon={faUpload} size='1x' color='black' />
                        </button>
                      )}
                      {Object.keys(panCard).length === 0 && (
                        <button type='button' className='btn'>
                          <FontAwesomeIcon icon={faBan} size='1x' color='gray' />
                        </button>
                      )}
                    </td>
                    <td style={{textAlign: 'right'}}>
                      <button
                        type='button'
                        className='btn'
                        onClick={() => {
                          preview_file(panCard.name)
                        }}
                      >
                        {panCard.isDeleted === false ? (
                          <FontAwesomeIcon icon={faEye} size='1x' color='black' />
                        ) : (
                          <FontAwesomeIcon icon={faBan} size='1x' color='gray' />
                        )}
                      </button>
                    </td>
                  </tr>
                  {/* other files */}
                  {otherFiles.map((file: any, index: any) => {
                    return (
                      <tr key={index}>
                        <td>{index + 4}</td>
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
                            <FontAwesomeIcon icon={faTrash} size='1x' color='black' />
                          </button>
                        </td>
                        <td style={{textAlign: 'center'}}>
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
                            {file.isDeleted !== undefined ? (
                              <FontAwesomeIcon icon={faPencilAlt} size='1x' color='black' />
                            ) : (
                              <FontAwesomeIcon icon={faUpload} size='1x' color='black' />
                            )}
                          </button>
                          {Object.keys(otherFiles).length === 0 && (
                            <button type='button' className='btn'>
                              <FontAwesomeIcon icon={faBan} size='1x' color='gray' />
                            </button>
                          )}
                        </td>
                        <td style={{textAlign: 'right'}}>
                          <button
                            type='button'
                            className='btn'
                            onClick={() => {
                              preview_file(`otherFiles/${file.name}`)
                            }}
                          >
                            {file.isDeleted === false ? (
                              <FontAwesomeIcon icon={faEye} size='1x' color='black' />
                            ) : (
                              <FontAwesomeIcon icon={faBan} size='1x' color='gray' />
                            )}
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
