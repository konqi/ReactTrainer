import { Button, TextField } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { ApplicationContext } from "./App";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "grid",
      gridTemplateRows: "auto auto auto",
      justifyItems: "center"
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200
    },
    dense: {
      marginTop: 19
    },
    menu: {
      width: 200
    }
  })
);

export const CreateTrainee = () => {
  const classes = useStyles();
  const { state, dispatch } = React.useContext(ApplicationContext);
  return (
    <form className={classes.container} noValidate autoComplete="off">
      <TextField
        id="standard-name"
        label="Name"
        className={classes.textField}
        value={"Name"}
        onChange={() => {}}
        margin="normal"
      />
      <TextField
        id="standard-name"
        label="Preis"
        className={classes.textField}
        value={"Preis"}
        onChange={() => {}}
        margin="normal"
      />
      <Button
        onClick={() => {
          console.log("hello");
        }}
        variant="contained"
        color="primary"
      >
        Anlegen
      </Button>
    </form>
  );
};
