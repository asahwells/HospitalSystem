import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";

const useStyles = makeStyles({
  table: {
    minWidth: 450,
  },
  mv: {
    marginTop: 16,
    marginBottom: 16,
  },
});

export default function PrescriptionTable({ prescribedDrugsList }) {
  const classes = useStyles();


  console.log(",y new new ", prescribedDrugsList);
  return (
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
            {prescribedDrugsList.map((p, index) => {
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
