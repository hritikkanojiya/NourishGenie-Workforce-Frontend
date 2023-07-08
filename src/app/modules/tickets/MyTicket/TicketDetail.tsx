
import React, { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx';
import {Dropdown, Spinner} from 'react-bootstrap'
import {
    ticket_detail
    } from './modals/my_ticket';
    const API_URL = process.env.REACT_APP_API_URL;
const FormData = require("form-data");

const TicketDetail = (props: { _ticketdetail: ticket_detail }) => {

    const [show_file, setShow_file] = useState(false);
    const [isLoading, setIsLoading] = React.useState(false)
    const getfilename = async () => {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/ticketroutes/get_file_name`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                attachements: props._ticketdetail.attachements
            })
        });
        const json = await response.json();
        props._ticketdetail.attachements = json.file_name_array;
        setIsLoading(false);
        setShow_file(true);
    }

    const close_show_file = () => {
        setShow_file(false);
    }

    useEffect(() => {
        // viewTicketDetail();
    }, [])
    return (        
        <div className="modal fade my-5" tabIndex={-1} id="kt_modal_4">
            <div className="modal-dialog">
                <div className="modal-content" style={{ width: "750px" }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Ticket Detail</h5>
                        <div
                            className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        >
                            <RxCross2 onClick={close_show_file} style={{ width: "20px", height: "20px" }} />
                        </div>
                    </div>
                    <div className="modal-body">
                        <div>
                            <div className="card">
                                <div className="card-body">
                                    {/* ------------- */}
                                    <div className='card-body p-9'>
                                        <div className='row mb-7'>
                                            <label className='col-lg-4 fw-bold text-muted' onClick={() => { console.log(props, "_ticketdetail") }}>Subject</label>

                                            <div className='col-lg-8'>
                                                <span className='fw-bolder fs-6 text-dark'>{props._ticketdetail.subject}</span>
                                            </div>
                                        </div>

                                        <div className='row mb-7'>
                                            <label className='col-lg-4 fw-bold text-muted'>Content</label>

                                            <div className='col-lg-8 fv-row'>
                                                <span className='fw-bold fs-6'>{props._ticketdetail.content}</span>
                                            </div>
                                        </div>

                                        <div className='row mb-7'>
                                            <label className='col-lg-4 fw-bold text-muted'>
                                                Priority
                                            </label>

                                            <div className='col-lg-8 d-flex align-items-center'>

                                                <span className='fw-bolder fs-6 me-2'>{props._ticketdetail.priority}
                                                </span>

                                                {/* <span className='badge badge-success'>Verified</span> */}
                                            </div>
                                        </div>

                                        <div className='row mb-7'>
                                            <label className='col-lg-4 fw-bold text-muted'>
                                                Status
                                            </label>

                                            <div className='col-lg-8'>
                                                <span className='fw-bolder fs-6 text-dark'>{props._ticketdetail.status}</span>
                                            </div>
                                        </div>

                                        <div className='row mb-7'>
                                            <label className='col-lg-4 fw-bold text-muted my-3'>
                                                Attachements -
                                            </label>

                                            <div className='col-lg-8'>
                                                <button
                                                    type="button"
                                                    onClick={getfilename}
                                                    className="btn btn-success"
                                                >
                                                    Click Here
                                                </button>
                                            </div>
                                        </div>
                                        {isLoading ?
                                            (<div className='d-flex align-items-center justify-content-center loader-container'>
                                            <Spinner animation='border' variant='primary' />
                                            </div>)
                                         : 
                                        (<>
                                        {show_file && <span className='fw-bolder fs-6 text-dark my-5'>{props._ticketdetail.attachements?.map((file, index) =>
                                            <p>{index + 1}- [{file}] </p>
                                        )}</span>}
                                        {!props._ticketdetail.attachements && <span className='fw-bolder fs-6 text-dark my-5'>No File Present</span>}</>)}
                                    </div>
                                    {/* ------------- */}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                                onClick={close_show_file}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default TicketDetail

