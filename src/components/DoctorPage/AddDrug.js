/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
// import IconButton from "@material-ui/core/IconButton"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useSnackbar } from "notistack";
import PrescriptionTable from "./PrescriptionTable";
import { useSelector } from "react-redux";
// import { MdAdd, MdRemove } from "react-icons/md"
import Service from "../../Service/firebase";

// import Button from "components/CustomButtons/Button"
const useStyles = makeStyles((theme) =>
	createStyles({
		container: {
			fontFamily: "Poppins",
		},
		root: {
			display: "flex",
			//   justifyContent: "center",
			flexWrap: "wrap",
			"& > *": {
				margin: theme.spacing(0.5),
			},
			marginBottom: theme.spacing(3),
		},
		defaultChip: {
			color: theme.palette.grey[800],
			background: theme.palette.grey[200],
			fontWeight: 500,
			"&:hover": {
				background: "inherit",
			},
		},
		activeChip: {
			//   color: theme.palette.secondary.dark,
			color: "rgba(53,89,209,1)",
			background: "#DADDFF",
			//   background: theme.palette.grey[300],
			fontWeight: 500,
			"&:hover": {
				background: "inherit",
				color: "inherit",
			},
		},
		titleRoot: {
			color: theme.palette.grey[100],
			background: "rgba(53,89,209,1)",
			//   background: theme.palette.secondary.dark,
			padding: `${theme.spacing(5)}px 2rem`,
			textTransform: "lowercase",
		},
	})
);

