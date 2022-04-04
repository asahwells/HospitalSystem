import React, { useState, useEffect, useRef } from "react";
import firebase from "../../firebase";
import "./operationreportlist.css";
import FormPrompt from "../DailogBoxes/formprompt";
import FormPromptsec from "../DailogBoxes/formpromptsec";
import AlertDialogBox from "../DailogBoxes/alertdailogbox";
import Service from "../../Service/firebase";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ConfirmDialogBox from "../DailogBoxes/confirmdailogbox";
import ErorrDialogBox from "../DailogBoxes/errordaologbox";
// import useClickAway from "../../hook/useClickAway";
import { set } from "date-fns";
import { Link } from "react-router-dom";

const OperationReportList = () => {
	const [operationAllotedDate, setOperationAllotedDate] = useState(null);
	const [isLoadMoredata, setIsLoadMoredata] = useState(false);
	const [isPromptLoading, setIsPromptLoading] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [isdeleting, setIsdeleting] = useState(false);
	const [isSearchDataShow, setIsSearchDataShow] = useState(false);
	const [isCloseBtnAppear, setIsCloseBtnAppear] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [limit, setLimit] = useState(10);
	const [searchText, setSearchText] = useState("");
	const [totalNumOfReports, setTotalNumOfReports] = useState(null);
	const [noMoredataText, setNoMoredataText] = useState("");
	const [operationReportList, setOperationReportList] = useState([]);
	const [setOpenAlertDailog, setSetOpenAlertDailog] = useState(false);
	const [alertDailogBoxTitle, setAlertDailogBoxTitle] = useState(null);
	const [alertDailogBoxDes, setAlertDailogBoxDes] = useState(null);
	const [openConfirmDailog, setOpenConfirmDailog] = useState(false);
	const [openFormDailog, setOpenFormDailog] = useState(false);
	const [selectedOperationId, setSelectedOperationId] = useState("");
	const [selectedPatientID, setSelectedPatientID] = useState("");
	const [selectedPatientName, setSelectedPatientName] = useState("");
	const [doctorList, setDoctorList] = useState(["doctor-1", "doctor-2"]);
	const [description, setDescription] = useState("");
	const [remark, setRemark] = useState("");
	const [status, setStatus] = useState("");
	const [doctor, setDoctor] = useState("");
	const [date, setDate] = useState("");
	const [openErrorDailog, setOpenErrorDailog] = useState(false);

	useEffect(() => {
		onSetTotalNumOfReports();
		onFetchData(limit);
		fetchDoctorList();
	}, [limit]);

	// function SplitedWord(str) {
	// 	var newLength = str.split(" ");
	// 	var newArray = "";
	// 	for (let i = 0; i <= newLength.length; i++) {
	// 		let value = [newLength[i]];
	// 		value.reverse().push(newArray);
	// 	}
	// 	console.log("the new result", newArray);
	// }
	// SplitedWord("Welcome to the guide!");

	const onSetTotalNumOfReports = () => {
		const db = firebase.firestore();
		db.collection("operationreport")
			.get()
			.then((snapshot) => {
				setTotalNumOfReports(snapshot.docs.length);
				setIsLoading(false);
			})
			.catch((e) => {
				console.log(e);
			});
	};
	const fetchDoctorList = async () => {
		const db = firebase.firestore();
		await db
			.collection("doctors")
			.orderBy("timeStamp", "desc")
			.get()
			.then((snapshot) => {
				const fetchedDataList = [];

				snapshot.docs.forEach((doc) => {
					fetchedDataList.push({
						firstname: doc.data().firstname,
						lastname: doc.data().lastname,
						doctorid: doc.data().doctorid,
					});
				});
				console.log(fetchedDataList);
				setDoctorList(fetchedDataList);
			})
			.catch((e) => {
				console.log("Error during fetching data" + e);
			});
	};
	const showMore = () => {
		if (limit <= totalNumOfReports) {
			const limits = limit + 10;
			setLimit(limit);
			onFetchData(limits);
		} else {
			setNoMoredataText("No More Operation Report");
		}
	};

	const onFetchData = async (limit) => {
		setIsLoadMoredata(true);
		const fetchDataList = await Service.getData("operationreport", limit);
		if (fetchDataList.length !== 0) {
			setIsLoadMoredata(false);
			setIsLoadMoredata(false);
			setOperationReportList(fetchDataList);
		} else {
			setIsLoadMoredata(false);
			setIsLoading(false);
		}
	};

	const handleOnDelete = async () => {
		setIsdeleting(true);
		const res = await Service.deleteData(
			"operationreport",
			selectedOperationId
		);

		if (res === "success") {
			const sendData = {
				operationreportid: "",
				isBeforeOperationAlloted: false,
			};
			const result = await Service.updateData(
				"patients",
				selectedPatientID,
				sendData
			);
			if (result === "success") {
				setIsdeleting(false);
				setOpenConfirmDailog(false);
				window.location.reload(false);
			} else {
				setIsdeleting(false);
				setOpenConfirmDailog(false);
				setOpenErrorDailog(true);
			}
		}
	};
	const handleSeach = async () => {
		if (searchText === "" || null) {
			window.location.reload(false);
		} else {
			setIsSearching(true);
			setIsSearchDataShow(true);
			const searchTexts = searchText.toLowerCase().replace(/\s/g, "");
			const resultPatientlist = await Service.getSearchRes(
				"operationreport",
				searchTexts
			);
			if (resultPatientlist === "error") {
				setIsSearching(false);
				setOpenErrorDailog(true);
			} else {
				setOperationReportList(resultPatientlist);
				setIsSearching(false);
			}
		}
	};
	const handleAlertDailog = () => {
		setSetOpenAlertDailog(false);

		window.location.reload(false);
	};

	const handleSubmit = async (event) => {
		const data = new FormData(event.target);
		setIsPromptLoading(true);
		setIsCloseBtnAppear(false);

		const sendData = {
			doctorname: data.get("doctor"),
			date: data.get("operationalloteddate"),
			remark: data.get("remark"),
			description: data.get("description"),
			status: data.get("status"),
		};
		const res = await Service.updateData(
			"operationreport",
			selectedOperationId,
			sendData
		);
		if (res === "success") {
			setOpenFormDailog(false);
			setIsPromptLoading(false);
			setSetOpenAlertDailog(true);
			setIsCloseBtnAppear(false);
			setAlertDailogBoxTitle("Update");
			setAlertDailogBoxDes("successfully Updated");
		} else {
			setOpenFormDailog(false);
			setIsPromptLoading(false);
			setIsCloseBtnAppear(true);
			setOpenErrorDailog(true);
		}
	};

	const handleDateChange = (date) => {
		setOperationAllotedDate(date);
	};
	const closeFormDailog = () => {
		setOpenFormDailog(false);
	};
	const closeConfirmDailog = () => {
		setOpenConfirmDailog(false);
	};
	const closeErrorDailog = () => {
		setOpenErrorDailog(false);
	};

	const handleErrorDailog = () => {
		setOpenFormDailog(false);
		setOpenConfirmDailog(false);
		setOpenErrorDailog(true);
	};

	let count = 0;
	return (
		<>
			{isLoading ? (
				<div className="operationreportlistpage">
					<i className="fas fa-spinner fa -pulse fa-2x"></i>
				</div>
			) : (
				<div className="operationreportlistpage">
					<div className="main_section">
						<div className="topheader">
							<ul>
								<li>
									<i
										className="fa fa-arrow-circle-o-right fa-2x"
										aria-hidden="true"
									></i>
								</li>
								<li>
									<h5>Operation Report</h5>
								</li>
							</ul>
						</div>
						<ErorrDialogBox
							openDailog={openErrorDailog}
							onSetOpenDailog={closeErrorDailog}
							title="Error"
							des="Someting went wrong. Try again"
						></ErorrDialogBox>

						<ConfirmDialogBox
							openDailog={openConfirmDailog}
							onSetOpenDailog={closeConfirmDailog}
							handleConfirmOkBtn={handleOnDelete}
							isLoading={isdeleting}
							title="Delete"
							des={
								"Are you sure to delete " +
								selectedPatientName +
								" " +
								"details"
							}
						></ConfirmDialogBox>

						<AlertDialogBox
							openDailog={setOpenAlertDailog}
							setOpenDailog={setOpenAlertDailog}
							onSetOpenDailog={handleAlertDailog}
							title={alertDailogBoxTitle}
							des={alertDailogBoxDes}
						/>
						<FormPrompt
							openDailog={openFormDailog}
							title="Edit New Operation"
							onSetOpenDailog={closeFormDailog}
							isCloseBtnAppear={isCloseBtnAppear}
						>
							{isPromptLoading ? (
								<i
									className="fas fa-spinner fa-pulse fa-2x"
									style={{ position: "relative", top: " 0%", left: "40%" }}
								></i>
							) : (
								<form onSubmit={handleSubmit}>
									<div className="form-row">
										<div className="col-md-6 mb-3">
											<label htmlFor="validationDefault11">Doctor</label>
											<select
												name="doctor"
												className="custom-select"
												id="doctor"
												value={doctor}
												onChange={(e) => setDoctor(e.target.value)}
												required
											>
												{doctorList.map((option) => {
													return (
														<option key={Math.random()}>
															{option.firstname + " " + option.lastname}
														</option>
													);
												})}
											</select>
										</div>
										<div className="col-md-6 mb-3">
											<label htmlFor="validationDefault11">Date</label>
											<MuiPickersUtilsProvider utils={DateFnsUtils}>
												<DatePicker
													style={{
														padding: "0px 10px",
														border: "1px solid rgb(197, 197, 197)",
													}}
													name="operationalloteddate"
													className="  form-control"
													InputProps={{
														disableUnderline: true,
													}}
													value={operationAllotedDate}
													onChange={handleDateChange}
													autoComplete="off"
													format="MM/dd/yyyy"
													required
												/>
											</MuiPickersUtilsProvider>
										</div>
									</div>
									<div className="form-row">
										<div className="col-md-6 mb-3">
											<label htmlFor="validationDefault11">Status</label>
											<input
												name="status"
												type="text"
												className="form-control"
												id="status"
												value={status}
												onChange={(e) => setStatus(e.target.value)}
											/>
										</div>

										<div className="col-md-6 mb-3">
											<label htmlFor="validationDefault11">Remark</label>
											<input
												name="remark"
												type="text"
												className="form-control"
												id="remark"
												value={remark}
												onChange={(e) => setRemark(e.target.value)}
											/>
										</div>
									</div>

									<div className="form-group">
										<label htmlFor="validationDefault09">Description</label>
										<textarea
											name="description"
											className="form-control"
											id="description"
											rows="3"
											value={description}
											onChange={(e) => setDescription(e.target.value)}
										></textarea>
									</div>

									<div
										className="btnsection"
										style={{
											display: "flex",
											justifyContent: "flex-end",
										}}
									>
										<button
											className="btn btn-success bg-edit"
											type="submit"
											style={{
												borderRadius: "10px",
												padding: "5px 10px",
												fontSize: "14px",
											}}
											//  onClick={handleFormDailog}
										>
											Ok
										</button>
									</div>
								</form>
							)}
						</FormPrompt>
						<div className="top_section">
							<div className="wrap">
								<ul>
									<li>
										<div className="search">
											<input
												type="text"
												className="searchTerm"
												placeholder="Search patient by full name"
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														handleSeach();
													}
												}}
												onChange={(e) => setSearchText(e.target.value)}
											/>

											<button
												onClick={handleSeach}
												type="submit"
												className="searchButton"
											>
												<i className="fa fa-search"></i>
											</button>
										</div>
									</li>
									<li style={{ fontSize: "14px" }}> #</li>
									<li tyle={{ fontSize: "14px" }}>
										{operationReportList.length}{" "}
									</li>
								</ul>
							</div>
							<Link to="/operationreportlist/operationreport">
								<button
									type="button"
									className="btn btn-warning bg-add"
									// onClick={() => {
									// 	setOpenFormDailogs(true);
									// }}
								>
									+ Add Report
								</button>
							</Link>
						</div>

						<table className="table table-striped">
							<thead className="thead tablehead">
								<tr>
									<th scope="col">#</th>
									<th scope="col">Patient Name</th>
									<th scope="col">Doctor Name</th>
									<th scope="col">Description</th>
									<th scope="col">Status</th>
									<th scope="col">Remark</th>
									<th scope="col">Date</th>

									<th scope="col">Options</th>
								</tr>
							</thead>
							{isSearching ? (
								<i className="fas fa-spinner fa-pulse fa-2x "></i>
							) : operationReportList.length === 0 ? (
								<tbody>
									<tr>
										<td>No Record Found</td>
									</tr>
								</tbody>
							) : (
								<tbody className="tablebody">
									{operationReportList &&
										operationReportList.map((p) => {
											console.log("hte opertaed:", p);
											count++;
											return (
												<tr key={p.operationreportid}>
													<td>{count}</td>
													<td className="align-middle">{p.patientname}</td>
													<td className="align-middle">{p.doctorname}</td>
													<td className="desctd align-middle">
														{p.description === "" ? "N/A" : p.description}
													</td>
													<td className="align-middle">
														{p.status === "" ? "N/A" : p.status}
													</td>
													<td className="align-middle">
														{" "}
														{p.remark === "" ? "N/A" : p.remark}
													</td>
													<td className="align-middle">
														{" "}
														{p.date === "" ? "N/A" : p.date}
													</td>

													<td className="align-middle">
														<button
															onClick={() => {
																setDescription(p.description);
																setRemark(p.remark);
																setStatus(p.status);
																setDoctor(p.doctorname);
																setOperationAllotedDate(new Date(p.date));
																setSelectedOperationId(p.operationreportid);
																setSelectedPatientName(p.patientname);
																setOpenFormDailog(true);
																setSelectedPatientID(p.patientid);
															}}
															type="button"
															className="btn btn-success bg-edit"
														>
															<i className="fa fa-edit" aria-hidden="true"></i>
														</button>

														<button
															type="button"
															className="btn btn-danger bg-delete"
															onClick={() => {
																setOpenConfirmDailog(true);
																setSelectedOperationId(p.operationreportid);
																setSelectedPatientName(p.patientname);
																setSelectedPatientID(p.patientid);

																// handleOnDelete(
																//   p.patientname,
																//   p.operationreportid,
																//   p.patientid
																// );
															}}
														>
															<i
																className="fa fa-trash bg-delete"
																aria-hidden="true"
															></i>
														</button>
													</td>
												</tr>
											);
										})}
								</tbody>
							)}
						</table>
						<div className="loadmoredatasection operationReportListpage">
							{isLoadMoredata ? (
								<i className="fas fa-spinner fa-pulse fa-2x loadmoredataspinner"></i>
							) : (
								<div className="nomoredatatext">{noMoredataText}</div>
							)}
							{operationReportList.length ===
							0 ? null : isSearchDataShow ? null : (
								<button
									type="button"
									className="btn btn-warning bg-add"
									onClick={showMore}
								>
									Show More
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default OperationReportList;
