import React, { useEffect, useState } from 'react'
import Select from 'react-select';
const API_URL = process.env.REACT_APP_API_URL;

interface id_interface {
    sender_id: string | undefined,
    reciever_id: any[],
    setUser: boolean
}

const SendRemainder = (props: { _ids: id_interface }) => {

    const [reciverUserId, setRecieverUserId] = useState("");
    const [userOptions, setUserOptions] = useState([{ value: "", label: "" }]);
    const [message, setMessage] = useState("");


    const sendRemainder = async (e: any) => {
        const response = await fetch(`${API_URL}/ticketroutes/send_remainder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender_id: props._ids.sender_id,
                reciever_id: reciverUserId,
                message: message
            })
        });
        const json = await response.json()
        console.log(json, "remainderJson");
    }

    const getAllUser = async () => {

        const response = await fetch(`http://localhost:3500/v1/ticketroutes/get_user`, {
            method: 'Get'
        });
        const json = await response.json()
        let temp_user = [{ value: "", label: "" }];
        for (let i = 0; i < props._ids.reciever_id.length; i++) {
            for (let j = 0; j < json.all_user.length; j++) {
                if (props._ids.reciever_id[i] === json.all_user[j].value) {
                    temp_user.push({ value: json.all_user[j].value, label: json.all_user[j].label });
                    console.log(props._ids.reciever_id, temp_user, json.all_user, "temp_user")
                }
            }
        }
        console.log(props._ids.reciever_id, temp_user, json.all_user, "temp_user")
        setUserOptions(temp_user);
    }

    const handleSendRemainderChange = (selectedOption: any) => {
        setRecieverUserId(selectedOption.value);
        console.log(selectedOption.value, "myticket");
    };

    const set_message = (e: any) => {
        setMessage(e.target.value);
    }

    useEffect(() => {
        if (props._ids.setUser) {
            getAllUser();
        }
    }, [props._ids.reciever_id])
    return (
        <>
            <div className="modal fade" tabIndex={-1} id="kt_modal_11">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <h5>Are You sure Want To Send Remainder ?</h5>
                            <br />
                            <p className="mx-5" style={{ marginTop: "10px" }}>Remind Message - {message}</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_10"
                                type="button"
                                className="btn btn-light"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button onClick={sendRemainder} type="button" className="btn btn-danger">
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" tabIndex={-1} id="kt_modal_10">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Send Ramainder</h5>
                            <div
                                className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="mb-10">
                                <label className="required form-label my-3">Select Sender User</label>
                                <Select
                                    // defaultValue={alreadyArrayAssingedUser}
                                    // isMulti
                                    name="name"
                                    onChange={handleSendRemainderChange}
                                    options={userOptions}
                                    className="basic-single"
                                    classNamePrefix="select"
                                />
                            </div>
                            <div className="mb-10">
                                <label className="required form-label">Add Description</label>
                                <textarea id="content" rows={1} name="content" onChange={set_message} className="form-control border-primary" placeholder="Enter Description"></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={() => { window.location.reload() }}
                                type="button"
                                className="btn btn-light"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button data-bs-toggle="modal" data-bs-target="#kt_modal_11" type="button" className="btn btn-primary">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SendRemainder