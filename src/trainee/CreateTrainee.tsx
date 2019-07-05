import {Button, TextField} from '@material-ui/core'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import * as React from 'react'
import {ApplicationContext} from '../context'
import {useState, useContext} from 'react'
import {createAddTraineeAction} from '../state/trainees'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'grid',
      gridTemplateRows: 'auto auto auto',
      justifyItems: 'center',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
  })
)

export const CreateTrainee: React.FC = () => {
  const classes = useStyles()
  const [name, setName] = useState('')
  const [price, setPrice] = useState<number>(15)
  const {dispatch} = useContext(ApplicationContext)

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <TextField
        id="nameTextField"
        label="Name"
        className={classes.textField}
        value={name}
        onChange={({target: {value}}) => {
          setName(value)
        }}
        margin="normal"
      />
      <TextField
        id="priceTextField"
        type="number"
        label="Preis"
        className={classes.textField}
        value={String(price)}
        onChange={({target: {value}}) => {
          if (typeof value !== 'string') {
            return
          }
          if ((value as string).length < 1) {
            return
          }
          const num = Number(value)
          isNaN(num) || (isFinite(num) && setPrice(num))
        }}
        margin="normal"
      />
      <Button
        onClick={() =>
          dispatch!(
            createAddTraineeAction({
              name,
              price,
            })
          )
        }
        variant="contained"
        color="primary"
      >
        Anlegen
      </Button>
    </form>
  )
}
