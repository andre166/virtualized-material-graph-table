import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  CellMeasurer,
  CellMeasurerCache,
  AutoSizer,
  Grid,
  ScrollSync,
} from 'react-virtualized'
import { withStyles } from '@material-ui/core/styles'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import FilterListIcon from '@material-ui/icons/FilterList'
import { Button, Typography } from '@material-ui/core'
import CleanIcon from '../utils/CleanIcon'
import Graph from '../graph'
import DatePickerCustom from '../DatePickerCustom'
import SelectInput from '../SelectInput'

const styles = theme => ({
  table: {
    fontFamily: theme.typography.fontFamily,
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    textAlign: 'center',
    justifyContent: 'center',
  },
  tableCell: {
    textAlign: 'center',
    flex: 1,
    wordBreak: 'break-all',
    borderBottom: '1px solid red',
  },
  noClick: {
    cursor: 'initial',
  },
  tableHeaderCell: {
    fontSize: '14pt',
    flex: 1,
  },
  iconButons: {
    color: 'rgba(0, 0, 0, 0.54)',
    cursor: 'pointer',
    borderRadius: '50%',
    '&:hover': {
      background: '#eee',
    },
    padding: 5,
  },
  margin: {
    marginTop: 5,
  },
  textFieldRoot: {
    padding: '0px 4px',
    margin: '0px !important',
    '& input': {
      padding: '10px 0px',
      fontSize: 14,
    },
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    fontSize: 11,
  },
})

class Relatorio extends Component {
  cache = new CellMeasurerCache({
    minHeight: this.props.rowHeight || 60,
    defaultHeight: 180,
    fixedWidth: true,
    keyMapper: () => 1,
  })

  constructor(props) {
    super(props)
    this.state = {
      labelOrders: [],
    }
  }

  componentDidMount() {
    this.setState({
      labelOrders: this.generateLabelOrders(),
    })
  }

  generateLabelOrders = () => {
    const { customColumns } = this.props

    let orders = []
    customColumns.map(e => {
      orders.push({ key: e.dataKey, order: null })
    })
    return orders
  }

  orderBy = ({ sortKey }) => {
    const { data, setSortedData } = this.props

    let lista = JSON.parse(JSON.stringify(data))

    let labelState = ''
    this.state.labelOrders.map(label => {
      if (label.key !== sortKey) {
        label.order = null
      } else {
        labelState = label
      }
    })

    if (!labelState.order) {
      labelState.order = 'asc'
    } else {
      labelState.order = labelState.order == 'asc' ? 'desc' : 'asc'
    }

    if (labelState.order == 'asc') {
      lista.sort(function (a, b) {
        return a[sortKey] > b[sortKey] ? 1 : b[sortKey] > a[sortKey] ? -1 : 0
      })
    } else if (labelState.order == 'desc') {
      lista.sort(function (a, b) {
        return a[sortKey] < b[sortKey] ? 1 : b[sortKey] < a[sortKey] ? -1 : 0
      })
    }

    setSortedData(lista)
  }

  renderFilter = ({ columnIndex, KEY, columnType, label }) => {
    const { inputRefs, classes, filterData, customColumns } = this.props

    let { inputFilterSelect } = customColumns[columnIndex]

    if (columnType == 'date' || columnType == 'datetime') {
      return (
        <DatePickerCustom
          label={label}
          filterData={filterData}
          value={
            this.props.inputRefs[columnIndex] &&
            inputRefs[columnIndex].el.props.value
          }
          KEY={KEY}
          inputRefs={inputRefs}
          columnIndex={columnIndex}
          columnType={columnType}
        />
      )
    }

    if (inputFilterSelect) {
      return (
        <SelectInput
          filterData={filterData}
          inputFilterSelect={inputFilterSelect}
          label={label}
          inputRefs={inputRefs}
          columnIndex={columnIndex}
          KEY={KEY}
          customColumns={customColumns}
          columnType={columnType}
        />
      )
    }

    return (
      <TextField
        margin="dense"
        className={classes.margin}
        defaultValue={
          this.props.inputRefs[columnIndex] && inputRefs[columnIndex].el.value
        }
        inputRef={el =>
          el && (inputRefs[columnIndex] = { name: KEY, el, label, columnType })
        }
        onChange={e =>
          this.props.filterData({ isFilterInput: true, columnType })
        }
        variant="outlined"
        InputProps={{
          startAdornment: columnType !== 'date' && columnType !== 'datetime' && (
            <InputAdornment position="start">
              <FilterListIcon />
            </InputAdornment>
          ),
          className: classes.textFieldRoot,
        }}
      />
    )
  }

