
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import axios from "axios";
import { showToast } from "../../common/toastify/toastify.config";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import {
    user_id
    } from './modals/create_ticket';
const API_URL = process.env.REACT_APP_API_URL;
const FormData = require("form-data");

const initialValues = {
    subject: '',
    content: '',
    priority: '',
    category: '',
    status: '',
}

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

const registrationSchema = Yup.object().shape({
    subject: Yup.string()
        .min(3, 'Minimum 3 symbols')
        .max(50, 'Maximum 15 symbols')
        .required('Subject name is required'),
    priority: Yup.string()
        .min(3, 'Minimum 3 symbols')
        .max(50, 'Maximum 50 symbols')
        .required('Priority name is required'),
    category: Yup.string()
        .min(3, 'Minimum 3 symbols')
        .max(50, 'Maximum 50 symbols')
        .required('Category name is required')
})

const CreateNewTicket = (props: user_id) => {

    const navigate = useNavigate();
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (side: any, open: any) => {
        // if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        //   return;
        // }

        setState({ ...state, [side]: open });
    };

    // let userOptions = [{ value: '', label: '' }];
    const [userOptions, setUserOptions] = useState([{ value: "", label: "" }]);
    const [myfile, setMyfile] = useState({ attachFile: { name: '', size: 0 } });
    const [selectedOptions, setSelectedOptions] = useState([{ value: "", label: "" }]);
    const formik = useFormik({
        initialValues,
        validationSchema: registrationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                let response1;
                const formdata = new FormData();

                if (myfile.attachFile.name.length !== 0) {
                    if (Number(myfile.attachFile?.size) > 25000000) {
                        showToast("File size should not exceed 25MB", "error");
                        return;
                    }
                    formdata.append('myfile', myfile.attachFile, myfile.attachFile.name);
                    formdata.append('From', props.loginUserId);
                    let url = `${API_URL}/ticketroutes/upload_file`;
                    try {
                        response1 = await axios.post(url, formdata);
                    }
                    catch (e) {
                        console.log(e, "e");
                    }
                }

                if (selectedOptions.length === 0 || !selectedOptions[0].label) {
                    showToast("Choose one assign user", "error");
                    return;
                }
                let all_send_to = [];
                for (let i = 0; i < selectedOptions.length; i++) {
                    all_send_to.push(selectedOptions[i].value);
                }
                console.log(response1, "response1");
                const response = await fetch(`${API_URL}/ticketroutes/create_ticket`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subject: values.subject,
                        content: values.content,
                        From: props.loginUserId,
                        To: all_send_to,
                        appTicketPriorityId: values.priority,
                        appTicketCategoryId: values.category,
                        file_id: response1?.data?.data?.attachmentDetailId
                    })
                });
                const json = await response.json()
                if (json.message == "success") {
                    toggleDrawer('right', false)
                    window.location.reload();
                    showToast("Ticket Created Successfully", "success");
                }
                else {
                    showToast(`Ticket Creation Failed, ${json.error.message}`, "error");
                }
            } catch (error) {
                console.error(error)
                setSubmitting(false);
            }
        },
    })

    const postUpload = (e: any) => {
        setMyfile({ ...myfile, attachFile: e.target.files[0] });
    }

    const [priority, setPriority] = useState([{ _id: "", name: "" }])
    const [category, setCategory] = useState([{ _id: "", name: "" }])
    const [status, setStatus] = useState([{ _id: "", name: "" }])
    const getAllPriority = async () => {
        const response = await fetch(`${API_URL}/ticketroutes/get_priority`, {
            method: 'Get'
        });
        const json_temp = await response.json()
        const json = json_temp.data;
        let priority_array = [];
        for (let i = 0; i < json.all_priority.length; i++) {
            priority_array.push({ _id: json.all_priority[i]._id, name: json.all_priority[i].name });
        }
        setPriority(priority_array);
    }

    const getAllCategory = async () => {

        const response = await fetch(`${API_URL}/ticketroutes/get_category`, {
            method: 'Get'
        });
        const json_temp = await response.json()
        const json = json_temp.data;
        let category_array = [];
        for (let i = 0; i < json.all_category.length; i++) {
            category_array.push({ _id: json.all_category[i]._id, name: json.all_category[i].name });
        }
        setCategory(category_array);
    }

    const getAllStatus = async () => {

        const response = await fetch(`${API_URL}/ticketroutes/get_status`, {
            method: 'Get'
        });
        const json_temp = await response.json()
        const json = json_temp.data;
        let status_array = [];
        for (let i = 0; i < json.all_status.length; i++) {
            status_array.push({ _id: json.all_status[i]._id, name: json.all_status[i].name });
        }
        setStatus(status_array);
    }

    const getAllUser = async () => {

        const response = await fetch(`${API_URL}/ticketroutes/get_user`, {
            method: 'Get'
        });
        const json = await response.json()
        setUserOptions(json.allUsers);
    }

    const handleSelectChange = (selectedOption: any) => {
        setSelectedOptions(selectedOption);
    };

    const sideList = (side: any) => (
        <div
            className={classes.list}
            style={{ width: "700px" }}
            role="presentation"
        // onClick={() => toggleDrawer(side, false)}
        // onKeyDown={() => toggleDrawer(side, false)}
        >
            {/* <ToastContainer /> */}
            <div style={{ width: "550px", marginLeft: "60px" }}>
                <u><h3 className="mx-2 my-5">Create New Ticket</h3></u>
                <form
                    onSubmit={formik.handleSubmit}
                    id='kt_sign_up_submit'
                    noValidate
                >
                    <div className="mb-10">
                        <label className="required form-label">Subject</label>
                        <input {...formik.getFieldProps('subject')} type="text" id="subject" name="subject" className="form-control" placeholder="Enter Subject" />
                        {formik.touched.subject && formik.errors.subject && (
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert'>{formik.errors.subject}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mb-10">
                        <label className="form-label">Content</label>
                        <textarea {...formik.getFieldProps('content')} id="content" rows={2} name="content" className="form-control border-primary" placeholder="Enter Content"></textarea>
                    </div>
                    {/* end::Form group */}

                    {/* begin::Form group Priority and Category */}
                    <div className='row fv-row mb-38'>
                        <div className='col-xl-6'>
                            <div className="mb-10">
                                <select className="form-select my-3" {...formik.getFieldProps('priority')} name="priority" defaultValue={'DEFAULT'} aria-label="Default select example">
                                    <option value="">Choose Priority</option>
                                    {priority.map(_priority => <option key={_priority._id} value={_priority._id}>{_priority.name}</option>)}
                                </select>
                                {formik.touched.priority && formik.errors.priority && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.priority}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='col-xl-6'>
                            <div className="mb-10">
                                <select className="form-select my-3" {...formik.getFieldProps('category')} name="category" defaultValue={'DEFAULT'} aria-label="Default select example">
                                    <option value="">Choose Category</option>
                                    {category.map(_category => <option key={_category._id} value={_category._id}>{_category.name}</option>)}
                                </select>
                                {formik.touched.category && formik.errors.category && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.category}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* end::Form group */}

                    {/* begin::Form group Status and SendTo */}
                    <div className='row fv-row mb-38 my-5'>
                        <div className='col-xl-6'>
                            <div className="mb-10 my-5">
                                <div className="frame">
                                    <div className="center">
                                        <div className="title">
                                            <h1>Drop file to upload</h1>
                                        </div>

                                        <div className="dropzone">
                                            <p className="my-5">Maximum file Size 25MB</p>
                                            <img src="http://100dayscss.com/codepen/upload.svg" className="upload-icon my-5" />
                                            <input type="file" onChange={postUpload} id="post" name="post" />
                                        </div>

                                        <button type="button" className="btn" name="uploadbutton">Upload file</button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* end::Form group */}

                    {/* begin::Form group Status and SendTo */}
                    <div className="mb-10 my-5">
                        <label className="required form-label">Choose Assign User</label>
                        <Select
                            isMulti
                            name="name"
                            onChange={handleSelectChange}
                            options={userOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </div>
                    {/* end::Form group */}
                    <div className="modal-footer my-5">
                        <button
                            type="button"
                            className="btn btn-danger mx-4"
                            onClick={() => toggleDrawer(side, false)}
                        >
                            Cancel
                        </button>
                        <button id='kt_sign_up_submit' type="submit" className="btn btn-primary">
                            Create Ticket
                        </button>
                    </div>
                </form>

            </div >
        </div >
    );

    useEffect(() => {
        getAllPriority();
        getAllCategory();
        getAllStatus();
        getAllUser();
    }, [])
    return (
        <>
            <Button className="btn btn-sm fw-bold btn-primary" onClick={() => toggleDrawer('right', true)}>Create Ticket</Button>
            <Drawer anchor="right" open={state.right} onClose={() => toggleDrawer('right', false)}>
                {sideList('right')}
            </Drawer>
        </>
    )
}

export default CreateNewTicket


