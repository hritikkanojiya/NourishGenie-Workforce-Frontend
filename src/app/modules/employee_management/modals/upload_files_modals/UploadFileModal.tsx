import React, {useContext, useState} from 'react'
import {useFormik} from 'formik'
import api from '../../../RequestConfig'
import * as Yup from 'yup'
import {useLocation} from 'react-router-dom'
import {Button} from 'react-bootstrap'

const API_URL = process.env.REACT_APP_API_URL
export const UPLOAD_FILES = `${API_URL}/agent/account_files/upload-file`

// const fileValidationSchema = Yup.object().shape({
//   //validation for the inputs that we take from user using Yup
// })

// Schema for the form
const validationSchema = Yup.object().shape({
  aadharNumber: Yup.string().required('Aadhar number is required'),
  panNumber: Yup.string().required('PAN number is required'),
  aadharCardFile: Yup.mixed().required('Aadhar card file is required'),
  panCardFile: Yup.mixed().required('PAN card file is required'),
  profilePicture: Yup.mixed().required('Profile picture is required'),
  otherFiles: Yup.array().of(
    Yup.mixed().test(
      'fileType',
      'Invalid file type',
      (value) =>
        value &&
        [
          'application/pdf',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/csv',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(value.type)
    )
  ),
})

const UploadFileModal = () => {
  const location = useLocation()
  const [aadharNumber, setAadharNumber] = useState('')
  const [panNumber, setPanNumber] = useState('')
  const [aadharFile, setAadharFile] = useState<any>([])
  const [panFile, setPanFile] = useState<any>([])
  const [documentFiles, setDocumentFiles] = useState<any>([])

  // Handlers for files change
  // const handleAadharNumberChange = (e: any = true) => {
  //   setAadharNumber(e.target.value)
  // }

  // const handlePanNumberChange = (e: any = true) => {
  //   setPanNumber(e.target.value)
  // }

  // const handleAadharFileChange = (e: any = true) => {
  //   const file = e.target.files[0]
  //   setAadharFile(file)
  // }

  // const handlePanFileChange = (e: any = true) => {
  //   const file = e.target.files[0]
  //   setPanFile(file)
  // }

  // const handleDocumentFilesChange = (e: any = true) => {
  //   const files = Array.from(e.target.files)
  //   const filteredFiles = files.filter((file: any = true) => {
  //     const fileType = file.type.split('/')[0]
  //     return fileType !== 'audio' && fileType !== 'video'
  //   })

  //   if (filteredFiles.length + documentFiles.length > 5) {
  //     // Show error message that max 5 files can be uploaded
  //     return
  //   }

  //   setDocumentFiles([...documentFiles, ...filteredFiles])
  // }

  const formik = useFormik({
    initialValues: {
      aadharNumber: '',
      panNumber: '',
      aadharCardFile: null,
      panCardFile: null,
      profilePicture: null,
      otherFiles: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      //write upload file logic here
      const varToken = localStorage.getItem('token')
      console.log(varToken)
      const formData = new FormData()
      formData.append('aadharNumber', values.aadharNumber)
      formData.append('panNumber', values.panNumber)
      values.otherFiles.forEach((file, index) => {
        formData.append(`otherFiles[${index}]`, file) // Assuming file is a File object
      })

      // Calling the api for the upload files = agent/account_files/upload-file
      const id = location.state
      try {
        const result = await api.post(
          UPLOAD_FILES,
          {appAgentId: id, formData},
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              genie_access_token: 'Bearer ' + varToken,
            },
          }
        )
        console.log(result.data)
      } catch (error) {
        console.log('Error while uploading the file: ', error)
      }
    },
  })
  const handleFileChange = (field: any, event: any) => {
    formik.setFieldValue(field, event.currentTarget.files[0])
  }

  return (
    <div>
      <h6>Upload File</h6>
      {/* create an upload form where you will be taking aadhar number, pan number, aadhar file, pan file 
      and in the other documents part maximum 5 files can be uploaded of any file type expect audio and video */}
      <form onSubmit={formik.handleSubmit} className='my-form form-label-right'>
        <div className='form-group row'>
          <label style={{color: 'blue'}} htmlFor='profilePicture' className='col-2 col-form-label'>
            Profile Picture
          </label>
          <div className='col-10'>
            <input
              id='profilePicture'
              type='file'
              style={{width: '100%'}}
              accept='image/jpeg, image/png'
              className='form-control-file'
              onChange={(event) => handleFileChange('profilePicture', event)}
            />

            <p style={{color: 'orange'}} className='file-info'>
              Upload only in JPG, PNG, JPEG image format
            </p>
          </div>
          {formik.touched.profilePicture && formik.errors.profilePicture ? (
            <div className='text-danger'>{formik.errors.profilePicture}</div>
          ) : null}
        </div>
        <br />
        <div className='form-group row'>
          <label style={{color: 'blue'}} htmlFor='aadharNumber' className='col-2 col-form-label'>
            Aadhar Number
          </label>
          <div className='col-10'>
            <input
              id='aadharNumber'
              type='text'
              style={{width: '100%'}}
              className='form-control'
              {...formik.getFieldProps('aadharNumber')}
            />
          </div>
          {formik.touched.aadharNumber && formik.errors.aadharNumber ? (
            <div className='text-danger'>{formik.errors.aadharNumber}</div>
          ) : null}
        </div>
        <br />
        <div className='form-group row'>
          <label style={{color: 'blue'}} htmlFor='panNumber' className='col-2 col-form-label'>
            PAN Number
          </label>
          <div className='col-10'>
            <input
              id='panNumber'
              type='text'
              style={{width: '100%'}}
              className='form-control'
              {...formik.getFieldProps('panNumber')}
            />
          </div>
          {formik.touched.panNumber && formik.errors.panNumber ? (
            <div className='text-danger'>{formik.errors.panNumber}</div>
          ) : null}
        </div>
        <br />

        <div className='form-group row'>
          <label style={{color: 'blue'}} htmlFor='aadharCardFile' className='col-2 col-form-label'>
            Aadhar Card File
          </label>
          <div className='col-10'>
            <input
              id='aadharCardFile'
              type='file'
              style={{width: '100%'}}
              accept='application/pdf'
              className='form-control-file'
              onChange={(event) => handleFileChange('aadharCardFile', event)}
            />

            <p style={{color: 'orange'}} className='file-info'>
              Upload only in PDF format
            </p>
          </div>
          {formik.touched.aadharCardFile && formik.errors.aadharCardFile ? (
            <div className='text-danger'>{formik.errors.aadharCardFile}</div>
          ) : null}
        </div>
        <br />
        <div className='form-group row'>
          <label style={{color: 'blue'}} htmlFor='panCardFile' className='col-2 col-form-label'>
            Pan Card File
          </label>
          <div className='col-10'>
            <input
              id='panCardFile'
              type='file'
              accept='application/pdf'
              className='form-control-file'
              onChange={(event) => handleFileChange('panCardFile', event)}
            />

            <p style={{color: 'orange'}} className='file-info'>
              Upload only in PDF format
            </p>
          </div>
          {formik.touched.panCardFile && formik.errors.panCardFile ? (
            <div className='text-danger'>{formik.errors.panCardFile}</div>
          ) : null}
        </div>
        <br />
        <div className='form-group row'>
          <label style={{color: 'blue'}} htmlFor='otherFiles' className='col-2 col-form-label'>
            Other Files
          </label>
          <div className='col-10'>
            <input
              id='otherFiles'
              type='file'
              multiple
              style={{border: 'none'}}
              accept='application/pdf, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              className='form-control-file'
              onChange={(event) => handleFileChange('otherFiles', event)}
            />

            <p style={{color: 'orange'}} className='file-info'>
              Upload only in PDF, PPT, XLSX, CSV, DOCX format
            </p>
          </div>
          {formik.touched.otherFiles && formik.errors.otherFiles ? (
            <div className='text-danger'>{formik.errors.otherFiles}</div>
          ) : null}
        </div>
        <br />
        <div className='form-group row'>
          <div className='offset-2 col-10 d-flex justify-content-center'>
            <Button type='submit' variant='primary'>
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default UploadFileModal
