import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Paper, Typography } from '@material-ui/core'
import _ from 'lodash'
import moment from 'moment'
import Relatorio from './relatorio'
import { dateToString, datetimeToString } from '../utils/dateHelpers'

class RelatorioIndex extends Component {
  debounceFilterForInput = _.debounce(
    ({ data, isFilterInput, reRenderPieGraph }) => {
      let filteredList = []

      let inputsWhithValue = this.state.inputRefs.filter(input => {
        if (input.columnType == 'date' || input.columnType == 'datetime') {
          if (input.value !== '') {
            return input
          }
        } else if (input.isSelectInput) {
          if (input.value !== '' && input.value !== undefined) {
            return input
          }
        } else if (input.el.value !== '') {
          return input
        }
      })

      if (inputsWhithValue.length === 0 && isFilterInput) {
        this.setFilteredData([], false)

        if (reRenderPieGraph) {
          reRenderPieGraph()
        }
        return
      }

      let lista = JSON.parse(JSON.stringify(data))

      lista.map(obj => {
        let passedForFilters = 0

        inputsWhithValue.map(input => {
          console.log('input.columnType', input.columnType)
          let nome = input.name
          let inputValue = input.el.value || input.el.props.value

          if (input.columnType == 'date') {
            if (input.value == obj[nome]) {
              passedForFilters++
            }
          } else if (input.columnType == 'datetime') {
            let stringDatePoint = datetimeToString(obj[nome])
            let formatedDate = moment(stringDatePoint).format('DD/MM/YYYY')

            if (input.value == formatedDate) {
              passedForFilters++
            }
          } else if (input.columnType == 'numeric') {

            if ( obj[nome]?.toString().includes(inputValue)) {
              passedForFilters++
            }
          } else if (
            obj[nome] &&
            obj[nome]
              .toLowerCase()
              .trim()
              .includes(inputValue.toLowerCase().trim())
          ) {
            passedForFilters++
          }
        })

        if (passedForFilters == inputsWhithValue.length) {
          filteredList.push(obj)
        }
      })

      this.setFilteredData(filteredList, true, reRenderPieGraph)
    },
    600
  )

  constructor(props) {
    super(props)
    this.state = {
      inputRefs: [],
      originalData: [],
      filteredData: [],
      filtered: false,
    }
  }

  componentDidMount() {
    const { data } = this.props

    this.setState({
      originalData: [...data],
    })
  }

  setFilteredData = async (filteredData, filtered, reRenderPieGraph) => {
    await this.setState({
      filteredData,
      filtered,
    })

    if (reRenderPieGraph) {
      reRenderPieGraph()
    }
  }

  filterDataClickEvent = ({
    pieGraphEvent,
    selectedColumn,
    reRenderPieGraph,
    data,
  }) => {
    if (selectedColumn.noFilter) {
      return
    }

    let pointName = pieGraphEvent.point.name

    if (pointName == 'Indefinido') return

    const { inputRefs } = this.state
    let selectedInput = inputRefs.find(
      input => input && input.name == selectedColumn.dataKey
    )

    if (selectedColumn.type == 'date') {
      let stringDatePoint = dateToString(pointName)
      let formatedDate = moment(stringDatePoint).format('DD/MM/YYYY')

      if (selectedInput.value == formatedDate) {
        selectedInput.value = ''
        selectedInput.el.props.handleDateChangeOnPieGraphClick(null)
      } else {
        selectedInput.value = formatedDate
        selectedInput.el.props.handleDateChangeOnPieGraphClick(stringDatePoint)
      }

      this.filterData({ data, isFilterInput: true, reRenderPieGraph })
    } else if (selectedColumn.type == 'datetime') {
      let stringDatePoint = datetimeToString(pointName)
      let formatedDate = moment(stringDatePoint).format('DD/MM/YYYY')

      if (selectedInput.value == formatedDate) {
        selectedInput.value = ''
        selectedInput.el.props.handleDateChangeOnPieGraphClick(null)
      } else {
        selectedInput.value = formatedDate
        selectedInput.el.props.handleDateChangeOnPieGraphClick(stringDatePoint)
      }

      this.filterData({ data, isFilterInput: true, reRenderPieGraph })
    } else if (selectedInput.isSelectInput) {
      selectedInput.el.props.handleChangePieGraphClick(pointName)
      this.filterData({ data, isFilterInput: true, reRenderPieGraph })
    } else {
      if (selectedInput && selectedInput.el.value == pointName) {
        selectedInput.el.value = ''
      } else if (selectedInput) {
        selectedInput.el.value = pointName
      }

      this.filterData({ data, isFilterInput: true, reRenderPieGraph })
    }
  }

