import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useContext } from "react";
import { ApplicationContext } from "./App";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginTop: theme.spacing(3),
      overflowX: "auto"
    },
    table: {
      minWidth: "85%"
    }
  })
);

export const TraineeList = () => {
  const classes = useStyles();

  const { state } = useContext(ApplicationContext);

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Preis</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state!.trainees.map(trainee => (
            <TableRow key={trainee.name}>
              <TableCell component="th" scope="row">
                {trainee.name}
              </TableCell>
              <TableCell align="right">{trainee.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};
