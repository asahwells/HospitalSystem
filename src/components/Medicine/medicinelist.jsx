import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import "./medicinelist.css";
import FormPrompt from "../DailogBoxes/formprompt";
import AlertDialogBox from "../DailogBoxes/alertdailogbox";
import Service from "../../Service/firebase";
import ConfirmDialogBox from "../DailogBoxes/confirmdailogbox";
import ErorrDialogBox from "../DailogBoxes/errordaologbox";

const MedicineList = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [limit, setLimit] = useState(10);
	const [isLoadMoredata, setIsLoadMoredata] = useState(false);
	const [totalNumOfMedicie, setTotalNumOfMedicie] = useState(null);
	const [noMoredataText, setNoMoredataText] = useState("");
	const [openFormDialog, setOpenFormDialog] = useState(false);
	const [medicinelist, setMedicinelist] = useState([]);
	const [isPromptLoading, setIsPromptLoading] = useState(false);
	const [medicineCategories, setMedicineCategories] = useState([]);
	const [openAlertDialog, setOpenAlertDialog] = useState(false);
	const [alertDialogBoxTitle, setAlertDialogBoxTitle] = useState(true);
	const [alertDialogBoxDes, setAlertDialogBoxDes] = useState(null);
	const [isForUpdate, setIsForUpdate] = useState(false);
	const [medicinename, setMedicinename] = useState("");
	const [medicinedescription, setMedicinedescription] = useState("");
	const [medicinecompany, setMedicinecompany] = useState("");
	const [medicineremark, setMedicineremark] = useState("");
	const [medicineqty, setMedicineqty] = useState("");
	const [medicinestatus, setMedicinestatus] = useState("");
	const [medicinecategory, setMedicinecategory] = useState("");
	const [isCloseBtnAppear, setIsCloseBtnAppear] = useState(true);
	const [isSearching, setIsSearching] = useState(false);
	const [isSearchDataShow, setIsSearchDataShow] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [selectedMedicineName, setSelectedMedicineName] = useState("");
	const [selectedMedicineId, setSelectedMedicineId] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const [openErrorDialog, setOpenErrorDialog] = useState(false);

	useEffect(() => {
		onSetTotalNumOfMedicie();
		onFetchData(limit);
		// onSetMedicineCat();
	}, []);

	// const onSetMedicineCat = async () => {
	// 	const db = firebase.firestore();
	// 	db.collection("medicines")
	// 		.doc("categories")
	// 		.get()
	// 		.then((doc) => {
	// 			let categories = doc.data().categories;

	// 			setMedicineCategories(categories);
	// 		})
	// 		.catch((e) => {
	// 			console.log(e);
	// 		});
	// 	console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

	// 	console.log(medicineCategories);
	// };

	const showMore = () => {
		if (limit <= totalNumOfMedicie) {
			const limit = limit + 10;
			console.log(totalNumOfMedicie);
			setLimit(limit);
			onFetchData(limit);
		} else {
			setNoMoredataText("No more Medicines");
		}
	};
	const onSetTotalNumOfMedicie = () => {
		const db = firebase.firestore();
		db.collection("medicines")
			.get()
			.then((snapshot) => {
				setTotalNumOfMedicie(snapshot.docs.length);
			})
			.catch((e) => {
				console.log(e);
			});
	};
	const onFetchData = async (limit) => {
		setIsLoadMoredata(true);
		const db = firebase.firestore();
		await db
			.collection("medicines")
			.orderBy("timeStamp", "desc")
			.limit(limit)
			.get()
			.then((snapshot) => {
				const medicinelist = [];

				snapshot.docs.forEach((doc) => {
					medicinelist.push(doc.data());
				});
				setMedicinelist(medicinelist);
				setIsLoadMoredata(false);
				setIsLoading(false);
			})
			.catch((e) => {
				setIsLoading(false);
				console.log(e);
			});
	};

	// const handleChange = (date) => {
	// 	setState({
	// 		date: date,
	// 		startDate: date,
	// 	});
	// };

	const handleOnDelete = (medicineName, medicineId) => {
		setSelectedMedicineName(medicineName);
		setSelectedMedicineId(medicineId);
		setOpenConfirmDialog(true);
	};

	const deleteData = async () => {
		setIsDeleting(true);
		const res = await Service.deleteData("medicines", selectedMedicineId);
		if (res === "success") {
			setIsDeleting(false);
			setOpenConfirmDialog(false);
			window.location.reload(false);
		} else {
			setIsDeleting(false);
			setOpenErrorDialog(true);
			//handleErrorDialog();
		}
	};
	const handleSearch = () => {
		if (searchText === "" || null) {
			window.location.reload(false);
		} else {
			setIsSearchDataShow(true);
			setIsSearching(true);

			const searchtext = searchText.toLowerCase().replace(/\s/g, "");

			const db = firebase.firestore();
			db.collection("medicines")
				.orderBy("searchbyname")
				.startAt(searchtext)
				.endAt(searchtext + "\uf8ff")
				.get()
				.then((snapshot) => {
					const resultPatientlist = [];

					snapshot.docs.forEach((doc) => {
						console.log(doc.data());
						resultPatientlist.push(doc.data());
					});
					setMedicinelist(resultPatientlist);
					setIsSearching(false);
				})
				.catch((e) => {
					setIsSearching(false);
					console.log(e);
				});
		}
	};
	const handleAlertDialog = () => {
		setOpenAlertDialog(false);
		window.location.reload(false);
	};
	const handleFormDailogToClose = () => {
		setMedicinename("");
		setMedicinedescription("");
		setMedicinecompany("");
		setMedicineremark("");
		setMedicineqty("");
		setMedicinestatus("");
		setMedicinecategory("");
		setSelectedMedicineId("");
		setOpenFormDialog(false);
	};
	const handleFormDialogToUpdate = async (event) => {
		setIsPromptLoading(true);
		setIsCloseBtnAppear(false);
		const data = new FormData(event.target);
		const sendData = {
			name: data.get("medicinename"),
			description: data.get("medicinedescription"),

			company: data.get("medicinecompany"),
			remark: data.get("medicineremark"),
			qty: data.get("medicineqty"),
			status: data.get("medicinestatus"),
			category: data.get("medicinecategory"),
		};

		const res = await Service.updateData(
			"medicines",
			selectedMedicineId,
			sendData
		);

		if (res === "success") {
			// isLoading: false,
			setOpenFormDialog(false);
			setIsPromptLoading(false);
			setIsForUpdate(false);
			setOpenAlertDialog(true);
			setAlertDialogBoxTitle("Update");
			setAlertDialogBoxDes("successfull Updated");
			setIsCloseBtnAppear(true);
		} else {
			setOpenFormDialog(false);
			setIsPromptLoading(false);
			setIsForUpdate(false);
			setOpenAlertDialog(true);
			setIsCloseBtnAppear(true);
		}
	};
	const handleFormDialogToAdd = async (event) => {
		const data = new FormData(event.target);
		setIsPromptLoading(true);
		setIsCloseBtnAppear(false);

		const sendData = {
			name: data.get("medicinename"),
			description: data.get("medicinedescription"),
			company: data.get("medicinecompany"),
			remark: data.get("medicineremark"),
			qty: data.get("medicineqty"),
			status: data.get("medicinestatus"),
			category: data.get("medicinecategory"),
			timeStamp: firebase.firestore.Timestamp.fromDate(new Date()),
			searchbyname: data.get("medicinename").toLowerCase().replace(/\s/g, ""),
		};
		const res = await Service.addDataAndReturnId(
			sendData,
			"medicines",
			"medicineid"
		);
		if (res === "success") {
			// isLoading: false,
			setOpenFormDialog(false);
			setIsPromptLoading(false);
			setOpenAlertDialog(true);
			setAlertDialogBoxTitle("Added");
			setAlertDialogBoxDes("New Medicine has been added successfully");
			setIsCloseBtnAppear(true);
		} else {
			// isLoading: false,
			setOpenFormDialog(false);
			setIsPromptLoading(false);
			setIsCloseBtnAppear(true);
		}
	};

	const closeFormDialog = () => {
		setIsForUpdate(false);
		setMedicinename("");
		setMedicinedescription("");
		setMedicinecompany("");
		setMedicineremark("");
		setMedicineqty("");
		setMedicinestatus("");
		setMedicinecategory("");
		setSelectedMedicineId("");

		setOpenFormDialog(false);
	};
	const closeConfirmDialog = () => {
		setOpenConfirmDialog(false);
	};
	const closeErrorDialog = () => {
		setOpenErrorDialog(false);
	};

	const handleErrorDialog = () => {
		setOpenFormDialog(false);
		setOpenConfirmDialog(false);
		setOpenErrorDialog(true);
	};
	let count = 0;
	return (
		<>
			{isLoading ? (
				<div className="medicinelistpage">
					<i className="fas fa-spinner fa-pulse fa-2x"></i>
				</div>
			) : (
				<div className="medicinelistpage">
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
									<h5>Medicine</h5>
								</li>
							</ul>
							<hr />
						</div>
						<ConfirmDialogBox
							openDailog={openConfirmDialog}
							onSetOpenDailog={closeConfirmDialog}
							handleConfirmOkBtn={deleteData}
							isLoading={isDeleting}
							title="Delete"
							des={
								"Are you sure to delete " +
								selectedMedicineName +
								" " +
								"details"
							}
						/>
						<ErorrDialogBox
							openDailog={openErrorDialog}
							onSetOpenDailog={closeErrorDialog}
							title="Error"
							des="Someting went wrong. Try again"
						></ErorrDialogBox>

						<AlertDialogBox
							openDailog={openAlertDialog}
							setOpenDailog={openAlertDialog}
							onSetOpenDailog={handleAlertDialog}
							title={alertDialogBoxTitle}
							des={alertDialogBoxDes}
						/>
						<FormPrompt
							openDailog={openFormDialog}
							onSetOpenDailog={closeFormDialog}
							isCloseBtnAppear={isCloseBtnAppear}
							title="Add New Medicine"
						>
							{isPromptLoading ? (
								<i
									className="fas fa-spinner fa-pulse fa-2x"
									style={{ position: "relative", top: " 0%", left: "40%" }}
								></i>
							) : (
								<form
									style={{ fontSize: "12px" }}
									onSubmit={
										isForUpdate
											? handleFormDialogToUpdate
											: handleFormDialogToAdd
									}
								>
									<div className="form-row">
										<div className="col-md-6 mb-3">
											<label htmlFor="validationDefault11">Medicine Name</label>
											<input
												name="medicinename"
												type="text"
												className="form-control"
												id="medicinename"
												value={medicinename}
												onChange={(e) => setMedicinename(e.target.value)}
												required
											/>
										</div>
										<div className="col-md-6 mb-3">
											<label htmlFor="validationDefault11">category</label>
											<select
												name="medicinecategory"
												className="custom-select"
												multiple={false}
												id="medicinecategory"
												value={medicineCategories}
												onChange={(e) => setMedicineCategories(e.target.value)}
												required
											>
												return (<option>Analgesics</option>
												<option>Antacids</option>
												<option>Antianxiety Drugs</option>
												<option>Antiarrhythmics</option>
												<option>Antibacterials</option>
												<option>Antibiotics</option>
												<option>Anticoagulants and Thrombolytics</option>
												<option>Anticonvulsants</option>
												<option>Antidepressants</option>
												<option>Antidiarrheals</option>
												<option>Antiemetics</option>
												<option>Antifungals</option>
												<option>Antihistamines</option>
												<option>Antihypertensives</option>
												<option>Anti-Inflammatories</option>
												<option>Antineoplastics</option>
												<option>Antipsychotics</option>
												<option>Antipyretics</option>
												<option>Antivirals</option>
												<option>Barbiturates</option>
												<option>Beta-Blockers:</option>
												<option>Bronchodilators</option>
												<option>Cold Cures</option>
												<option>Corticosteroids</option>
												<option>Cough Suppressants</option>
												<option>Cytotoxics</option>
												<option>Decongestants</option>
												<option>Diuretics</option>
												<option>Expectorant</option>
												<option>Hormones</option>
												<option>Hypoglycemics</option>
												<option>Immunosuppressives</option>
												<option>Laxatives</option>
												<option>Muscle Relaxants</option>
												<option>Sedatives</option>
												<option>Sex Hormones (Female)</option>
												<option>Sex Hormones (Male)</option>
												<option>Sleeping Drugs</option>
												<option>Tranquilizer</option>
												<option>Vitamins</option>)
											</select>
										</div>
									</div>
									<div className="form-row">
										<div className="col-md-6 mb-3">
											<label htmlFor="validationDefault11">Company</label>
											<input
												name="medicinecompany"
												type="text"
												className="form-control"
												id="medicinecompany"
												value={medicinecompany}
												onChange={(e) => setMedicinecompany(e.target.value)}
											/>
										</div>
										<div className="col-md-6 mb-3">
											<label htmlFor="validationDefault11">Qty</label>
											<input
												name="medicineqty"
												type="number"
												className="form-control"
												id="medicineqty"
												value={medicineqty}
												onChange={(e) => setMedicineqty(e.target.value)}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="col-md">
											<label htmlFor="validationDefault10">Remark</label>
											<input
												name="medicineremark"
												className="form-control"
												id="medicineremark"
												value={medicineremark}
												onChange={(e) => setMedicineremark(e.target.value)}
											></input>
										</div>
									</div>
									<div className="form-row">
										<div className="col-md">
											<label htmlFor="validationDefault10">Status</label>
											<input
												name="medicinestatus"
												className="form-control"
												id="medicinestatus"
												value={medicinestatus}
												onChange={(e) => setMedicinestatus(e.target.value)}
											></input>
										</div>
									</div>

									<div className="form-group">
										<label htmlFor="validationDefault09">Description</label>
										<textarea
											name="medicinedescription"
											className="form-control"
											id="medicinedescription"
											rows="3"
											value={medicinedescription}
											onChange={(e) => setMedicinedescription(e.target.value)}
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
											className="btn btn-success bg-edit bg-edit"
											type="submit"
											style={{
												borderRadius: "10px",
												padding: "5px 10px",
												fontSize: "12px",
											}}
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
														handleSearch();
													}
												}}
												onChange={(e) => {
													setSearchText(e.target.value);
												}}
											/>

											<button
												onClick={handleSearch}
												type="submit"
												className="searchButton"
											>
												<i className="fa fa-search"></i>
											</button>
										</div>
									</li>
									<li style={{ fontSize: "14px" }}> #</li>
									<li tyle={{ fontSize: "14px" }}>{medicinelist.length} </li>
								</ul>
							</div>

							<button
								type="button"
								className="btn btn-warning bg-add"
								onClick={() => {
									setOpenFormDialog(true);
								}}
							>
								+ Add Medicine
							</button>
						</div>
						<table className="table table-striped">
							<thead className="thead tablehead">
								<tr>
									<th scope="col">#</th>
									<th scope="col">Name</th>
									<th scope="col">Category</th>
									<th scope="col">Description</th>
									<th scope="col">Company</th>
									<th scope="col">Remark</th>
									<th scope="col">Qty</th>
									<th scope="col">Status</th>
									<th scope="col">Options</th>
								</tr>
							</thead>
							{isSearching ? (
								<i className="fas fa-spinner fa-pulse fa-2x "></i>
							) : medicinelist.length === 0 ? (
								<tbody>
									<tr>
										<td>No Medicine Found</td>
									</tr>
								</tbody>
							) : (
								<tbody className="tablebody">
									{medicinelist &&
										medicinelist.map((p) => {
											count++;
											return (
												<tr key={p.medicineid}>
													<td>{count}</td>
													<td>{p.name}</td>
													<td>{p.category === "" ? "N/A" : p.category}</td>
													<td className="desctd">
														{p.description === "" ? "N/A" : p.description}
													</td>
													<td>{p.company === "" ? "N/A" : p.company}</td>
													<td> {p.remark === "" ? "N/A" : p.remark}</td>
													<td> {p.qty === "" ? "N/A" : p.qty}</td>
													<td> {p.status === "" ? "N/A" : p.status}</td>
													<td>
														<button
															onClick={() => {
																setIsForUpdate(true);
																setMedicinename(p.name);
																setMedicinedescription(p.description);
																setMedicinecompany(p.company);
																setMedicineremark(p.remark);
																setMedicineqty(p.qty);
																setMedicinestatus(p.status);
																setMedicinecategory(p.category);
																setSelectedMedicineId(p.medicineid);
																setOpenFormDialog(true);
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
																handleOnDelete(p.name, p.medicineid);
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
						<div className="loadmoredatasection medicinelistpage">
							{isLoadMoredata ? (
								<i className="fas fa-spinner fa-pulse fa-2x loadmoredataspinner"></i>
							) : (
								<div className="nomoredatatext">{noMoredataText}</div>
							)}
							{medicinelist.length === 0 ? null : isSearchDataShow ? null : (
								<button
									type="button"
									className="btn btn-warning bg-add"
									onClick={() => showMore()}
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

export default MedicineList;
