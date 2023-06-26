import {useFormik} from 'formik'
import api from '../../../RequestConfig'
import * as Yup from 'yup'
import {Button} from 'react-bootstrap'
import {useLocation} from 'react-router-dom'
import {useContext} from 'react'
import {UploadFileContext} from '../../FilesContext'

const API_URL = process.env.REACT_APP_API_URL
export const GET_ALL_FILES = `${API_URL}/agent/account_files/get-files`
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
  otherFiles: Yup.array()
    .nullable()
    .max(5, 'You can upload a maximum of 5 files')
    .test('fileFormat', 'Invalid file format', (value) => {
      if (value && value.length > 0) {
        const allowedFormats = [
          'application/pdf',
          'application/msword',
          'application/vnd.ms-powerpoint',
          'application/vnd.ms-excel',
          'text/csv',
        ]

        for (let i = 0; i < value.length; i++) {
          const file = value[i]
          if (!allowedFormats.includes(file.type)) {
            return false
          }
        }
      }
      return true // Allow empty field if required
    })
    .test('fileSize', 'File size exceeds the limit', (value) => {
      if (value && value.length > 0) {
        const maxSizeInBytes = 25 * 1024 * 1024 // 25 MB

        for (let i = 0; i < value.length; i++) {
          const file = value[i]
          if (file.size > maxSizeInBytes) {
            return false
          }
        }
      }
      return true // Allow empty field if required
    }),
})

const UploadFileModal = () => {
  const location = useLocation()
  const {agentId} = useContext(UploadFileContext)
  const {
    loadProfilePicture,
    FilemodalFunction,
    loadAadharCard,
    loadPanNumber,
    loadAadharNumber,
    loadPanCard,
    loadOtherFilesFunction,
  } = useContext(UploadFileContext)
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
      const varToken = localStorage.getItem('token')
      console.log(values)
      const formData = new FormData()
      formData.append('appAgentId', agentId)
      formData.append('aadhar_number', values.aadharNumber)
      formData.append('pan_number', values.panNumber)
      if (values.aadharCardFile !== null) {
        formData.append('aadhar_card', values.aadharCardFile)
      }
      if (values.panCardFile !== null) {
        formData.append('pan_card', values.panCardFile)
      }
      if (values.profilePicture !== null) {
        formData.append('profile_picture', values.profilePicture)
      }
      for (let index = 0; index < values.otherFiles.length; index++) {
        const file = values.otherFiles[index]
        if (file !== null) {
          formData.append(`otherFiles`, file) // Assuming file is a File object
        }
      }
      // Log the files in the formData
      const entries = formData.entries()
      let entry = entries.next()
      while (!entry.done) {
        const [key, value] = entry.value
        if (value instanceof File) {
          console.log(`${key}:`, value)
        }
        entry = entries.next()
      }

      try {
        const result = await api.post(UPLOAD_FILES, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            genie_access_token: 'Bearer ' + varToken,
          },
        })
        console.log(result.data)
        if (result.data.error === false) {
          console.log('files uploaded successfully')
          load_files()
          alert('Files uploaded successfully.')
          FilemodalFunction(false)
        }
      } catch (error) {
        console.log('Error while uploading the file: ', error)
      }
    },
  })
  const handleFileChange = (field: any, event: any) => {
    formik.setFieldValue(field, event.currentTarget.files[0])
  }

  async function load_files() {
    //function
    //setLoading(true)
    const varToken = localStorage.getItem('token')
    console.log(agentId)
    try {
      const result = await api.post(
        GET_ALL_FILES,
        {
          appAgentId: agentId,
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
      if (result.data.data.appAgentFiles === null) {
        console.log('no files')
        loadProfilePicture({})
        loadPanCard({})
        loadPanNumber('')
        loadAadharNumber('')
        loadAadharCard({})
        loadOtherFilesFunction([])
      } else {
        loadProfilePicture(result.data.data.appAgentFiles.profile_picture)
        loadAadharNumber(result.data.data.appAgentFiles.aadhar_card_number)
        loadPanNumber(result.data.data.appAgentFiles.pan_card_number)
        loadPanCard(result.data.data.appAgentFiles.pan_card_file)
        loadAadharCard(result.data.data.appAgentFiles.aadhar_card_file)
        loadOtherFilesFunction(result.data.data.appAgentFiles.otherFiles)
      }
    } catch (error) {
      console.log(error)
    }
    // } finally {
    //   setLoading(false)
    // }
  }

  const handleMultipleFileChange = (field: any, event: any) => {
    console.log(event.currentTarget.files)
    formik.setFieldValue(field, event.currentTarget.files)
  }

  return (
    <div>
      <h6>Upload File</h6>
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
              onChange={(event) => handleMultipleFileChange('otherFiles', event)}
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
