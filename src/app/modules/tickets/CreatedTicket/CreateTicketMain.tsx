import React, { useEffect, useState, useRef } from 'react'
import clsx from "clsx";
import CreateTicket from './CreateNewTicket';
import SendRemainder from './service/SendRemainder';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import { RxCross2 } from 'react-icons/rx';
import { FcHighPriority } from 'react-icons/fc';
import { FcLowPriority } from 'react-icons/fc';
import { FcMediumPriority } from 'react-icons/fc';
import { AiFillCaretDown } from 'react-icons/ai';
import Select from 'react-select';
import CopyToClipboard from "react-copy-to-clipboard";
import { PaginationComponent } from "../../common/components/pagination/PaginationComponent";
import { showToast } from "../../common/toastify/toastify.config";
import { ToastContainer } from "react-toastify";
import { BiRefresh } from 'react-icons/bi';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import api from '../../RequestConfig';
import {
    prev_state, 
    pagination_prev_state
    } from './modals/create_ticket';
import {
    onChangeSortObj,
    sortObj,
} from "../../common/globals/common.constants";
const API_URL = process.env.REACT_APP_API_URL;
const GET_USER_BY_TOKEN = `${API_URL}/agent/auth/getAgentByToken`

const useStyles = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

const Home = () => {

    const classes = useStyles();

    const page = 1;
    const currentPage = 1;
    const [state, setState] = useState<prev_state>({
        appAgents: 0,
        agentsCount: 0,
    });
    const [paginationState, setPaginationState] = useState<pagination_prev_state>({
        itemsPerPage: 10,
        showingFrom: 1,
        showingTill: 10,
        page: page ? page : currentPage,
    });

    const [sortState, setSortState] = useState<sortObj>({
        sortBy: null,
        sortOn: null,
    });

    // const [userId, setUserId] = useState("");
    const userIdRef = useRef("");

    const [idsdetail, setIdsdetail] = useState({
        sender_id: userIdRef.current,
        reciever_id: [],
        setUser: false
    });

    const [currentTicketId, setcurrentTicketId] = useState("");
    const [userOptions, setUserOptions] = useState([{ value: "", label: "" }]);
    const [selectedOptions, setSelectedOptions] = useState([{ value: "", label: "" }]);
    const [sortpriority, setSortpriority] = useState("");
    const [sortstatus, setSortstatus] = useState("");
    const [mappriority, setMappriority] = useState(new Map());
    const [mapstatus, setMapstatus] = useState(new Map());
    const [allreadyusermap, setAllreadyusermap] = useState(new Map());
    const [priority1, setPriority1] = useState([{ _id: "", name: "", color: "" }]);
    const [category1, setCategory1] = useState([{ _id: "", name: "" }]);
    const [status1, setStatus1] = useState([{ _id: "", name: "" }]);
    const [svalue, setSvalue] = useState("");
    const [allticket, setAllTicket] = useState([{ _id: "", subject: "", content: "", To: [], priority: "", category: "", status: "", complete: 0 }])
    const getAllTicket = async (page: number, limit: number, opt = 0) => {

        if (svalue) {
            searchTicket();
            return;
        }
        if ((sortpriority || sortstatus) && opt == 0) {
            sortPriority(page, limit);
            return;
        }

        const response = await fetch(`${API_URL}/ticketroutes/all_ticket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                From: userIdRef.current,
                page: page,
                limit: limit,
                sortOn: sortState.sortOn,
                sortBy: sortState.sortBy
            })
        });
        const json_temp = await response.json()
        const json = json_temp.data;
        const ticket_priority = new Map();
        const ticket_category = new Map();
        const ticket_status = new Map();
        const ticket_priority1 = [];
        const ticket_category1 = [];
        const ticket_status1 = [];
        console.log(json.category_detail, "2");
        console.log(json.priority_detail, "1");
        console.log(json.status_detail, "3");
        for (let i = 0; i < json.priority_detail.length; i++) {
            ticket_priority.set(json.priority_detail[i]._id, [json.priority_detail[i].name, json.priority_detail[i].color]);
            ticket_priority1.push({ _id: json.priority_detail[i]._id, name: json.priority_detail[i].name, color: json.priority_detail[i].color });
        }
        for (let i = 0; i < json.category_detail.length; i++) {
            ticket_category.set(json.category_detail[i]._id, [json.category_detail[i].name, json.category_detail[i].color]);
            ticket_category1.push({ _id: json.category_detail[i]._id, name: json.category_detail[i].name });
        }
        for (let i = 0; i < json.status_detail.length; i++) {
            ticket_status.set(json.status_detail[i]._id, [json.status_detail[i].name, json.status_detail[i].color]);
            ticket_status1.push({ _id: json.status_detail[i]._id, name: json.status_detail[i].name });
        }
        setMappriority(ticket_priority);
        setMapstatus(ticket_status);
        setPriority1(ticket_priority1);
        setCategory1(ticket_category1);
        setStatus1(ticket_status1);

        let totalRecords = json.all_ticket.length;
        setState((previousState: prev_state) => {
            return {
                ...previousState,
                appAgents: showingFrom,
                agentsCount: json.total_ticket,
            };
        });
        let showingFrom = (page - 1) * limit + 1;
        let showingTill: any;
        if (totalRecords) {
            showingTill = Math.min(json.total_ticket, page * limit);
        }
        setPaginationState((previousState: pagination_prev_state) => {
            return {
                ...previousState,
                showingFrom: showingFrom,
                showingTill: showingTill,
            };
        });
        setAllTicket(json.all_ticket);
    }

    const sortPriority = async (page: number, limit: number) => {
        console.log(sortpriority, "sortstatus");
        console.log(sortstatus, "sortstatus");
        const response = await fetch(`${API_URL}/ticketroutes/all_category_ticket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                From: userIdRef.current,
                ticketPriorityId: sortpriority,
                ticketStatusId: sortstatus,
                page: page,
                limit: paginationState.itemsPerPage
            })
        });
        const json_temp = await response.json();
        const json = json_temp.data;
        let totalRecords = json.all_category_ticket.length;
        setState((previousState: prev_state) => {
            return {
                ...previousState,
                appAgents: showingFrom,
                agentsCount: json.total_ticket,
            };
        });
        let showingFrom = json.total_ticket > 0 ? (page - 1) * limit + 1 : 0;
        let showingTill: any;
        if (totalRecords) {
            showingTill = Math.min(json.total_ticket, page * limit);
        }
        setPaginationState((previousState: pagination_prev_state) => {
            return {
                ...previousState,
                showingFrom: showingFrom,
                showingTill: showingTill,
            };
        });
        setAllTicket(json.all_category_ticket);
    }

    const sort_Priority = (e: any) => {
        setSortpriority(e.target.value);
    }

    const sort_Status = (e: any) => {
        setSortstatus(e.target.value);
    }
    const onChange = (e: any) => {
        setSvalue(e.target.value);
    }
    const searchTicket = async () => {
        const response = await fetch(
            `${API_URL}/ticketroutes/all_search_ticket`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    From: userIdRef.current,
                    searchValue: svalue,
                    page: paginationState.page,
                    limit: paginationState.itemsPerPage
                })
            }
        );
        const json_temp = await response.json();
        const json = json_temp.data;
        let totalRecords = json.all_search_ticket.length;
        setState((previousState: prev_state) => {
            return {
                ...previousState,
                appAgents: showingFrom,
                agentsCount: json.total_ticket,
            };
        });
        let showingFrom = (paginationState.page - 1) * paginationState.itemsPerPage + 1;
        let showingTill: any;
        if (totalRecords) {
            showingTill = Math.min(json.total_ticket, paginationState.page * paginationState.itemsPerPage);
        }
        setPaginationState((previousState: pagination_prev_state) => {
            return {
                ...previousState,
                showingFrom: showingFrom,
                showingTill: showingTill,
            };
        });
        setAllTicket(json.all_search_ticket)
    }

    const [currentPriorityId, setCurrentPriorityId] = useState("")
    const valueRef = useRef("");
    const set_current_status = (priority_id: string) => {
        setCurrentPriorityId(priority_id)
        valueRef.current = priority_id
    }
    const updatePriority = async () => {
        const response = await fetch(
            `${API_URL}/ticketroutes/update_priority`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ticket_id: currentTicketId,
                    priorityId: valueRef.current
                })
            }
        );
        const json = await response.json();
        setShowPriorityBar(false);
        getAllTicket(paginationState.page, paginationState.itemsPerPage);
        if(!json.error)
        {
             showToast(`Priority Change Successfully`, "success");
        }
        else
        {
            showToast("Priority Change Failed", "error");
        }
    }

    const updateCompletedPercent = async (ticket_id: string, next_completion: React.ChangeEvent<HTMLSelectElement>) => {
        const response = await fetch(
            `${API_URL}/ticketroutes/update_completion`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ticket_id: ticket_id,
                    completionPercent: Number(next_completion.target.value)
                })
            }
        );
        const json = await response.json();
        getAllTicket(paginationState.page, paginationState.itemsPerPage);
        if(!json.error)
        {
             showToast(`Completion ${next_completion.target.value}% Change Successfully`, "success");
        }
        else
        {
            showToast("Completion change failed", "error");
        }
    }

    const [showFilter, setShowFilter] = useState(false)
    const show_filter = () => {
        if (showFilter) {
            setShowFilter(false);
        }
        else {
            setShowFilter(true);
        }
    }

    const [showAddUser, setShowAddUser] = useState(false)
    const [showAssigned, setShowAssigned] = useState(false)
    const [alreadyArrayAssingedUser, setAlreadyArrayAssingedUser] = useState([{ value: "", label: "" }]);

    const show_added_user = (To: any, ticket_id: any) => {
        if (showAddUser) {
            setShowAddUser(false);
        }
        else {
            let l = [{ value: "", label: "" }];
            for (let i = 0; i < To.length; i++) {
                l.push(allreadyusermap.get(To[i]))
            }
            l.shift();
            setAlreadyArrayAssingedUser(l);
            setShowAddUser(true);
            setcurrentTicketId(ticket_id);
        }
    }

    const onPageChange = (page: any) => {
        page = page.selected;
        setPaginationState((previousState) => {
            return { ...previousState, page: page + 1 };
        });
        getAllTicket(page + 1, paginationState.itemsPerPage);
    };

    const handleSelectChange = (selectedOption: any) => {
        setSelectedOptions(selectedOption);
    };

    const getAllUser = async () => {

        const response = await fetch(`${API_URL}/ticketroutes/get_user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                loginUserId: userIdRef.current
            })
        });
        const json = await response.json()
        const already_user = new Map();
        for (let i = 0; i < json.allUsers.length; i++) {
            already_user.set(json.allUsers[i].value, { value: json.allUsers[i].value, label: json.allUsers[i].label });
        }
        setAllreadyusermap(already_user);
        setUserOptions(json.allUsers);

    }

    const onClickTableHeader = (event: any) => {
        const newSortObj = onChangeSortObj(event, sortState);
        setSortState({
            sortBy: newSortObj.sortBy,
            sortOn: newSortObj.sortOn
        });
    };

    const add_user = async () => {
        let new_add_user = [];
        for (let i = 0; i < selectedOptions.length; i++) {
            new_add_user.push(selectedOptions[i].value);
        }
        const response = await fetch(
            `${API_URL}/ticketroutes/add_user`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ticket_id: currentTicketId,
                    addedUsersIds: new_add_user
                })
            }
        );
        const json = await response.json();
        if (!json.error) {
            getAllTicket(paginationState.page, paginationState.itemsPerPage);
            showToast("Added User Successfully", "success");
            setShowAddUser(false);
        }
        else {
            showToast("Failed or Limit cross to add User", "error");
        }
    }

    const [authUser, setAuthUser] = useState(true)
    const verify_user = async () => {
        //setUserId
        const varToken = localStorage.getItem('token');
        console.log(varToken, "varToken");
        const response = await fetch(
            `${API_URL}/agent/auth/getAgentByToken`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userIdRef.current
                })
            }
        );
        // const varToken = localStorage.getItem('token');
        // console.log(varToken, "varToken");
        // const response = await fetch(
        //     `${API_URL}/auth/user/verify_user`,
        //     {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({
        //             userId: userIdRef.current
        //         })
        //     }
        // );
        const json = await response.json();
        if (json.message !== 'success') {
            showToast(json.error.message, "error");
            setAuthUser(false);
        }
    }

    const [showPriorityBar, setShowPriorityBar] = useState(false)
    const show_priority_bar = (ticket_id: string) => {
        if (showPriorityBar) {
            setShowPriorityBar(false);
        }
        else {
            setShowPriorityBar(true);
            setcurrentTicketId(ticket_id);
        }
    }

    useEffect(() => {
        const set_user_id = async () => {
            const varToken = localStorage.getItem('token')
            try {
              const result = await api.get(GET_USER_BY_TOKEN, {
                headers: {
                  genie_access_token: 'Bearer ' + varToken,
                },
              })
              console.log(result.data.User.appUserId, "result.data");
              userIdRef.current = result.data.User.appUserId;
              getAllUser();
              getAllTicket(1, 10)
            } catch (err: any) {
              console.log(err);
            }
        }
        set_user_id();
        // getAllUser();
        // getAllTicket(1, 10);
    }, [
        sortState.sortOn,
        sortState.sortBy,
        svalue
    ])
    return (
        <>
            {!authUser && <h5 className="text-center">You are not authorized user</h5>}
            {authUser && <div className="card">
                <ToastContainer />
                <SendRemainder _ids={idsdetail} />
                <div className="card-header py-5">
                    <div className="card-title">
                        <select
                            className="form-select form-select-solid mx-2"
                            data-kt-select2="true"
                            data-placeholder="Show records"
                            defaultValue={10}
                            onChange={(e: any) => {
                                setPaginationState((prevState) => {
                                    return {
                                        ...prevState,
                                        itemsPerPage: Number(e.target.value),
                                    };
                                });
                                getAllTicket(paginationState.page, Number(e.target.value));
                            }}
                        >
                            <option value="10">10 Records</option>
                            <option value="15">15 Records</option>
                            <option value="25">25 Records</option>
                            <option value="50">50 Records</option>
                        </select>
                        <div className="my-4 mx-5">
                            <i className="fas fa-search" data-bs-toggle="modal" data-bs-target="#kt_modal_8"
                                style={{ fontSize: "22px", cursor: "pointer" }}></i>
                            <div className="modal fade my-5" tabIndex={-1} id="kt_modal_8">

                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header" style={{ height: "10px" }}>
                                            <div>
                                                <div className="input-group">
                                                    <input type="search" style={{ width: "350px" }} name="search" onChange={onChange} id="search" className="form-control border-0" placeholder="Type here and click on Search" aria-label="Search" aria-describedby="search-addon" />
                                                    <i className="fas fa-search mx-3 my-3" onClick={searchTicket} style={{ fontSize: "20px", color: "blue", cursor: "pointer" }}></i>
                                                </div>
                                            </div>
                                            <div
                                                className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            >
                                                <RxCross2 style={{ width: "20px", height: "20px", color: "red" }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div >
                            {/* -------------------- */}
                        </div>
                        <div className="my-3">
                            <BiRefresh style={{ fontSize: "30px", cursor: "pointer" }} onClick={() => {
                                sortState.sortOn = null;
                                sortState.sortBy = null;
                                setSortstatus("");
                                setSortpriority("");
                                setSvalue("");
                                getAllTicket(paginationState.page, paginationState.itemsPerPage, 1);
                            }} />
                        </div>
                    </div>

                    <div className="card-toolbar">
                        <div
                            className="d-flex justify-content-end"
                            data-kt-customer-table-toolbar="base"
                        >
                            <div className="d-flex align-items-center gap-2 gap-lg-3">
                                <div className="m-0">
                                    <i className="fas fa-filter mx-4"
                                        onClick={show_filter}
                                        style={{ fontSize: "22px", cursor: "pointer" }}></i>
                                    {showFilter && <div
                                        className="menu menu-sub menu-sub-dropdown w-250px w-md-300px show"
                                        style={{ zIndex: "105", position: "fixed", inset: "0px auto auto", margin: "0px", transform: "translate3d(-50%, 70px, 0px)" }}
                                    >
                                        <div className="px-7 py-5">
                                            <div className="fs-5 text-dark fw-bolder">Filter Options</div>
                                        </div>
                                        <div className="separator border-gray-200"></div>
                                        <div className="px-7 py-5">
                                            <div className="mb-10">
                                                <label className="form-label fw-bold">Priority:</label>
                                                <div>
                                                    <select
                                                        onChange={sort_Priority}
                                                        name="_sortprioriy"
                                                        className="form-select form-select-solid"
                                                        data-kt-select2="true"
                                                        data-placeholder="Select option"
                                                        data-allow-clear="true"
                                                    >
                                                        <option value="">Filter Priority</option>
                                                        {priority1?.map(_priority1 =>
                                                            <option value={_priority1._id}>{_priority1.name}</option>
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mb-10">
                                                <label className="form-label fw-bold">Status:</label>
                                                <div>
                                                    <select
                                                        onChange={sort_Status}
                                                        name="_sortstatus"
                                                        className="form-select form-select-solid"
                                                        data-kt-select2="true"
                                                        data-placeholder="Select option"
                                                        data-allow-clear="true"
                                                    >
                                                        <option value="">Filter Status</option>
                                                        {status1?.map(_status1 =>
                                                            <option value={_status1._id}>{_status1.name}</option>
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end">
                                                <button
                                                    onClick={show_filter}
                                                    className="btn btn-sm btn-light btn-active-light-primary me-2"
                                                    data-kt-menu-dismiss="true"
                                                >
                                                    Reset
                                                </button>
                                                <button
                                                    type="submit"
                                                    onClick={() => { sortPriority(1, paginationState.itemsPerPage); show_filter() }}
                                                    className="btn btn-sm btn-primary"
                                                    data-kt-menu-dismiss="true"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                                <CreateTicket loginUserId={userIdRef.current} />
                            </div>

                        </div>
                    </div>
                </div>
                <div className="card-body pt-0">
                    <div className="py-3">
                        <table className="table align-middle table-row-dashed table-responsive fs-6 gy-2">
                            <thead>
                                <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                                    <th className="min-w-125px text-center text-black-50">ID</th>
                                    <th
                                        id="subject"
                                        onClick={onClickTableHeader}
                                        className={clsx(
                                            "min-w-125px table-sort text-center cursor-pointer text-black-50",
                                            {
                                                "table-sort-asc":
                                                    sortState.sortOn === "subject" &&
                                                    sortState.sortBy === "asc",
                                            },
                                            {
                                                "table-sort-desc":
                                                    sortState.sortOn === "subject" &&
                                                    sortState.sortBy === "desc",
                                            }
                                        )}>Title</th>
                                    <th className="min-w-125px text-black-50">Assigned To</th>
                                    <th className="min-w-125px text-black-50"><div style={{marginLeft: "10px"}}>Update Priority</div></th>
                                    <th className="min-w-125px text-black-50"><div style={{marginLeft: "12px"}}>Completed %</div></th>
                                    <th className="min-w-125px text-center text-black-50">Stauts</th>
                                    <th className="min-w-125px text-center text-black-50">Send Remainder</th>
                                </tr>
                            </thead>
                            <tbody className="fw-semibold text-gray-600">
                                {allticket?.map(ticket => <tr>
                                    <td className="mw-50px text-center cursor-pointer">
                                        <CopyToClipboard onCopy={(text, result) => {
                                            result && showToast("ID copied to clipboard", "success")
                                        }} text={ticket._id || ""}>
                                            <Tooltip title="Click Here To Copy" placement="top">
                                                <span className="badge badge-light-dark text-hover-primary text-gray-700 mb-1 my-4">
                                                    NG{`${ticket.category.trim().split(" ").length == 1 ? ticket.category.slice(0, 2)?.toUpperCase() : ticket.category.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '')?.toUpperCase()}`}-{`${ticket._id?.substring(0, 10)}...`}
                                                    {/* NG{`${ticket.category.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '')?.toUpperCase()}`}-{`${ticket._id?.substring(0, 10)}...`} */}
                                                </span>
                                            </Tooltip>
                                        </CopyToClipboard>
                                    </td>
                                    <td className="">
                                        <span className="text-gray-800 mb-1">
                                            {ticket.subject}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <p className="my-4" style={{ cursor: "pointer", fontWeight: "bold" }} onClick={() => show_added_user(ticket.To, ticket._id)}>
                                            <ListItemIcon>
                                                <AssignmentIndIcon style={{ fontSize: "25px" }} />
                                            </ListItemIcon>
                                        </p>
                                        {showAddUser && <div
                                            className="menu menu-sub menu-sub-dropdown w-250px w-md-300px show"
                                            style={{ zIndex: "105", position: "fixed", inset: "0px auto auto", margin: "0px", transform: "translate(-100%, 80px)" }}
                                        >
                                            <div className="px-7 py-5">
                                                <div className="fs-5 text-dark fw-bolder">Add User</div>
                                            </div>
                                            <div className="separator border-gray-200"></div>
                                            <div className="px-7 py-5">
                                                <label className="required form-label my-3">Select Add User</label>
                                                <Select
                                                    defaultValue={alreadyArrayAssingedUser}
                                                    isMulti
                                                    name="name"
                                                    onChange={handleSelectChange}
                                                    options={userOptions}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                />
                                                <div className="d-flex justify-content-end">
                                                    <button
                                                        onClick={() => show_added_user(ticket.To, ticket._id)}
                                                        className="btn btn-sm btn-light btn-active-light-primary me-2 my-5"
                                                        data-kt-menu-dismiss="true"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        onClick={() => add_user()}
                                                        className="btn btn-sm btn-primary my-5"
                                                        data-kt-menu-dismiss="true"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>}
                                    </td>
                                    <td style={{ cursor: "pointer" }} className="text-center" onClick={() => show_priority_bar(ticket._id)}>
                                        {mappriority.get(ticket.priority)?.[0] == "Low" && <FcLowPriority style={{ marginRight: "10px", fontSize: "16px" }} />}
                                        {mappriority.get(ticket.priority)?.[0] == "Medium" && <FcMediumPriority style={{ marginRight: "10px", fontSize: "16px" }} />}
                                        {mappriority.get(ticket.priority)?.[0] == "High" && <FcHighPriority style={{ marginRight: "10px", fontSize: "16px" }} />}{mappriority.get(ticket.priority)?.[0]} {mappriority.get(ticket.priority)?.[0] == "Medium" ? <AiFillCaretDown style={{ marginLeft: "26px" }}  /> : <AiFillCaretDown style={{ marginLeft: "50px" }}  />}
                                        {showPriorityBar && <div
                                            className="menu menu-sub menu-sub-dropdown w-150px w-md-150px show"
                                            style={{ zIndex: "105", position: "fixed", inset: "0px auto auto", margin: "0px", transform: "translate(-110%, 250%)" }}
                                        >
                                            <div className="py-5">
                                                {priority1?.map(_priority1 =>
                                                    <>
                                                        <div
                                                            onClick={() => { set_current_status(_priority1._id); updatePriority() }} style={{ cursor: "pointer" }}>
                                                            {_priority1.name == "Low" && <Tooltip title="Change to low priority"><div><FcLowPriority style={{marginRight: "15px"}} /> Low </div></Tooltip>}
                                                            {_priority1.name == "Medium" && <Tooltip title="Change to medium priority"><div className="my-3"><FcMediumPriority style={{marginRight: "15px"}} /> Medium</div></Tooltip>}
                                                            {_priority1.name == "High" && <Tooltip title="Change to high priority"><div><FcHighPriority style={{marginRight: "15px"}} /> High</div></Tooltip>}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>}
                                    </td>
                                    <td className="text-center">
                                        <div className="row text-center" style={{ marginLeft: "5px" }}>
                                            <div className="col padding-0">
                                                <div className='d-flex flex-stack mb-2'>
                                                    <span className='text-muted me-2 fs-7 fw-semibold'>{ticket.complete}%</span>
                                                </div>
                                                <div className="d-flex">
                                                    <div className='progress h-6px w-100'>
                                                        <div
                                                            className='progress-bar bg-success'
                                                            role='progressbar'
                                                            style={{ width: `${ticket.complete}%` }}
                                                        >
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col padding-0">
                                                <select style={{ height: "7px", width: "6px" }} className="form-select border-gray-100 my-4" onChange={(e) => updateCompletedPercent(ticket._id, e)} name="sendto" defaultValue={'DEFAULT'} aria-label="Default select example">
                                                    <option value="0">0%</option>
                                                    <option value="25">25%</option>
                                                    <option value="50">50%</option>
                                                    <option value="75">75%</option>
                                                    <option value="100">100%</option>
                                                </select>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="mw-50px text-center">
                                        <span style={{ color: `${mapstatus.get(ticket.status)?.[1]}`, fontSize: "12px" }} className="badge badge-sm badge-square badge-light-primary my-4">
                                            {mapstatus.get(ticket.status)?.[0]}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <Tooltip title="Send Remainder">
                                            <ButtonGroup data-bs-toggle="modal" data-bs-target="#kt_modal_10" variant="contained" aria-label="outlined primary button group">
                                                <Button onClick={() => { setIdsdetail({ sender_id: userIdRef.current, reciever_id: ticket.To, setUser: true }) }} className="btn btn-icon btn-light btn-hover-primary btn-sm"><ScheduleSendIcon className="svg-icon svg-icon-md svg-icon-primary" /></Button>
                                            </ButtonGroup>
                                        </Tooltip>
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                        {allticket.length === 0 && <p className="text-bold text-center my-5">-----------------------------You Are Not Created Any Ticket-----------------------------</p>}
                    </div>
                    <PaginationComponent
                        onPageChange={onPageChange}
                        pageCount={Math.ceil(
                            state.agentsCount / paginationState.itemsPerPage
                        )}
                        showingFrom={paginationState.showingFrom}
                        showingTill={paginationState.showingTill}
                        totalRecords={state.agentsCount}
                    />
                </div >
            </div >}
        </>
    )
}

export default Home