  _cellRenderer = ({ columnIndex, key, parent, rowIndex, style }) => {
    const { customColumns, data, colunasArray, classes } = this.props

    let KEY = colunasArray[columnIndex]
    let { label } = customColumns[columnIndex]
    let labelStateOrder = this.state.labelOrders[columnIndex].order
    let noRenderFilter = customColumns[columnIndex].noFilter
    let isCustomRender = customColumns[columnIndex].render

    return (
      <CellMeasurer
        cache={this.cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div
          style={{ ...style, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
        >
          {isCustomRender ? (
            <div className={classes.cell}>
              {isCustomRender({
                column: customColumns[columnIndex],
                row: data[rowIndex],
                KEY,
              })}
            </div>
          ) : (
            <div className={classes.cell}>{data[rowIndex][KEY]}</div>
          )}
        </div>
      </CellMeasurer>
    )
  }

  getColumnWidth = ({ index }) => {
    const { customColumns, data } = this.props

    return customColumns[index].width || 200
  }

  clearInputs = () => {
    const { reRenderAfterClearFilter, inputRefs } = this.props

    inputRefs.map(e => {
      if (e.columnType == 'date' || e.columnType == 'datetime') {
        e.value = ''
        e.el.handleClear()
      } else if (e.el.props) {
        e.el.props.clearInput()
      } else {
        e.el.value = ''
      }
    })

    reRenderAfterClearFilter()
  }

  _cellHeaderRenderer = ({ columnIndex, key, style }) => {
    const { customColumns, colunasArray, noFilters } = this.props

    let KEY = colunasArray[columnIndex]
    let { label } = customColumns[columnIndex]
    let labelStateOrder = this.state.labelOrders[columnIndex].order
    let isNoFilter = customColumns[columnIndex].noFilter
    let columnType = customColumns[columnIndex].type

    return (
      <div key={key} style={style}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            fontSize: 14,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TableSortLabel
              active={
                labelStateOrder == 'asc' || labelStateOrder == 'desc'
                  ? true
                  : false
              }
              direction={labelStateOrder || 'asc'}
              onClick={() =>
                this.orderBy({ sortKey: KEY, orderDirection: 'desc' })
              }
            >
              {label}
            </TableSortLabel>
          </div>

          {noFilters || isNoFilter
            ? null
            : this.renderFilter({ columnIndex, KEY, columnType, label })}
        </div>
      </div>
    )
  }

  noDataRenderer = () => {
    return (
      <div style={{ textAlign: 'center', background: '#eee', padding: 10 }}>
        Nenhum registro
      </div>
    )
  }

  render() {
    const {
      customColumns,
      data,
      renderGraphBtn,
      filterData,
      inputRefs,
      filterDataClickEvent,
      noBottomTotal,
    } = this.props

    return (
      <div style={{ height: '100%', position: 'relative' }}>
        <ScrollSync>
          {({ onScroll, scrollLeft }) => (
            <AutoSizer>
              {({ width, height }) => (
                <>
                  <div
                    style={{
                      width,
                      display: 'flex',
                      boxSizing: 'border-box',
                      marginBottom: 10,
                    }}
                  >
                    {renderGraphBtn == false || renderGraphBtn == 'false' ? (
                      <></>
                    ) : (
                      <Graph
                        filterDataClickEvent={filterDataClickEvent}
                        filterData={filterData}
                        inputRefs={inputRefs}
                        data={data}
                        customColumns={customColumns}
                      />
                    )}

                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={this.clearInputs}
                    >
                      <CleanIcon />
                      Limpar filtro
                    </Button>
                  </div>

                  <Grid
                    style={{
                      overflow: 'hidden',
                      outline: 'none',
                      borderBottom: '1px solid #eee',
                      marginBottom: 10,
                    }}
                    data={customColumns}
                    cellRenderer={this._cellHeaderRenderer}
                    columnWidth={this.getColumnWidth}
                    columnCount={customColumns.length}
                    fixedRowCount={1}
                    height={75}
                    rowHeight={75}
                    rowCount={1}
                    width={width}
                    scrollLeft={scrollLeft}
                    overscanColumnCount={customColumns.length}
                  />

                  <Grid
                    style={{ outline: 'none' }}
                    data={data}
                    cellRenderer={
                      data.length > 0 ? this._cellRenderer : this.noDataRenderer
                    }
                    columnWidth={data.length > 0 ? this.getColumnWidth : width}
                    columnCount={data.length > 0 ? customColumns.length : 1}
                    deferredMeasurementCache={this.cache}
                    height={height - 160}
                    rowHeight={this.cache.rowHeight}
                    rowCount={data.length > 0 ? data.length : 1}
                    width={width}
                    onScroll={onScroll}
                  />
                </>
              )}
            </AutoSizer>
          )}
        </ScrollSync>
      </div>
    )
  }
}

export default withStyles(styles)(Relatorio)

Relatorio.propTypes = {
  customColumns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  renderGraphBtn: PropTypes.bool.isRequired,
  filterData: PropTypes.func.isRequired,
  inputRefs: PropTypes.array.isRequired,
  filterDataClickEvent: PropTypes.func.isRequired,
  colunasArray: PropTypes.array.isRequired,
  rowHeight: PropTypes.number.isRequired,
  noFilters: PropTypes.bool.isRequired,
  noBottomTotal: PropTypes.bool.isRequired,
}
