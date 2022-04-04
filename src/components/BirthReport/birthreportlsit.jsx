import React, { Component } from "react";
import firebase from "../../firebase";
import "./birthreportlsit.css";
import FormPrompt from "../DailogBoxes/formprompt";
import AlertDialogBox from "../DailogBoxes/alertdailogbox";
import Service from "../../Service/firebase";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ConfirmDialogBox from "../DailogBoxes/confirmdailogbox";
import ErorrDialogBox from "../DailogBoxes/errordaologbox";
import { Link } from "react-router-dom";

class BirthReportList extends Component {
	constructor() {
		super();
		this.state = {
			birthAllotedDate: null,

			limit: 10,
			isLoadMoredata: false,
			isPromptLoading: false,
			isSearching: false,
			isSearchDataShow: false,
			isCloseBtnAppear: true,
			isLoading: true,

			totalNumOfReports: null,
			noMoredataText: "",

			birthReportList: [],

			setOpenAlertDailog: false,
			alertDailogBoxTitle: null,
			alertDailogBoxDes: null,
			openConfirmDailog: false,
			openFormDailog: false,

			selectedbirthId: "",
			selectedPatientID: "",
			selectedPatientName: "",

			doctorList: ["doctor-1", "doctor-2"],
			description: "",
			remark: "",
			status: "",
			doctor: "",
			date: "",
			openErrorDailog: false,
		};
	}
	componentDidMount() {
		this.onSetTotalNumOfReports();
		this.onFatchData(this.state.limit);
		this.fetchDoctorList();
	}
	onSetTotalNumOfReports() {
		const db = firebase.firestore();
		db.collection("birthreport")
			.get()
			.then((snapshot) => {
				this.setState({ totalNumOfReports: snapshot.docs.length });
			})
			.catch((e) => {
				console.log(e);
			});
	}
	async fetchDoctorList() {
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
				this.setState({
					doctorList: fetchedDataList,
				});
			})
			.catch((e) => {
				console.log("Error during fetching data" + e);
			});
	}
	showMore = () => {
		if (this.state.limit <= this.state.totalNumOfReports) {
			const limit = this.state.limit + 10;
			this.setState({ limit: limit });
			this.onFatchData(limit);
		} else {
			this.setState({
				noMoredataText: "No More Birth Report",
			});
		}
	};

	async onFatchData(limit) {
		this.setState({ isLoadMoredata: true });
		const fetchDataList = await Service.getData("birthreport", limit);
		if (fetchDataList.length !== 0) {
			this.setState({
				birthReportList: fetchDataList,
				isLoadMoredata: false,
				isLoading: false,
			});
		} else {
			this.setState({
				isLoadMoredata: false,
				isLoading: false,
			});
		}
	}

	handleOnDelete = async () => {
		this.setState({ isDeleting: true });
		const res = await Service.deleteData(
			"birthreport",
			this.state.selectedbirthId
		);

		if (res === "success") {
			const sendData = {
				birthreportid: "",
				isBeforeBirthAlloted: false,
			};
			const result = await Service.updateData(
				"patients",
				this.state.selectedPatientID,
				sendData
			);
			if (result === "success") {
				this.setState({
					isDeleting: false,
					openConfirmDailog: false,
				});
				window.location.reload(false);
			} else {
				this.setState({
					isDeleting: false,
					openConfirmDailog: false,
					openErrorDailog: true,
				});
			}
		}
	};
	handleSeach = async () => {
		if (this.state.serachText === "" || null) {
			window.location.reload(false);
		} else {
			this.setState({
				isSearching: true,
				isSearchDataShow: true,
			});
			const searchText = this.state.serachText.toLowerCase().replace(/\s/g, "");
			const resultPatientlist = await Service.getSearchRes(
				"birthreport",
				searchText
			);
			if (resultPatientlist === "error") {
				this.setState({
					isSearching: false,
					openErrorDailog: true,
				});
			} else {
				this.setState({
					birthReportList: resultPatientlist,
					isSearching: false,
				});
			}
		}
	};
	handleAlertDailog = () => {
		this.setState({
			openAlertDailog: false,
		});
		window.location.reload(false);
	};

	handleSubmit = async (event) => {
		const data = new FormData(event.target);

		this.setState({
			isPromptLoading: true,
			isCloseBtnAppear: false,
		});
		const sendData = {
			doctorname: data.get("doctor"),
			date: data.get("birthalloteddate"),
			remark: data.get("remark"),
			description: data.get("description"),
			status: data.get("status"),
		};
		const res = await Service.updateData(
			"birthreport",
			this.state.selectedbirthId,
			sendData
		);
		if (res === "success") {
			this.setState({
				openFormDailog: false,
				isPromptLoading: false,
				openAlertDailog: true,
				isCloseBtnAppear: true,
				alertDailogBoxTitle: "Update",
				alertDailogBoxDes: "successfully Updated",
			});
		} else {
			this.setState({
				openFormDailog: false,
				isPromptLoading: false,

				isCloseBtnAppear: true,
				openErrorDailog: true,
			});
		}
	};

	onEdit = (e) => {
		this.setState({
			[e.target.name]: [e.target.value],
		});
		//console.log(doctorsDetails);
	};
	handleDateChange = (date) => {
		this.setState({
			birthAllotedDate: date,
		});
	};
	closeFormDailog = () => {
		this.setState({
			openFormDailog: false,
		});
	};
	closeConfirmDailog = () => {
		this.setState({
			openConfirmDailog: false,
		});
	};
	closeErrorDailog = () => {
		this.setState({
			openErrorDailog: false,
		});
	};

	handleErrorDailog = () => {
		this.setState({
			openFormDailog: false,
			openConfirmDailog: false,
			openErrorDailog: true,
		});
	};
	render() {
		let count = 0;
		return this.state.isLoading ? (
			<div className="birthreportlisttpage">
				<i className="fas fa-spinner fa-pulse fa-2x"></i>
			</div>
		) : (
			<div className="birthreportlisttpage">
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
								<h5>Birth Report</h5>
							</li>
						</ul>
					</div>
					<ErorrDialogBox
						openDailog={this.state.openErrorDailog}
						onSetOpenDailog={this.closeErrorDailog}
						title="Error"
						des="Someting went wrong. Try again"
					></ErorrDialogBox>
					<ConfirmDialogBox
						openDailog={this.state.openConfirmDailog}
						onSetOpenDailog={this.closeConfirmDailog}
						handleConfirmOkBtn={this.handleOnDelete}
						isLoading={this.state.isDeleting}
						title="Delete"
						des={
							"Are you sure to delete " +
							this.state.selectedPatientName +
							" " +
							"details"
						}
					></ConfirmDialogBox>
					<AlertDialogBox
						openDailog={this.state.openAlertDailog}
						setOpenDailog={this.state.setOpenAlertDailog}
						onSetOpenDailog={this.handleAlertDailog}
						title={this.state.alertDailogBoxTitle}
						des={this.state.alertDailogBoxDes}
					/>
					<FormPrompt
						openDailog={this.state.openFormDailog}
						title="Add New Operation"
						onSetOpenDailog={this.closeFormDailog}
						isCloseBtnAppear={this.state.isCloseBtnAppear}
					>
						{this.state.isPromptLoading ? (
							<i
								className="fas fa-spinner fa-pulse fa-2x"
								style={{ position: "relative", top: " 0%", left: "40%" }}
							></i>
						) : (
							<form onSubmit={this.handleSubmit}>
								<div className="form-row">
									<div className="col-md-6 mb-3">
										<label htmlFor="validationDefault11">Doctor</label>
										<select
											name="doctor"
											className="custom-select"
											id="doctor"
											value={this.state.doctor}
											onChange={this.onEdit}
											required
										>
											{this.state.doctorList.map((option) => {
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
												name="birthalloteddate"
												className="  form-control"
												InputProps={{
													disableUnderline: true,
												}}
												value={this.state.birthAllotedDate}
												onChange={this.handleDateChange}
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
											value={this.state.status}
											onChange={this.onEdit}
										/>
									</div>

									<div className="col-md-6 mb-3">
										<label htmlFor="validationDefault11">Remark</label>
										<input
											name="remark"
											type="text"
											className="form-control"
											id="remark"
											value={this.state.remark}
											onChange={this.onEdit}
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
										value={this.state.description}
										onChange={this.onEdit}
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
										// onClick={this.handleFormDailog}
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
													this.handleSeach();
												}
											}}
											onChange={(e) => {
												this.setState({
													serachText: e.target.value,
												});
											}}
										/>

										<button
											onClick={this.handleSeach}
											type="submit"
											className="searchButton"
										>
											<i className="fa fa-search"></i>
										</button>
									</div>
								</li>
								<li style={{ fontSize: "14px" }}> #</li>
								<li tyle={{ fontSize: "14px" }}>
									{this.state.birthReportList.length}{" "}
								</li>
							</ul>
						</div>
						<Link to="/birthreportlist/birthreportallotment">
							<button
								type="button"
								className="btn btn-warning bg-add"
								// onClick={this.setState({
								// 	openFormDailog: true,
								// })}
							>
								+ Add Report
							</button>
						</Link>
					</div>

					<table className="table  table-striped">
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
						{this.state.isSearching ? (
							<i className="fas fa-spinner fa-pulse fa-2x "></i>
						) : this.state.birthReportList.length === 0 ? (
							<tbody>
								<tr>
									<td>No Birth Report Found</td>
								</tr>
							</tbody>
						) : (
							<tbody className="tablebody">
								{this.state.birthReportList &&
									this.state.birthReportList.map((p) => {
										count++;
										return (
											<tr key={p.birthreportid}>
												<td>{count}</td>
												<td>{p.patientname}</td>
												<td>{p.doctorname}</td>
												<td className="desctd">
													{p.description === "" ? "N/A" : p.description}
												</td>
												<td>{p.status === "" ? "N/A" : p.status}</td>
												<td> {p.remark === "" ? "N/A" : p.remark}</td>
												<td> {p.date === "" ? "N/A" : p.date}</td>

												<td>
													<button
														onClick={() => {
															this.setState({
																description: p.description,
																remark: p.remark,
																status: p.status,
																doctor: p.doctorname,
																birthAllotedDate: new Date(p.date),
																selectedbirthId: p.birthreportid,
																selectedPatientName: p.patientname,
																openFormDailog: true,
															});
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
															this.setState({
																openConfirmDailog: true,
																selectedbirthId: p.birthreportid,
																selectedPatientID: p.patientid,
																selectedPatientName: p.patientname,
															});
															// this.handleOnDelete(
															//   p.patientname,
															//   p.birthreportid,
															//   p.patientid
															// );
														}}
													>
														<i className="fa fa-trash" aria-hidden="true"></i>
													</button>
												</td>
											</tr>
										);
									})}
							</tbody>
						)}
					</table>
					<div className="loadmoredatasection birthReportlisttpage">
						{this.state.isLoadMoredata ? (
							<i className="fas fa-spinner fa-pulse fa-2x loadmoredataspinner"></i>
						) : (
							<div className="nomoredatatext">{this.state.noMoredataText}</div>
						)}
						{this.state.birthReportList.length === 0 ? null : this.state
								.isSearchDataShow ? null : (
							<button
								type="button"
								className="btn btn-warning bg-add"
								onClick={this.showMore}
							>
								Show More
							</button>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default BirthReportList;
