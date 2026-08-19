import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import { MeasurementUnits } from '../../constants/units'
import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'
import TextField from '../Form/TextField'
import { Field, Form, Formik } from 'formik'

const validateInventory = (values) => {
  const errors = {}
  if (!values.name.trim()) {
    errors.name = 'Name is required'
  }
  if (!values.productType) {
    errors.productType = 'Product type is required'
  }
  if (!values.unitOfMeasurement) {
    errors.unitOfMeasurement = 'Unit of measurement is required'
  }
  if (Number(values.averagePrice) < 0) {
    errors.averagePrice = 'Average price cannot be negative'
  }
  if (Number(values.amount) < 0) {
    errors.amount = 'Amount cannot be negative'
  }
  return errors
}

const InventoryFormModal = ({
  formName,
  handleDialog,
  handleInventory,
  initialValues,
  isDialogOpen,
  products,
  title,
}) =>
  <Dialog
    open={isDialogOpen}
    maxWidth='sm'
    fullWidth={true}
    onClose={() => { handleDialog(false) }}
  >
    <Formik
      initialValues={initialValues}
      validate={validateInventory}
      validateOnMount={true}
      onSubmit={values => {
        handleInventory({
          ...values,
          averagePrice: Number(values.averagePrice),
          amount: Number(values.amount),
          bestBeforeDate: values.bestBeforeDate
            ? new Date(`${values.bestBeforeDate}T00:00:00`).toISOString()
            : null,
        })
        handleDialog(true)
      }}>
      {helpers =>
        <Form noValidate autoComplete='off' id={formName}>
          <DialogTitle>{`${title} Inventory`}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  custom={{ variant: 'outlined', fullWidth: true, required: true }}
                  name='name'
                  label='Name'
                  component={TextField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  custom={{ variant: 'outlined', fullWidth: true, required: true, select: true }}
                  name='productType'
                  label='Product Type'
                  component={TextField}
                >
                  {products.map(product =>
                    <MenuItem key={product.id} value={product.name}>{product.name}</MenuItem>
                  )}
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  custom={{ variant: 'outlined', fullWidth: true, required: true, select: true }}
                  name='unitOfMeasurement'
                  label='Unit of Measurement'
                  component={TextField}
                >
                  {Object.entries(MeasurementUnits).map(([value, unit]) =>
                    <MenuItem key={value} value={value}>{unit.name}</MenuItem>
                  )}
                </Field>
              </Grid>
              <Grid item xs={12}>
                <Field
                  custom={{ variant: 'outlined', fullWidth: true, multiline: true, rows: 3 }}
                  name='description'
                  label='Description'
                  component={TextField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  custom={{ variant: 'outlined', fullWidth: true, inputProps: { min: 0, step: 'any' } }}
                  name='averagePrice'
                  label='Average Price'
                  type='number'
                  component={TextField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  custom={{ variant: 'outlined', fullWidth: true, inputProps: { min: 0, step: 'any' } }}
                  name='amount'
                  label='Amount'
                  type='number'
                  component={TextField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  custom={{
                    variant: 'outlined',
                    fullWidth: true,
                    InputLabelProps: { shrink: true },
                  }}
                  name='bestBeforeDate'
                  label='Best Before Date'
                  type='date'
                  component={TextField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name='neverExpires' type='checkbox'>
                  {({ field }) =>
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value}/>}
                      label='Never Expires'
                    />
                  }
                </Field>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { handleDialog(false) }} color='secondary'>Cancel</Button>
            <Button
              disableElevation
              variant='contained'
              type='submit'
              form={formName}
              color='secondary'
              disabled={!helpers.dirty || !helpers.isValid}>
              Save
            </Button>
          </DialogActions>
        </Form>
      }
    </Formik>
  </Dialog>

export default InventoryFormModal
