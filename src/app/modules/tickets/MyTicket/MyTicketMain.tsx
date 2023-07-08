import React, { useEffect, useState, useRef } from 'react'
import clsx from "clsx";
import TicketDetail from './TicketDetail';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { BsFillCircleFill } from 'react-icons/bs';
import { AiOutlineSearch } from 'react-icons/ai';
import { AiFillCaretDown } from 'react-icons/ai';
import { FcHighPriority } from 'react-icons/fc';
import { FcLowPriority } from 'react-icons/fc';
import { FcMediumPriority } from 'react-icons/fc';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Select from 'react-select';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import TransformIcon from '@mui/icons-material/Transform';
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import { RxCross2 } from 'react-icons/rx';
import { AiOutlineFilter } from 'react-icons/ai';
import { BiRefresh } from 'react-icons/bi';
import CopyToClipboard from "react-copy-to-clipboard";
import { PaginationComponent } from "../../common/components/pagination/PaginationComponent";
import { showToast } from "../../common/toastify/toastify.config";
import { ToastContainer, toast } from "react-toastify";
import ButtonGroup from '@mui/material/ButtonGroup';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';
import {
    prev_state, 
    pagination_prev_state
    } from './modals/my_ticket';
import {
    onChangeSortObj,
    sortObj,
} from "../../common/globals/common.constants";
const API_URL = process.env.REACT_APP_API_URL;

const ariaLabel = {
    'aria-label': 'description',
};

const useStyles = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

