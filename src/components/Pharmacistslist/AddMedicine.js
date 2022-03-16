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

const AddMedicine = () => {
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
              <h5>AddMedicine</h5>
            </li>
          </ul>
        </div>
        <hr />
       </div>
    </div>
  );
};


export default AddMedicine;
