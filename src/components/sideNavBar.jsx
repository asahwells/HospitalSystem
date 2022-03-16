import React, { useState} from "react";
import "./sliderNavBar.css";
// import { Link } from "react-router";
// import LoginPage from "./components/Login/Login";

import AddPersonDetails from "./PersonDetails/addpersondetails";
import PatienList from "./Patients/patientlist";
import DoctorsLis from "./Doctors/doctorslist";
import BedAllotment from "./Bed/bedallotment";
import EditPersonDetails from "./PersonDetails/editpersondetails";

import Bedlist from "./Bed/bedlist";
import MedicineList from "./Medicine/medicinelist";
import BloodBagList from "./Bloodbag/bloodbaglist";
import NurseList from "./Nurses/nurselist";
import PharmacistsList from "./Pharmacistslist/pharmacistslist";
import LaboratoristList from "./Laboratorist/laboratoristlist";
import AccountantList from "./Accountant/accountantlist";
import ReceptionistList from "./Receptionist/receptionistlist";

import DeathReportList from "./DeathReport/deathreportlist";
import DeathRepotAllotment from "./DeathReport/deathreportallotment";

import BirthReportList from "./BirthReport/birthreportlsit";
import BirthRepotAllotment from "./BirthReport/birthreportallotment";
import PayrollList from "./Payroll/payrolllist";
import Dashboard from "./Dashboard/dashboard";
import OperationAllotment from "./OperationReprot/operationallotment";
import OperationReportList from "./OperationReprot/operationreportlist";
import CreatePayRoll from "./Payroll/createpayroll";
import firebase from "../firebase";
import {
  BrowserRouter as Routers,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory
} from "react-router-dom";