const AddDrug = () => {
	const reduxDetails = useSelector((state) => state.personDetails);
	console.log("my new reduxDetails", reduxDetails);
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
	// const [open, setOpen] = React.useState<boolean>(false)
	const [dosage, setDosage] = React.useState(1);
	const [instructions, setInstructions] = React.useState("");
	const [drugName, setDrugName] = React.useState("");
	const [strength, setStrength] = React.useState(1);
	const [open, setOpen] = React.useState(false);
	const [prescribedDrugsList, setPrescribedDrugsList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [duration, setDuration] = React.useState(1);
	const [me, setMe] = useState([]);
	const [repeat, setRepeat] = React.useState("Everyday");
	const [timeOfDay, setTimeOfDay] = React.useState([]);
	const [toBeTaken, setToBeTaken] = React.useState("After Food");
	const handleClickOpen = () => {
		setOpen(true);
	};
	console.log("prescribed drug", prescribedDrugsList);
	const onAddDrug = async () => {
		// console.log(drugName);
		if (!drugName) {
			enqueueSnackbar("Please input a Medicine name", {
				variant: "error",
			});
		} else {
			setPrescribedDrugsList((prev) => [
				...prev,
				{ drugName, strength, instructions },
			]);
			setDrugName("");
			setInstructions("");
			setStrength("");
			setOpen(false);
			setIsLoading(true);
			// push to firebase
			await Service.addPatprescriptions(
				{ drugName, strength, instructions },
				"patients",
				reduxDetails.patientid
			);
		}
		// get from firebase
	};
	console.log("fetched data;", me);

	React.useEffect(() => {
		setInstructions(
			`${dosage} tablet${dosage > 1 ? "s" : ""} ${repeat} for ${duration} week${
				duration > 1 ? "s" : ""
			} in the ${timeOfDay.join(", ")} ${toBeTaken}`
		);
	}, [dosage, duration, repeat, timeOfDay, toBeTaken]);

	const handleClose = () => {
		setOpen(false);
	};

	return isLoading ? (
		<div className="addpersonpage">
			<i className="fas fa-spinner fa-pulse fa-2x"></i>
		</div>
	) : (
		<div className={classes.container}>
			<Button
				variant="outlined"
				// disabled={!diagnosis}
				color="primary"
				onClick={handleClickOpen}
			>
				Add Drug
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				// fullWidth
				// maxWidth="md"
			>
				<DialogTitle
					id="form-dialog-title"
					classes={{ root: classes.titleRoot }}
				>
					{instructions}
				</DialogTitle>
				<DialogContent>
					{/* <DialogContentText>
               
              </DialogContentText> */}
					<Grid container>
						<Grid item sm={6}>
							<TextField
								autoFocus
								margin="dense"
								id="medicine"
								label="Medicine Name"
								type="text"
								fullWidth
								onChange={(e) => setDrugName(e.target.value)}
								value={drugName}
							/>
						</Grid>
						<Grid item sm={6}>
							<TextField
								margin="dense"
								id="strength"
								label="Strength"
								type="text"
								fullWidth
								onChange={(e) => setStrength(e.target.value)}
								value={strength}
							/>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item sm={6}>
							<Typography variant="caption" display="block">
								Dosage
							</Typography>
							{/* <IconButton
                    color="secondary"
                    aria-label="add an alarm"
                    // onClick={() => setDosage((d) => (d <= 0 ? 1 : d - 1))}
                    >
                    <MdRemove />
                              </IconButton> */}
							<i
								onClick={() =>
									dosage > 1 && setDosage((d) => (d <= 0 ? 1 : d - 1))
								}
								className="fa fa-arrow-circle-o-right fa-2x"
								aria-hidden="true"
							></i>
							<Typography display="inline">{dosage} tablet</Typography>
							{/* <IconButton
                    color="secondary"
                    aria-label="add an alarm"
                    >
                    <MdAdd />
                  </IconButton> */}
							<i
								onClick={() => setDosage((d) => d + 1)}
								className="fa fa-arrow-circle-o-right fa-2x"
								aria-hidden="true"
							></i>
						</Grid>
						<Grid item sm={6}>
							<Typography variant="caption" display="block">
								Duration (Week)
							</Typography>
							{/* <IconButton
                    color="secondary"
                    aria-label="add an alarm"
                    onClick={() => setDuration((d) => (d <= 1 ? 1 : d - 1))}
                  >
                    <MdRemove /> */}
							{/* </IconButton> */}
							<i
								onClick={() => setDuration((d) => (d <= 1 ? 1 : d - 1))}
								className="fa fa-arrow-circle-o-right fa-2x"
								aria-hidden="true"
							></i>
							<Typography display="inline">{duration} week</Typography>
							{/* <IconButton
                    color="secondary"
                    aria-label="add an alarm"
                    onClick={() => setDuration((d) => d + 1)}
                  >
                    <MdAdd />
                  </IconButton> */}

							<i
								onClick={() => setDuration((d) => d + 1)}
								className="fa fa-arrow-circle-o-right fa-2x"
								aria-hidden="true"
							></i>
						</Grid>
					</Grid>
					<Typography variant="caption">Repeat</Typography>
					<div className={classes.root}>
						{["Everyday", "Alternate Days", "Specific Days"].map((day, i) => (
							<Chip
								key={day + i}
								label={day}
								color="secondary"
								onClick={() => setRepeat(day)}
								classes={{
									colorSecondary:
										day === repeat ? classes.activeChip : classes.defaultChip,
								}}
							/>
						))}
						{repeat !== "Everyday" && (
							<TextField
								autoFocus
								margin="dense"
								id="repeat"
								label="Enter Day(s)"
								type="text"
								onChange={(e) => setRepeat(e.target.value)}
							/>
						)}
					</div>
					<Typography variant="caption">Time of day</Typography>
					<div className={classes.root}>
						{["Morning", "Noon", "Evening", "Night"].map((day, i) => (
							<Chip
								key={day + i}
								label={day}
								color="secondary"
								onClick={() =>
									setTimeOfDay((prev) =>
										!prev.includes(day)
											? [...prev, day]
											: prev.filter((item) => item !== day)
									)
								}
								classes={{
									colorSecondary: timeOfDay.includes(day)
										? classes.activeChip
										: classes.defaultChip,
								}}
							/>
						))}
					</div>
					<Typography variant="caption">To be taken</Typography>
					<div className={classes.root}>
						{["Before Food", "After Food"].map((time, i) => (
							<Chip
								key={i + time}
								label={time}
								color="secondary"
								onClick={() => setToBeTaken(toBeTaken !== time ? time : "")}
								classes={{
									colorSecondary:
										toBeTaken === time
											? classes.activeChip
											: classes.defaultChip,
								}}
							/>
						))}
					</div>
					{/* <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
              /> */}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancel
					</Button>
					<Button onClick={onAddDrug} color="secondary">
						Add Drug
					</Button>
				</DialogActions>
			</Dialog>
			<div>
				<PrescriptionTable
					prescribedDrugsList={prescribedDrugsList}
					fetchedData={me}
				/>
			</div>
		</div>
	);
};

export default AddDrug;
