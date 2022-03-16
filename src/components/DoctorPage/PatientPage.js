import React, { useEffect, useState } from "react";
import "../Patients/patientlist.css";
import { Link } from "react-router-dom";
import {
  setpersonDetails,
  setReportDetails,
} from "../../actions/setpersondetailsaction";
import { connect, useDispatch, useSelector } from "react-redux";
import FormPrompt from "../DailogBoxes/formprompt";
// import AddPersonDetails from "../PersonDetails/addpersondetails";
import AlertDialogBox from "../DailogBoxes/alertdailogbox";
import ConfirmDialogBox from "../DailogBoxes/confirmdailogbox";
import ErorrDialogBox from "../DailogBoxes/errordaologbox";
import Service from "../../Service/firebase";

const PatientPage = () => {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [isLoadMoredata, setIsLoadMoredata] = useState(true);
  const [isCloseBtnAppear, setIsCloseBtnAppear] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalNumOfPatient, setTotalNumOfPatient] = useState(null);
  const [noMoreDataText, setNoMoreDataText] = useState("");
  const [openFormDailog, setOpenFormDailog] = useState(false);
  const [openAlertDailog, setOpenAlertDailog] = useState(false);
  const [openErrorDailog, setOpenErrorDailog] = useState(false);
  const [openConfirmDailog, setOpenConfirmDailog] = useState(false);
  const [patientlist, setPatientlist] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchDataShow, setIsSearchDataShow] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");

  useEffect(() => {
    onSetTotalNumOfPatient();
    onFetchData(limit);
  }, []);
  const showMore = () => {
    if (limit <= totalNumOfPatient) {
      const limits = limit + 10;
      setLimit(limits);
      onFetchData(limits);
    } else {
      setNoMoreDataText("No more patients");
    }
  };
  const onSetTotalNumOfPatient = async () => {
    setIsLoading(true);
    const res = await Service.getTotalNumOfPerson("patients");
    if (res === "error") {
      console.log("error");
      setIsLoading(false);
    } else {
      setTotalNumOfPatient(res);
      setIsLoading(false);
    }
  };

  const onFetchData = async (limit) => {
    setIsLoadMoredata(true);
    const fetchedDataList = await Service.getData("patients", limit);

    if (fetchedDataList.length !== 0) {
      setPatientlist(fetchedDataList);
      setIsLoadMoredata(false);
      setIsLoading(false);
    } else {
      setPatientlist(fetchedDataList);
      setIsLoadMoredata(false);
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchText === "" || null) {
      window.location.reload(false);
    } else {
      setIsSearching(true);
      setIsSearchDataShow(true);

      const searchTexts = searchText.toLowerCase().replace(/\s/g, "");

      const resultPatientlist = await Service.getSearchRes(
        "patients",
        searchTexts
      );
      if (resultPatientlist === "error") {
        setIsSearching(false);
        setOpenErrorDailog(true);
      } else {
        setPatientlist(resultPatientlist);
        setIsSearching(false);
      }
    }
  };

  const handleSuccessDailog = () => {
    setOpenFormDailog(false);
    setOpenAlertDailog(true);
  };

  const handleErrorDailog = () => {
    setOpenFormDailog(false);
    setOpenConfirmDailog(false);
    setOpenErrorDailog(true);
  };
  const closeFormDailog = () => {
    setOpenFormDailog(false);
  };
  const closeAlertDailog = () => {
    setOpenAlertDailog(false);
    window.location.reload(false);
  };
  const closeErrorDailog = () => {
    setOpenErrorDailog(false);
  };
  const closeConfirmDailog = () => {
    setOpenConfirmDailog(false);
  };
  const setCloseBtnAppear = () => {
    setIsCloseBtnAppear(false);
  };
  const setOnPatientDetails = useDispatch();
  const setOnReportDetails = useDispatch();
  let count = 0;
  return isLoading ? (
    <div className="patientlistpage">
      <i className="fas fa-spinner fa-pulse fa-2x "></i>
    </div>
  ) : (
    <div className="patientlistpage">
      <div className="main_section">
        <ErorrDialogBox
          openDailog={openErrorDailog}
          onSetOpenDailog={closeErrorDailog}
          title="Error"
          des="Someting went wrong. Try again"
        ></ErorrDialogBox>

        <div className="topheader">
          <ul>
            <li>
              <i
                className="fa fa-arrow-circle-o-right fa-2x"
                aria-hidden="true"
              ></i>
            </li>
            <li>
              <h5>Patient</h5>
            </li>
          </ul>
        </div>
        <hr />
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
                    onChange={(e) => setSearchText(e.target.value)}
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
              <li style={{ fontSize: "12px" }}> #</li>
              <li tyle={{ fontSize: "12px" }}>{patientlist.length} </li>
            </ul>
          </div>
        </div>
        <table className="table table-striped">
          <thead className="thead tablehead">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Profile</th>
              <th scope="col">Name</th>
              <th scope="col">Sex</th>
              <th scope="col">Age</th>
              <th scope="col">Blood Group</th>
              <th scope="col">Mobile</th>
              {/* <th scope="col">Email</th> */}
              <th scope="col">City</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">Option</th>
            </tr>
          </thead>
          {isSearching ? (
            <i className="fas fa-spinner fa-pulse fa-2x "></i>
          ) : patientlist.length === 0 ? (
            <tbody>
              <tr>
                <td>No Patient Found</td>
              </tr>
            </tbody>
          ) : (
            <tbody className="tablebody">
              {patientlist &&
                patientlist.map((p) => {
                  count++;
                  let date = new Date(p.timeStamp.toDate());
                  const createdTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                  const createdDate = `${date.getDate()}/${
                    date.getMonth() + 1
                  }/${date.getFullYear()}`;

                  return (
                    <tr key={p.patientid}>
                      <td className="align-middle">{count}</td>
                      <td className="align-middle">
                        {p.imgaeurl === "" ? (
                          <div className="userbg">
                            <i className="fa fa-user fa-2x"></i>
                          </div>
                        ) : (
                          <img className="image" alt="" srcSet={p.imgaeurl} />
                        )}
                      </td>
                      <td className="align-middle">
                        {p.firstname + " " + p.lastname}
                      </td>
                      <td className="align-middle">{p.sex}</td>
                      <td className="align-middle">
                        {p.age === "" ? "N/A" : p.age}
                      </td>
                      <td className="align-middle">
                        {p.bloodgroup === "" ? "N/A" : p.bloodgroup}
                      </td>
                      <td className="align-middle">
                        {" "}
                        {p.phonenumber === "" ? "N/A" : p.phonenumber}
                      </td>
                      {/* <td className="align-middle">
                          {" "}
                          {p.email == "" ? "N/A" : p.email}
                        </td> */}
                      <td className="align-middle">
                        {p.city === "" ? "N/A" : p.city}
                      </td>
                      <td className="align-middle">
                        {createdDate === "" ? "N/A" : createdDate}
                      </td>
                      <td className="align-middle">
                        {createdTime === "" ? "N/A" : createdTime}
                      </td>
                      <td className="align-middle">
                        <Link to="/prescriptionsheet">
                          <button
                            onClick={async () => {
                              const sendData = {
                                ...p,
                                collectionName: "patients",
                                personId: p.patientid,
                              };
                              const reportDetails = {
                                bedallotementid: p.bedallotementid,
                                operationreportid: p.operationreportid,
                                birthreportid: p.birthreportid,
                                deathreportid: p.deathreportid,
                              };
                              setOnPatientDetails(setpersonDetails(sendData));
                              setOnReportDetails(
                                setReportDetails(reportDetails)
                              );
                              console.log("my sendData:", sendData);
                            }}
                            type="button"
                            className="btn btn-success"
                          >
                            <i className="fa fa-edit" aria-hidden="true"></i>
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          )}
        </table>

        <div className="loadmoredatasection">
          {isLoadMoredata ? (
            <i className="fas fa-spinner fa-pulse fa-2x loadmoredataspinner"></i>
          ) : (
            <div className="nomoredatatext">{noMoreDataText}</div>
          )}
          {patientlist.length === 0 ? null : isSearchDataShow ? null : (
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => showMore()}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// const mapDisptachToProps = (dispatch) => {
//   return {
//     setOnPatientDetails: (p) => {
//       dispatch(setpersonDetails(p));
//       console.log("this is :", p);
//     },
//     setOnReportDetails: (p) => {
//       dispatch(setReportDetails(p));
//     },
//   };
// };

export default PatientPage;
