import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { useState, useEffect } from "react";
import Service from "../../Service/firebase";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
	table: {
		minWidth: 450,
	},
	mv: {
		marginTop: 16,
		marginBottom: 16,
	},
});

export default function PrescriptionTable({
	prescribedDrugsList,
	fetchedData,
}) {
	const reduxDetails = useSelector((state) => state.personDetails);
	const classes = useStyles();
	const [prescribedDrugs, setPrescribedDrugs] = useState(prescribedDrugsList);
	const [isLoading, setIsLoading] = useState(true);

	const firebaseData = async () => {
		const res = await Service.getDrugdetails(reduxDetails.patientid);
		if (res === "error") {
			console.log("Error in get person details data");
		} else {
			setPrescribedDrugs(res);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		firebaseData();
	}, []);
	console.log(fetchedData);
	return isLoading ? (
		<div className="addpersonpage">
			<i className="fas fa-spinner fa-pulse fa-2x"></i>
		</div>
	) : (
		<TableContainer className={classes.mv} component={Paper}>
			<Table className={classes.table} aria-label="prescription table">
				<TableHead>
					<TableRow>
						<TableCell align="right">Drug Name</TableCell>
						<TableCell align="right">Strength</TableCell>
						<TableCell align="right">Instruction</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{prescribedDrugs.map((p, index) => {
						return (
							<TableRow key={index}>
								<>
									<TableCell align="right">{p.drugName}</TableCell>
									<TableCell align="right">{p.strength}</TableCell>
									<TableCell align="right">{p.instructions}</TableCell>
								</>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
