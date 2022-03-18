import React, { useState } from "react";
import "../sliderNavBar.css";
import Dashboard from "../Dashboard/dashboard";
import AddMedicine from "../Medicine/medicinelist";
import firebase from "../../firebase";
import {
	BrowserRouter as Routers,
	Switch,
	Route,
	Link,
	useHistory,
} from "react-router-dom";
import { setLogInDetails } from "../../actions/setpersondetailsaction";
import { useDispatch, useSelector } from "react-redux";

const PharmacistDasboard = () => {
	const [addHamburgerClass, setAddHamburgerClass] = useState(false);
	const [addTitleClass, setAddTitleClass] = useState(true);
	const [patientdetails, setPatientdetails] = useState(null);
	const [togglePymentTitle, seTogglePymentTitle] = useState(true);
	const [selectedCat, setSelectedCat] = useState("");
	const history = useHistory();
	const setOnLogInDetails = useDispatch();
	const getData = (data) => {
		setPatientdetails(data);
	};

	const toggleHamburger = () => {
		setAddHamburgerClass(!addHamburgerClass);
	};
	const toggleTitle = () => {
		setAddTitleClass(!addTitleClass);
	};
	const togglePyment = () => {
		seTogglePymentTitle(!togglePymentTitle);
	};
	const logout = () => {
		const loginDetails = { isLoggedIn: false };
		firebase.auth().signOut();
		history.push("/");
		setOnLogInDetails(setLogInDetails(loginDetails));
		// this.props.setOnLogInDetails(loginDetails);
	};
	const setTitleActive = (selectedCat) => {
		setSelectedCat(selectedCat);
	};

	let boxClass = ["wrapper"];

	if (addHamburgerClass) {
		boxClass.push("collap");
	}
	let titleClass = ["subcat"];
	if (addTitleClass) {
		titleClass.push("collap");
	}
	let toggle = ["subcat"];
	if (togglePymentTitle) {
		toggle.push("collap");
		// console.log(boxClass);
	}
	return (
		<div className={boxClass.join(" ")}>
			<Routers>
				<div className="top_navbar">
					<div className="hamburger" onClick={toggleHamburger}>
						<div></div>
						<div></div>
						<div></div>
					</div>
					<div className="top_menu">
						<div className="logo">Hospital Management</div>
						<ul>
							{/* <Link to="/loginPage"> */}
							<li onClick={logout}>
								{" "}
								<i className="fa fa-sign-out" aria-hidden="true"></i>
							</li>
							{/* </Link> */}
							<li>
								<i className="fas fa-search"></i>
							</li>
							<li>
								<i className="fas fa-bell"></i>
							</li>
							<li>
								<i className="fas fa-user"></i>
							</li>
						</ul>
					</div>
				</div>

				<div className="sidebar">
					<div className="noSubCat">
						<ul>
							<Link to="/PharmacistDashboard">
								<li
									className={selectedCat === "Dashboard" ? "active" : ""}
									onClick={() => setTitleActive("Dashboard")}
								>
									<span className="icon">
										<i className="fa fa-home" aria-hidden="true"></i>
									</span>
									<span className="title">Dashboard</span>
								</li>
							</Link>
							<Link to="/AddMedicine">
								<li
									className={selectedCat === "AddMedicine" ? "active" : ""}
									onClick={() => setTitleActive("AddMedicine")}
								>
									<span className="icon">
										<i className="fa fa-user" aria-hidden="true"></i>
									</span>
									<span className="title">Medicines</span>
								</li>
							</Link>
						</ul>
					</div>
					<hr />
				</div>

				<div className="main_container">
					<Switch>
						<Route exact path="/PharmacistDashboard">
							<Dashboard />
						</Route>
						<Route path="/AddMedicine">
							<AddMedicine />
						</Route>
					</Switch>
				</div>
			</Routers>
		</div>
	);
};
export default PharmacistDasboard;