const MyTicketMain = () => {

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
    const [sortpriority, setSortpriority] = useState("");
    const [sortcategory, setSortcategory] = useState("");
    const [sortstatus, setSortstatus] = useState("");
    const [ticketdetail, setTicketdetail] = useState({
        subject: "",
        content: "",
        priority: "",
        status: "",
        attachements: []
    });
    const [adduserdetail, setAdduserdetail] = useState({
        ticket_id: ""
    });

    const [sortState, setSortState] = useState<sortObj>({
        sortBy: null,
        sortOn: null,
    });

    const userId = "649870a70543ab78d34e3dab"

    const [userOptions, setUserOptions] = useState([{ value: "", label: "" }]);
    const [selectedOptions, setSelectedOptions] = useState([{ value: "", label: "" }]);
    const [transferUserId, setTransferUserId] = useState("");
    const [mappriority, setMappriority] = useState(new Map());
    const [mapcategory, setMapcategory] = useState(new Map());
    const [mapstatus, setMapstatus] = useState(new Map());
    const [priority1, setPriority1] = useState([{ _id: "", name: "" }]);
    const [category1, setCategory1] = useState([{ _id: "", name: "" }]);
    const [allreadyusermap, setAllreadyusermap] = useState(new Map());
    const [status1, setStatus1] = useState([{ _id: "", name: "", color: "" }]);
    const [status2, setStatus2] = useState([{ _id: "", name: "", color: "" }]);
    const [svalue, setSvalue] = useState("");
    const [allticket, setAllTicket] = useState([{ _id: "", subject: "", content: "", To: [], priority: "", category: "", status: "", complete: 0, attachements: [] }])
    const getAllTicket = async (page: number, limit: number, opt = 0) => {

        if (svalue) {
            searchTicket();
            return;
        }
        if ((sortpriority || sortstatus) && opt == 0) {
            sortPriority(page, limit);
            return;
        }

        const response = await fetch(`${API_URL}/ticketroutes/all_my_ticket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                From: userId,
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
        for (let i = 0; i < json.priority_detail.length; i++) {
            ticket_priority.set(json.priority_detail[i]._id, [json.priority_detail[i].name, json.priority_detail[i].color]);
            ticket_priority1.push({ _id: json.priority_detail[i]._id, name: json.priority_detail[i].name });
        }
        for (let i = 0; i < json.category_detail.length; i++) {
            ticket_category.set(json.category_detail[i]._id, [json.category_detail[i].name, json.category_detail[i].color]);
            ticket_category1.push({ _id: json.category_detail[i]._id, name: json.category_detail[i].name });
        }
        for (let i = 0; i < json.status_detail.length; i++) {
            ticket_status.set(json.status_detail[i]._id, [json.status_detail[i].name, json.status_detail[i].color]);
            ticket_status1.push({ _id: json.status_detail[i]._id, name: json.status_detail[i].name, color: json.status_detail[i].color });
        }
        setMappriority(ticket_priority);
        setMapstatus(ticket_status);
        setPriority1(ticket_priority1);
        setCategory1(ticket_category1);
        setStatus1(ticket_status1);
        setStatus2(ticket_status1);
        let totalRecords = json.all_ticket.length;
        setState((previousState: prev_state) => {
            return {
                ...previousState,
                appAgents: showingFrom,
                agentsCount: json.total_ticket,
            };
        });
        let showingFrom = json.total_ticket > 0 ? (page - 1) * limit + 1 : 0;
        let showingTill: number;
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

    const sortOnlyPriority = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const response = await fetch(`${API_URL}/ticketroutes/all_category_ticket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                From: userId,
                ticketPriorityId: e.target.value,
                ticketStatusId: "",
                page: page,
                limit: paginationState.itemsPerPage
            })
        });
        const json_temp = await response.json();
        const json = json_temp.data;
        setAllTicket(json.all_category_ticket);
    }
    const sortPriority = async (page: number, limit: number) => {
        const response = await fetch(`${API_URL}/ticketroutes/all_category_ticket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                From: userId,
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
        let showingFrom = (page - 1) * limit + 1;
        let showingTill: number;
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

    const sort_Priority = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortpriority(e.target.value);
    }

    const sort_Status = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortstatus(e.target.value);
    }
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSvalue(e.target.value);
    }
    const searchTicket = async () => {
        // e.preventDefault();
        let searchValue = svalue.search;
        const response = await fetch(
            `${API_URL}/ticketroutes/all_search_ticket`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    From: userId,
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
        let showingTill: number;
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
        setAllTicket(json.all_search_ticket);
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
        if (!json.error) {
            showToast(`Completion ${next_completion.target.value}% Change Successfully`, "success");
        }
        else {
            showToast("Completion Change Failed", "error");
        }
    }

    const [currentStatusId, setCurrentStatusId] = useState("")
    const valueRef = useRef("");
    const set_current_status = (status_id: string) => {
        setCurrentStatusId(status_id)
        valueRef.current = status_id
    }
    const updateStatus = async () => {
        const response = await fetch(
            `${API_URL}/ticketroutes/update_status`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ticket_id: currentTicketId,
                    statusId: valueRef.current
                })
            }
        );
        const json = await response.json();
        setShowstatusBar(false);
        getAllTicket(paginationState.page, paginationState.itemsPerPage);
        if (!json.error) {
            showToast(`Status Change Successfully`, "success");
        }
        else {
            showToast("Status Change Failed", "error");
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

    const handleTransferChange = (selectedOption: any) => {
        setTransferUserId(selectedOption.value);
    };

    

    const onClickTableHeader = (event: any) => {
        const newSortObj = onChangeSortObj(event, sortState);
        setSortState({
            sortBy: newSortObj.sortBy,
            sortOn: newSortObj.sortOn
        });
    };

    const getAllUser = async () => {

        const response = await fetch(`${API_URL}/ticketroutes/get_user`, {
            method: 'Get'
        });
        const json = await response.json()
        const already_user = new Map();
        for (let i = 0; i < json.allUsers.length; i++) {
            already_user.set(json.allUsers[i].value, { value: json.allUsers[i].value, label: json.allUsers[i].label });
        }
        setAllreadyusermap(already_user);
        setUserOptions(json.allUsers);
    }

    const [showAddUser, setShowAddUser] = useState(false)
    const [showTransferUser, setShowTransferUser] = useState(false)
    const [currentTicketId, setcurrentTicketId] = useState("");
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
    const [showStatusBar, setShowstatusBar] = useState(false)
    const [showDown, setShowDown] = useState(false)
    const show_down = () => {
        if (showDown) {
            setShowDown(false);
        }
        else {
            setShowDown(true);
        }
    }
    const show_status_bar = (ticket_id: string) => {
        if (showStatusBar) {
            setShowstatusBar(false);
        }
        else {
            // setAlreadyArrayAssingedUser(l);
            setShowstatusBar(true);
            setcurrentTicketId(ticket_id);
        }
    }
    const show_transfer_user = (To: any, ticket_id: any) => {
        if (showTransferUser) {
            setShowTransferUser(false);
        }
        else {
            let l = [{ value: "", label: "" }];
            for (let i = 0; i < To.length; i++) {
                l.push(allreadyusermap.get(To[i]))
            }
            l.shift();
            setAlreadyArrayAssingedUser(l);
            setShowTransferUser(true);
            setcurrentTicketId(ticket_id);
        }
    }

    const transfer_user = async () => {
        const response = await fetch(
            `${API_URL}/ticketroutes/transfer_ticket`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ticket_id: currentTicketId,
                    transferBy: userId,
                    transferTo: transferUserId
                })
            }
        );
        const json = await response.json();
        if (!json.error) {
            getAllTicket(paginationState.page, paginationState.itemsPerPage);
            setShowTransferUser(false);
            showToast("Transfer To User Successfully", "success");
        }
        else {
            showToast("Transfer Failed or Already assigned to This User", "error");
        }
    }

    const add_user = async () => {
        // SelectedOptions
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
        const response = await fetch(
            `${API_URL}/auth/user/verify_user`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId
                })
            }
        );
        const json = await response.json();
        if (json.message !== 'success') {
            showToast(json.error.message, "error");
            setAuthUser(false);
        }
    }

    const searchStatus = (e: any) => {
        let str = e.target.value;
        let str1: string = str.charAt(0).toUpperCase() + str.slice(1);
        let filteredData = [{ _id: "", name: "", color: "" }]
        filteredData = status1.filter((item: any) =>
            item.name.includes(str1)
        );
        setStatus2(filteredData);
    }

    useEffect(() => {
        // verify_user();
        getAllUser();
        getAllTicket(1, 10)
    }, [
        sortState.sortOn,
        sortState.sortBy,
        svalue,
        currentStatusId
    ])
    return (
        <>
            {!authUser && <h5 className="text-center">You are not authorized user</h5>}
            {authUser && <div className="card">
                <div className="modal fade" tabIndex={-1} id="kt_modal_10">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body">
                                <h5>Are You sure Want To Transfer ?</h5>
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
                                <button
                                    type="submit"
                                    onClick={() => transfer_user()}
                                    className="btn btn-danger"
                                    data-bs-toggle="modal"
                                    data-bs-target="#kt_modal_10"
                                    data-bs-dismiss="modal">
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
                <TicketDetail _ticketdetail={ticketdetail} />

                <div className="card-header py-5" >
                    <div className="card-title">
                        <select
                            className="form-select form-select-solid"
                            data-kt-select2="true"
                            data-placeholder="Show records"
                            defaultValue={10}
                            style={{ cursor: "pointer" }}
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
                            <i className="fas fa-search" data-bs-toggle="modal" data-bs-target="#kt_modal_9"
                                style={{ fontSize: "22px", cursor: "pointer" }}></i>
                            <div className="modal fade my-5" tabIndex={-1} id="kt_modal_9">

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
                                <select
                                    onChange={sortOnlyPriority}
                                    name="_sortonlyprioriy"
                                    className="form-select form-select-solid"
                                    data-kt-select2="true"
                                    data-placeholder="Select option"
                                    data-allow-clear="true"
                                    style={{ cursor: "pointer" }}
                                >
                                    <option value="">All Priority</option>
                                    {priority1?.map(_priority1 =>
                                        <option value={_priority1._id}>{_priority1.name}</option>
                                    )}
                                </select>
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
                                            "table-sort cursor-pointer text-center text-black-50",
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
                                    <th className="text-center text-black-50">Priority</th>
                                    <th className="text-black-50 text-center">Stauts</th>
                                    <th className="text-black-50">Completed %</th>
                                    <th className="text-center text-black-50">Action</th>
                                </tr>
                            </thead>
                            <tbody className="fw-semibold text-gray-600">
                                {allticket.map((ticket, index) => <tr>
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
                                    <td className=""><p style={{ fontSize: "1rem" }} className="my-4">{ticket.subject}</p></td>
                                    <td className="text-center">
                                        <div className="text-center">
                                            {mappriority.get(ticket.priority)?.[0] == "Low" && <FcLowPriority style={{ marginRight: "10px", fontSize: "16px" }} />}
                                            {mappriority.get(ticket.priority)?.[0] == "Medium" && <FcMediumPriority style={{ marginLeft: "20px", marginRight: "10px", fontSize: "16px" }} />}
                                            {mappriority.get(ticket.priority)?.[0] == "High" && <FcHighPriority style={{ marginRight: "10px", fontSize: "16px" }} />}{mappriority.get(ticket.priority)?.[0]} </div>
                                    </td>
                                    <td className="text-center">
                                        <Button
                                            onClick={() => show_status_bar(ticket._id)} style={{ borderRadius: "50px", color: "white", backgroundColor: `${mapstatus.get(ticket.status)?.[1]}` }} variant="contained" size="small" className={classes.margin}>
                                            {mapstatus.get(ticket.status)?.[0]} <AiFillCaretDown style={{ marginLeft: "10px" }} />
                                        </Button>
                                        {showStatusBar && <div
                                            className="menu menu-sub menu-sub-dropdown w-250px w-md-300px show"
                                            style={{ zIndex: "105", position: "fixed", inset: "0px auto auto", margin: "0px", transform: "translate(40%, 170%)" }}
                                        >
                                            <div className="separator border-gray-200"></div>
                                            <div className="px-7 py-5">
                                                <Input style={{ width: "100%" }} onChange={searchStatus} className="my-3" name="searchstatus" placeholder="Search" error inputProps={ariaLabel} />
                                                {status2?.map(_status1 =>
                                                    <div onClick={() => { set_current_status(_status1._id); updateStatus() }} className="row my-1" style={{ cursor: "pointer" }}><div style={{ color: `${_status1.color}` }} className="col-md-4"><BsFillCircleFill /></div><Tooltip title={`Change to ${_status1.name}`}><div className="col-md-4">{_status1.name}</div></Tooltip></div>
                                                )}
                                                <div className="d-flex justify-content-end">
                                                </div>
                                            </div>
                                        </div>}
                                    </td>
                                    <td className="text-center">
                                        <div className="row">
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
                                                <select style={{ height: "7px", width: "6px", cursor: "pointer" }} className="form-select border-gray-100 my-4" onChange={(e) => updateCompletedPercent(ticket._id, e)} name="sendto" defaultValue={'DEFAULT'} aria-label="Default select example">
                                                    {/* <option value="Default">{ticket.complete}</option> */}
                                                    <option value="0">0%</option>
                                                    <option value="25">25%</option>
                                                    <option value="50">50%</option>
                                                    <option value="75">75%</option>
                                                    <option value="100">100%</option>
                                                </select>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                            <Tooltip title="Add User"><Button onClick={() => show_added_user(ticket.To, ticket._id)} className="btn btn-icon btn-light btn-hover-primary btn-sm"><PersonAddAltIcon className="svg-icon svg-icon-md svg-icon-primary" /></Button></Tooltip>
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
                                                        isClearable={false}
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
                                            <Tooltip title="Ticket Detail"><Button onClick={() => {
                                                setTicketdetail({
                                                    subject: ticket.subject,
                                                    content: ticket.content,
                                                    priority: mappriority.get(ticket.priority)?.[0],
                                                    status: mapstatus.get(ticket.status)?.[0],
                                                    attachements: ticket.attachements
                                                })
                                            }} data-bs-toggle="modal" data-bs-target="#kt_modal_4" className="btn btn-icon btn-light btn-hover-primary btn-sm"><RemoveRedEyeIcon className="svg-icon svg-icon-md svg-icon-primary" /></Button></Tooltip>
                                            <Tooltip title="Transfer Ticket"><Button onClick={() => show_transfer_user(ticket.To, ticket._id)} className="btn btn-icon btn-light btn-hover-primary btn-sm"><TransferWithinAStationIcon className="svg-icon svg-icon-md svg-icon-primary" /></Button></Tooltip>
                                            {showTransferUser && <div
                                                className="menu menu-sub menu-sub-dropdown w-250px w-md-300px show"
                                                style={{ zIndex: "105", position: "fixed", inset: "0px auto auto", margin: "0px", transform: "translate(-100%, 80px)" }}
                                            >
                                                <div className="px-7 py-5">
                                                    <div className="fs-5 text-dark fw-bolder">Transfer User</div>
                                                </div>
                                                <div className="separator border-gray-200"></div>
                                                <div className="px-7 py-5">
                                                    <label className="required form-label my-3">Select Transfer User</label>
                                                    <Select
                                                        // defaultValue={alreadyArrayAssingedUser}
                                                        // isMulti
                                                        name="name"
                                                        onChange={handleTransferChange}
                                                        options={userOptions}
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                    />
                                                    <div className="d-flex justify-content-end">
                                                        <button
                                                            onClick={() => show_transfer_user(ticket.To, ticket._id)}
                                                            className="btn btn-sm btn-light btn-active-light-primary me-2 my-5"
                                                            data-kt-menu-dismiss="true"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#kt_modal_10"
                                                            className="btn btn-sm btn-primary my-5"
                                                            data-kt-menu-dismiss="true"
                                                        >
                                                            Transfer
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>}
                                        </ButtonGroup>
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                        {allticket.length === 0 && <p className="text-bold text-center my-5">-----------------------------No Ticket Are Created For You-----------------------------</p>}
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
                </div>
            </div >}
        </>
    )
}

export default MyTicketMain