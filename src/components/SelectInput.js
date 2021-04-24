import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  formControlContainer: {
    width: '100%',
    marginTop: 5,
  },
  inputRoot: {
    padding: '10px 8px',
    width: '100%',
    fontSize: 14,
  },
})

class SelectInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
    }
  }

  handleChange = value => {
    const { inputRefs, columnIndex, filterData } = this.props

    inputRefs[columnIndex] = value
    this.setState({ inputValue: value })
    filterData({ isFilterInput: true })
  }

  clearInput = () => {
    const { inputRefs, columnIndex } = this.props

    inputRefs[columnIndex].value = ''
    this.setState({ inputValue: '' })
  }

  handleChangePieGraphClick = value => {
    const { inputRefs, columnIndex, filterData } = this.props

    if (value === this.state.inputValue) {
      inputRefs[columnIndex] = ''
      this.setState({ inputValue: '' })
    } else {
      inputRefs[columnIndex] = value
      this.setState({ inputValue: value })
    }
  }

  render() {
    const {
      inputRefs,
      columnIndex,
      inputFilterSelect,
      KEY,
      label,
      classes,
      columnType,
    } = this.props
    return (
      <FormControl variant="outlined" className={classes.formControlContainer}>
        <Select
          classes={{
            select: classes.inputRoot,
          }}
          ref={el =>
            el &&
            (inputRefs[columnIndex] = {
              name: KEY,
              el,
              label,
              value:
                this.state.inputValue ||
                (inputRefs[columnIndex] && inputRefs[columnIndex].value),
              isSelectInput: true,
              columnType,
            })
          }
          value={
            this.state.inputValue ||
            (inputRefs[columnIndex] && inputRefs[columnIndex].value)
          }
          onChange={e => this.handleChange(e.target.value)}
          clearInput={this.clearInput}
          input={<OutlinedInput />}
          handleChangePieGraphClick={this.handleChangePieGraphClick}
        >
          {inputFilterSelect.map(e => (
            <MenuItem key={e.label} value={e.value}>
              {e.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }
}

export default withStyles(styles)(SelectInput)

SelectInput.propTypes = {
  classes: PropTypes.object.isRequired,
  inputRefs: PropTypes.array.isRequired,
  columnIndex: PropTypes.number.isRequired,
  inputFilterSelect: PropTypes.array.isRequired,
  KEY: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}