  setSortedData = data => {
    if (this.state.filtered) {
      this.setState({
        filteredData: data,
      })
    } else {
      this.setState({
        originalData: data,
      })
    }
  }

  filterData = ({
    data = this.state.originalData,
    isFilterInput,
    isClearFilter,
    columnType,
    reRenderPieGraph,
  }) => {
    if (isFilterInput) {
      return this.debounceFilterForInput({
        data,
        isFilterInput,
        columnType,
        reRenderPieGraph,
      })
    }

    let filteredList = []

    let inputsWhithValue = this.state.inputRefs.filter(input => {
      if (input.columnType == 'date' || input.columnType == 'datetime') {
        if (input.value) {
          return input
        }
      } else if (input.isSelectInput) {
        if (input.value !== '' && input.value !== undefined) {
          return input
        }
      } else if (input.el.value !== '') {
        return input
      }
    })

    if (inputsWhithValue.length === 0 && (isFilterInput || isClearFilter)) {
      this.setFilteredData([], false)
      return
    }

    let lista = JSON.parse(JSON.stringify(data))

    lista.map(obj => {
      let passedForFilters = 0

      inputsWhithValue.map(input => {
        let nome = input.name
        let inputValue = input.el.value || input.el.props.value

        if (input.columnType == 'date') {
          if (input.value == obj[nome]) {
            passedForFilters++
          }
        } else if (input.columnType == 'datetime') {
          let stringDatePoint = datetimeToString(obj[nome])
          let formatedDate = moment(stringDatePoint).format('DD/MM/YYYY')

          if (input.value == formatedDate) {
            passedForFilters++
          }
        } else if (input.columnType == 'numeric') {
          if (input.value == obj[nome]) {
            passedForFilters++
          }
        } else if (
          obj[nome] &&
          obj[nome]
            .toLowerCase()
            .trim()
            .includes(inputValue.toLowerCase().trim())
        ) {
          passedForFilters++
        }
      })

      if (passedForFilters == inputsWhithValue.length) {
        filteredList.push(obj)
      }
    })

    if (isFilterInput || isClearFilter) {
      this.setFilteredData(filteredList, true)
      return
    }

    return filteredList
  }

  reRenderAfterClearFilter = () => {
    this.setState({
      originalData: this.state.originalData,
      filteredData: [],
      filtered: false,
    })
  }

  render() {
    const {
      customColumns,
      noFilters,
      rowHeight,
      noBottomTotal,
      renderGraphBtn,
      tableHeight,
    } = this.props

    let colunasArray = []

    customColumns.filter(e => {
      colunasArray.push(e.dataKey)
    })

    let dataToRender = this.state.filtered
      ? this.state.filteredData
      : this.state.originalData

    return (
      <Paper style={{ padding: 10, height: tableHeight }}>
        {this.state.originalData.length > 0 ? (
          <div style={{ height: '100%' }}>
            <Relatorio
              colunasArray={colunasArray}
              setSortedData={this.setSortedData}
              setFilteredData={this.setFilteredData}
              filteredData={this.state.filteredData}
              data={dataToRender}
              customColumns={customColumns}
              filtered={this.state.filtered}
              inputRefs={this.state.inputRefs}
              filterData={this.filterData}
              reRenderAfterClearFilter={this.reRenderAfterClearFilter}
              noFilters={noFilters}
              filterDataClickEvent={this.filterDataClickEvent}
              rowHeight={rowHeight}
              noBottomTotal={noBottomTotal}
              renderGraphBtn={renderGraphBtn}
            />
            {!noBottomTotal && (
              <div style={{ position: 'relative' }}>
                <Typography variant="subheading" style={{ marginTop: -17 }}>
                  Total: {dataToRender.length}
                </Typography>
              </div>
            )}
          </div>
        ) : (
          <div>Erro </div>
        )}
      </Paper>
    )
  }
}

export default RelatorioIndex

RelatorioIndex.propTypes = {
  customColumns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  noFilters: PropTypes.bool.isRequired,
  rowHeight: PropTypes.number.isRequired,
  noBottomTotal: PropTypes.bool.isRequired,
  renderGraphBtn: PropTypes.bool.isRequired,
  tableHeight: PropTypes.number.isRequired,
}
