import {Button, TextField} from '@material-ui/core'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import * as React from 'react'
import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {createAddTraineeIntend} from '../state/intends/UserIntend'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'grid',
      gridTemplateRows: 'auto auto auto',
      justifyItems: 'center',
    },
    textField: {
      // marginLeft: theme.spacing(1),
      // marginRight: theme.spacing(1),
    },
  })
)

export const CreateTrainee: React.FC = () => {
  const classes = useStyles()
  const [name, setName] = useState('')
  const [price, setPrice] = useState<number>(15)
  const dispatch = useDispatch()

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
        fullWidth
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
        fullWidth
        margin="normal"
      />
      <Button
        onClick={() =>
          dispatch(
            createAddTraineeIntend({
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
