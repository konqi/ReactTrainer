import { Button, TextField } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { ApplicationContext } from "./App";
import { ActionType } from "./state/actions";
import { useState, useContext } from "react";

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
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(1500);
  const { dispatch } = useContext(ApplicationContext);

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <TextField
        id="nameTextField"
        label="Name"
        className={classes.textField}
        value={name}
        onChange={({ target: { value } }) => {
          setName(value);
        }}
        margin="normal"
      />
      <TextField
        id="priceTextField"
        label="Preis"
        className={classes.textField}
        value={String(price)}
        onChange={({ target: { value } }) => {
          const num = Number(value);
          isNaN(num) || (isFinite(num) && setPrice(num));
        }}
        margin="normal"
      />
      <Button
        onClick={() => {
          dispatch!({
            type: ActionType.ADD_TRAINEE,
            payload: {
              name,
              price
            }
          });
        }}
        variant="contained"
        color="primary"
      >
        Anlegen
      </Button>
    </form>
  );
};
