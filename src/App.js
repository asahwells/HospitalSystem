import React, { Component, useState, useEffect } from "react";
import SideNavBar from "./components/sideNavBar";
import firebase from "./firebase";
import LoginPage from "./components/Login/Login";
import { setLogInDetails } from "./actions/setpersondetailsaction";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import DoctorPage from "./components/DoctorPage/DoctorPage";
import PatientPage from "./components/DoctorPage/PatientPage";
import { es } from "date-fns/locale";
import AddMedicine from "./components/Pharmacistslist/AddMedicine";
import PharmacistDashboard from "./components/Pharmacistslist/PharmacistDashboard"

const App = () => {
	// const [user, setUser] = useState(null);

	useEffect(() => {
		authListener();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [isLoggedIn, setIsLoggedIn] = useState(null);
	console.log(isLoggedIn);
	const history = useHistory();
	// const loginDetails = useSelector((state) => state.loginDetails);
	// const setOnLogInDetails = useDispatch();
	// console.log("my loginDetails", loginDetails);
	const authListener = () => {
		firebase.auth().onAuthStateChanged((user) => {
			firebase
				.firestore()
				.collection("claims")
				.doc(user.uid)
				.get()
				.then((snapshot) => {
					// console.log({snap:snapshot.data()})
					const role = snapshot.data().role;
					console.log("my new doctorid:", role);
					setIsLoggedIn(role);
					history.push(
						role === "doctor"
							? "/doctor"
							: role === "pharmacists"
							? "/PharmacistDashboard"
							: "/receptionist"
					);
					return;
				})
				.catch(() => console.log("No user found"));

			if (user && isLoggedIn === null) {
				console.log("this is the recc", user);
				// setUser(user);
				setIsLoggedIn("receptionist");
				history.push("/receptionist");
			}

			// console.log("this is user: ", user.email);
			// else if (user) {
			//   // const loginDetails = { isLoggedIn: "admin" };
			//   this.setState({ isLoggedIn: "admin" });
			//   this.setState({ user });
			//   // this.props.setOnLogInDetails(loginDetails);
			//   // localStorage.removeItem("user");
			// }
			// console.log(user);
		});
	};

	return (
		<div className="App">
			<Switch>
				<Route path="/doctor">
					<DoctorPage />
				</Route>

				<Route path="/patientpage">
					<PatientPage />
				</Route>

				<Route path="/receptionist">
					<SideNavBar />
				</Route>
				<Route path="/Addmedicine">
					<AddMedicine />
				</Route>
        <Route path='/PharmacistDashboard'>
          <PharmacistDashboard/>
        </Route>

				<Route exact path="/">
					<LoginPage />
				</Route>
			</Switch>
		</div>
	);
};

export default App;
