import React, { Component, useState, useEffect } from "react";
import SideNavBar from "./components/sideNavBar";
import firebase from "./firebase";
import LoginPage from "./components/Login/Login";
import {
	setLogInDetails,
	setLoginLoading,
} from "./actions/setpersondetailsaction";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import DoctorPage from "./components/DoctorPage/DoctorPage";
import PatientPage from "./components/DoctorPage/PatientPage";
import { es } from "date-fns/locale";
import AddMedicine from "./components/Pharmacistslist/AddMedicine";
import PharmacistDashboard from "./components/Pharmacistslist/PharmacistDashboard";
import OperationAllotment from "./components/OperationReprot/operationallotment";
import BirthRepotAllotment from "./components/BirthReport/birthreportallotment";
import DeathRepotAllotment from "./components/DeathReport/deathreportallotment";
import CreatePayRoll from "./components/Payroll/createpayroll";

const App = () => {
	const dispatch = useDispatch();
	const loginDetails = useSelector((store) => store.loginDetails);
	console.log(loginDetails);

	useEffect(() => {
		authListener();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [isLoggedIn, setIsLoggedIn] = useState(null);
	const history = useHistory();
	// const loginDetails = useSelector((state) => state.loginDetails);
	// const setOnLogInDetails = useDispatch();
	const authListener = () => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				dispatch(setLoginLoading(true));
				console.log("first");
				firebase
					.firestore()
					.collection("claims")
					.doc(user.uid)
					.get()
					.then((snapshot) => {
						// console.log({snap:snapshot.data()})
						const role = snapshot.data().role;
						if (role) {
							setIsLoggedIn(role);
							dispatch(setLoginLoading(false));
							console.log("second");

							history.push(
								role === "doctor"
									? "/doctor/dashboard"
									: role === "pharmacists"
									? "/pharmacist"
									: "/receptionist"
							);
						}
					})
					.catch(() => {
						if (user) {
							// console.log("this is the recc", user);
							// setUser(user);
							setIsLoggedIn("receptionist");
							dispatch(setLoginLoading(false));
							history.push("/receptionist");
						}
						dispatch(setLoginLoading(false));
						console.log("No user found");
					});

				//

				// console.log("this is user: ", user.email);
				// else if (user) {
				//   // const loginDetails = { isLoggedIn: "admin" };
				//   this.setState({ isLoggedIn: "admin" });
				//   this.setState({ user });
				//   // this.props.setOnLogInDetails(loginDetails);
				//   // localStorage.removeItem("user");
				// }
				// console.log(user);
			}
		});
	};
	console.log({ first: loginDetails.loading });
	return (
		<div className="App">
			{loginDetails.loading ? (
				<div className="fixed bg-[rgba(0,0,0,0.4)] inset-0 z-50 flex justify-center items-center">
					loading
				</div>
			) : null}
			<Switch>
				<Route path="/doctor">
					<DoctorPage />
				</Route>

				{/* <Route path="/patient">
					<PatientPage />
				</Route> */}

				<Route path="/receptionist">
					<SideNavBar />
				</Route>
				<Route path="/Addmedicine">
					<AddMedicine />
				</Route>
				<Route path="/birthreport">
					<BirthRepotAllotment />
				</Route>
				<Route path="/deathreport">
					<DeathRepotAllotment />
				</Route>
				<Route path="/operationreport">
					<OperationAllotment />
				</Route>
				<Route path="/payroll">
					<CreatePayRoll />
				</Route>
				<Route path="/pharmacist">
					<PharmacistDashboard />
				</Route>

				<Route exact path="/">
					<LoginPage />
				</Route>
			</Switch>
		</div>
	);
};

export default App;