const SideNavBar =()=> {
  const history = useHistory();
  const [addHamburgerClass, setAddHamburgerClass] = useState(false)
  const [addTitleClass, setAddTitleClass] = useState(true)
  const [patientdetails, setPatientdetails] = useState(null)
  const [togglePymentTitle, setTogglePymentTitle] = useState(true)
  const [selectedCat, setSelectedCat] = useState("")


 const getData = (data) => {
   setPatientdetails(data)
  };

    const toggleHamburger = () => {
    setAddHamburgerClass(!addHamburgerClass)
  };
   const toggleTitle = () => {
   setAddTitleClass(!addTitleClass)
  };
   const togglePyment = () => {
   setTogglePymentTitle(!togglePymentTitle)
  };
   const logout = () => {
    firebase.auth().signOut();
    history.push("/")
  };
   const setTitleActive = (selectedCat) => {
   setSelectedCat(selectedCat)
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
                <Link to="/receptionist">
                  <li
                    className={
                      selectedCat === "Dashboard" ? "active" : ""
                    }
                    onClick={() => setTitleActive("Dashboard")}
                  >
                    <span className="icon">
                      <i className="fa fa-home" aria-hidden="true"></i>
                    </span>
                    <span className="title">Dashboard</span>
                  </li>
                </Link>
                <Link to="/patientlist">
                  <li
                    className={
                      selectedCat === "Patient" ? "active" : ""
                    }
                    onClick={() => setTitleActive("Patient")}
                  >
                    <span className="icon">
                      <i className="fa fa-user" aria-hidden="true"></i>
                    </span>
                    <span className="title">Patient</span>
                  </li>
                </Link>
                <Link to="/doctorslist">
                  <li
                    className={
                      selectedCat === "Doctors" ? "active" : ""
                    }
                    onClick={() => setTitleActive("Doctors")}
                  >
                    {" "}
                    <span className="icon">
                      <i className="fa fa-user-md" aria-hidden="true"></i>
                    </span>
                    <span className="title">Doctors</span>
                  </li>
                </Link>
                <Link to="/nurselist">
                  <li
                    className={
                      selectedCat === "Nurse" ? "active" : ""
                    }
                    onClick={() => setTitleActive("Nurse")}
                  >
                    <span className="icon">
                      <i className="fa fa-female" aria-hidden="true"></i>
                    </span>
                    <span className="title">Nurse</span>
                  </li>
                </Link>

                <Link to="/pharmacistslist">
                  <li
                    className={
                      selectedCat === "pharmacist" ? "active" : ""
                    }
                    onClick={() => setTitleActive("pharmacist")}
                  >
                    <span className="icon">
                      <i className="fa fa-medkit" aria-hidden="true"></i>
                    </span>
                    <span className="title">pharmacist</span>
                  </li>
                </Link>

                <Link to="/laboratoristlist">
                  <li
                    className={
                      selectedCat === "Laboratorist" ? "active" : ""
                    }
                    onClick={() => setTitleActive("Laboratorist")}
                  >
                    <span className="icon">
                      <i className="fa fa-flask" aria-hidden="true"></i>
                    </span>
                    <span className="title">Laboratorist</span>
                  </li>
                </Link>

                <Link to="/accountantlist">
                  <li
                    className={
                      selectedCat === "Accountant" ? "active" : ""
                    }
                    onClick={() => setTitleActive("Accountant")}
                  >
                    <span className="icon">
                      <i className="fa fa-money" aria-hidden="true"></i>
                    </span>
                    <span className="title">Accountant</span>
                  </li>
                </Link>

                <Link to="/receptionistlist">
                  <li
                    className={
                      selectedCat === "Receptionist" ? "active" : ""
                    }
                    onClick={() => setTitleActive("Receptionist")}
                  >
                    <span className="icon">
                      <i className="fa fa-briefcase" aria-hidden="true"></i>
                    </span>
                    <span className="title">Receptionist</span>
                  </li>
                </Link>
              </ul>
            </div>
            <hr />

            <div className="withsubcat">
              <div className="maincat">
                <ul>
                  <li onClick={toggleTitle}>
                    <span className="icon">
                      <i className="fa fa-h-square" aria-hidden="true"></i>
                    </span>
                    <span className="title">Manage Hospital</span>
                  </li>
                </ul>
              </div>

              <div className={titleClass.join(" ")}>
                <ul>
                  <li
                    className={
                      selectedCat === "BedAllotment" ? "active" : ""
                    }
                    onClick={() => setTitleActive("BedAllotment")}
                  >
                    <Link to="/bedlist">
                      {" "}
                      <span className="subtitle">Bed Allotment</span>
                    </Link>
                  </li>

                  <li
                    className={
                      selectedCat === "Medicine" ? "active" : ""
                    }
                    onClick={() => setTitleActive("Medicine")}
                  >
                    {" "}
                    <Link to="/medicinelist">
                      {" "}
                      <span className="subtitle">Medicine</span>
                    </Link>
                  </li>
                  <li
                    className={
                      selectedCat === "BloodBag" ? "active" : ""
                    }
                    onClick={() => setTitleActive("BloodBag")}
                  >
                    {" "}
                    <Link to="/bloodbaglist">
                      {" "}
                      <span className="subtitle">Blood Bag</span>
                    </Link>
                  </li>
                  <li
                    className={
                      selectedCat === "OperationReport"
                        ? "active"
                        : ""
                    }
                    onClick={() => setTitleActive("OperationReport")}
                  >
                    {" "}
                    <Link to="/operationreportlist">
                      {" "}
                      <span className="subtitle">Operation Report</span>
                    </Link>
                  </li>
                  <li
                    className={
                      selectedCat === "BirthReport" ? "active" : ""
                    }
                    onClick={() => setTitleActive("BirthReport")}
                  >
                    {" "}
                    <Link to="/birthreportlist">
                      {" "}
                      <span className="subtitle">Birth Report</span>
                    </Link>
                  </li>
                  <li
                    className={
                      selectedCat === "DeathReport" ? "active" : ""
                    }
                    onClick={() => setTitleActive("DeathReport")}
                  >
                    {" "}
                    <Link to="/deathreportlist">
                      {" "}
                      <span className="subtitle">Death Report</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <hr />

              <div className="withsubcat">
                <div className="maincat">
                  <ul>
                    <li onClick={togglePymentTitle}>
                      <span className="icon">
                        <i
                          className="fa fa-credit-card-alt"
                          aria-hidden="true"
                        ></i>
                      </span>
                      <span className="title">Payments</span>
                    </li>
                  </ul>
                </div>

                <div className={toggle.join(" ")}>
                  <ul>
                    <li
                      className={
                        selectedCat === "CreatePayroll"
                          ? "active"
                          : ""
                      }
                      onClick={() => setTitleActive("CreatePayroll")}
                    >
                      {" "}
                      <Link to="/createpayroll">
                        <span className="subtitle">Create Payroll</span>
                      </Link>
                    </li>
                    <li
                      className={
                        selectedCat === "Payroll" ? "active" : ""
                      }
                      onClick={() => setTitleActive("Payroll")}
                    >
                      {" "}
                      <Link to="/payrolllist">
                        {" "}
                        <span className="subtitle">Payroll</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <hr />
              </div>
            </div>
          </div>

          <div className="main_container">
            <Switch>
              <Route exact path="/receptionist">
                <Dashboard />
              </Route>
              <Route path="/patientlist">
                <PatienList />
              </Route>

              <Route path="/addpatient">
                <AddPersonDetails />
              </Route>

              <Route path="/editpersondetails">
                <EditPersonDetails />
              </Route>

              <Route path="/doctorslist">
                <DoctorsLis />
              </Route>
              <Route path="/bedlist">
                <Bedlist />
              </Route>
              <Route path="/bedlistt/bedallotment">
                <BedAllotment />
              </Route>
              <Route path="/medicinelist">
                <MedicineList />
              </Route>
              <Route path="/bloodbaglist">
                <BloodBagList />
              </Route>

              <Route path="/operationreportlist/operationreport">
                <OperationAllotment />
              </Route>
              <Route path="/operationreportlist">
                <OperationReportList />
              </Route>
              <Route path="/deathreportlist/deathreportallotment">
                <DeathRepotAllotment />
              </Route>
              <Route path="/deathreportlist">
                <DeathReportList />
              </Route>
              <Route path="/birthreportlist/birthreportallotment">
                <BirthRepotAllotment />
              </Route>
              <Route path="/birthreportlist">
                <BirthReportList />
              </Route>
              <Route path="/nurselist">
                <NurseList />
              </Route>
              <Route path="/pharmacistslist">
                <PharmacistsList />
              </Route>

              <Route path="/laboratoristlist">
                <LaboratoristList />
              </Route>

              <Route path="/accountantlist">
                <AccountantList />
              </Route>

              <Route path="/receptionistlist">
                <ReceptionistList />
              </Route>

              <Route path="/createpayroll">
                <CreatePayRoll />
              </Route>
              <Route path="/payrolllist">
                <PayrollList />
              </Route>
              <Redirect to="" />
            </Switch>
          </div>
        </Routers>
      </div>
    );
  }

export default SideNavBar;
