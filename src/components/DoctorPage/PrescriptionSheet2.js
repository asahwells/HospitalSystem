import React, { Component, useStyles } from "react";
import "../PersonDetails/editpersondetailsform.css";
import Reports from "../PersonDetails/reports";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddDrug from "./AddDrug";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Country, State, City } from "country-state-city";
import { Link } from "react-router-dom";

console.log(State.getAllStates().map((namex) => namex));
Country.getAllCountries().map((namex) => namex.name);
class EditPersonDetailsForm extends Component {
	render() {
		return (
			<div className="editd_person_details_formpage">
				<div className="container main_section">
					<div className="topheader">
						<ul>
							<li>
								<Link to="/doctor/patient">
									<i
										className="fa fa-arrow-circle-o-right fa-2x"
										aria-hidden="true"
									></i>
								</Link>
							</li>
							<li>
								<h5>{this.props.personDetails.collectionName}</h5>
							</li>
						</ul>
					</div>
					<hr />
					<Accordion>
						<AccordionSummary
							// expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography>Patient Details</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<div className="row">
								<div className="col-sm-8 first_section">
									<form>
										<div className="form-row">
											<div className="col-md-6 mb-3">
												<label htmlFor="validationDefault01">First name</label>
												<h5> {this.props.personDetails.firstname}</h5>
											</div>
											<div className="col-md-6 mb-3">
												<label htmlFor="validationDefault02">Last name</label>
												<h5> {this.props.personDetails.lastname}</h5>
											</div>
										</div>

										<div className="form-row">
											<div className="col-md-6 mb-3">
												<label htmlFor="validationDefault10">Sex</label>
												<h5> {this.props.personDetails.sex}</h5>
											</div>
											<div className="col-md-6 mb-3">
												<label htmlFor="validationDefault11">Age</label>
												<h5> {this.props.personDetails.age}</h5>
											</div>
										</div>

										<div className="form-row">
											<div className="col-md-6 mb-3">
												<label htmlFor="validationDefault12">Birth Date</label>
												<h5> {this.props.date}</h5>
											</div>
											<div className="col-md-6 mb-3">
												<label htmlFor="validationDefault13">Blood Group</label>
												<h5> {this.props.personDetails.bloodgroup}</h5>
											</div>
										</div>

										<div className="form-row">
											<div className="col-md-12 mb-3">
												<label htmlFor="validationDefault03">Mobile</label>
												<h5> {this.props.personDetails.phonenumber}</h5>
											</div>
										</div>
										<div className="form-row">
											<div className="col-md-12 mb-3">
												<label htmlFor="validationDefault04">Email</label>
												<h5> {this.props.personDetails.email}</h5>
											</div>
										</div>
										<div className="form-row">
											<div className="col-md-12 mb-3">
												<label htmlFor="validationDefault05">Address</label>
												<h5> {this.props.personDetails.address}</h5>
											</div>
										</div>

										<h5>Next of kin</h5>
										<hr />
										<div className="form-row">
											<div className="col-md-12 mb-3">
												<label htmlFor="validationDefault04">Next of kin</label>
												<h5> {this.props.personDetails.Nextofkin}</h5>
											</div>
										</div>
										<div className="form-row">
											<div className="col-md-12 mb-3">
												<label htmlFor="validationDefault04">
													Next of kin email
												</label>
												<h5> {this.props.personDetails.Nextofkinemail}</h5>
											</div>
										</div>
										<div className="form-row">
											<div className="col-md-12 mb-3">
												<label htmlFor="validationDefault04">
													Next of kin address
												</label>
												<h5> {this.props.personDetails.Nextofkinaddress}</h5>
											</div>
											<div className="profileimage">
												{this.props.profileHtmlelEment}
											</div>
										</div>
									</form>
								</div>
							</div>
						</AccordionDetails>
					</Accordion>

					<div style={{ marginTop: "20px" }}>
						<AddDrug />
					</div>
				</div>
				{this.props.personDetails.collectionName === "patients" ? (
					<div className="thrid_section">
						<Reports personDetails={this.props.personDetails}></Reports>
					</div>
				) : null}
			</div>
		);
	}
}

export default EditPersonDetailsForm;
