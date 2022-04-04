import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import "./dailogboses.css";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function FormPromptsec(props) {
	return (
		<Dialog
			className="dialogBox"
			open={props.openDailogs}
			TransitionComponent={Transition}
			keepMounted
			// onClose={handleClose}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
		>
			<DialogTitle id="alert-dialog-slide-title">
				<div className="container header">
					<div className="title">
						<h5>{props.title}</h5>
						{props.isCloseBtnAppears === true ? (
							<button
								onClick={props.onSetOpenDailogs}
								type="button"
								className="btn btn-light"
							>
								<i className="fa fa-times" aria-hidden="true"></i>
							</button>
						) : null}
					</div>
				</div>
			</DialogTitle>
			<DialogContent>
				{props.children}
				{/* <DialogContentText id="alert-dialog-slide-description children">
         
        </DialogContentText> */}
			</DialogContent>
			{/* <DialogActions>
       
        <Button onClick={handleClose} color="primary">
          OK
        </Button>
      </DialogActions> */}
		</Dialog>
	);
}
