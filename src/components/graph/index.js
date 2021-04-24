import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import PieChartIcon from '@material-ui/icons/PieChart'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import FilterListIcon from '@material-ui/icons/FilterList'
import IconButton from '@material-ui/core/IconButton'
import ClearIcon from '@material-ui/icons/Clear'
import PieChart from './PieChart'
import CleanIcon from '../utils/CleanIcon'
import isNumeric from '../utils/isNumeric'

const CCOLUMN_WIDTH = 220

const styles = theme => ({
  gridContainer: {
    display: 'grid',
    'grid-template-columns': `${CCOLUMN_WIDTH}px auto ${CCOLUMN_WIDTH}px`,
    boxSizing: 'border-box',
  },
  leftColumn: {
    position: 'relative',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    maxWidth: CCOLUMN_WIDTH,
  },
  rigthColumn: {
    position: 'relative',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    maxWidth: CCOLUMN_WIDTH,
  },
  mainContent: {},
  clearIconButton: {
    width: 10,
    height: 10,
  },
})

class Graph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reRender: false,
      open: false,
      selectedColumn: {},
      firstSelectedColumnCache: {},
      filteredGraphTotal: null,
      pieGraphOptions: {
        credits: {
          enabled: false,
        },
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
        },
        title: {
          text: 'Browser market shares in January, 2018',
        },
        tooltip: {
          pointFormat: 'Total: {point.percentage:.1f}%',
        },
        accessibility: {
          point: {
            valueSuffix: '%',
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '{point.name}: {point.y}',
            },
          },
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: (e, a) =>
                  this.props.filterDataClickEvent({
                    pieGraphEvent: e,
                    selectedColumn: this.state.selectedColumn,
                    reRenderPieGraph: this.reRenderPieGraph,
                  }),
              },
            },
          },
        },
        series: [
          {
            turboThreshold: 10000,
            colorByPoint: true,
            data: [],
          },
        ],
      },
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.reRender !== this.state.reRender) {
      let { selectedColumn } = this.state

      let response = this.filterGraphData(selectedColumn)

      this.setState({
        filteredGraphTotal: response.Total,
        pieGraphOptions: {
          ...this.state.pieGraphOptions,
          series: [
            {
              colorByPoint: true,
              data: [...response.filteredArray],
            },
          ],
        },
      })
    }
  }

  reRenderPieGraph = () => {
    this.setState({
      reRender: !this.state.reRender,
    })
  }

  handleClickOpen = () => {
    const { customColumns, data, classes } = this.props

    let firstColumnToRender = customColumns.find(
      coluna => coluna.renderGraph !== false
    )

    let response = this.filterGraphData(firstColumnToRender)

    this.setState({
      open: true,
      selectedColumn: firstColumnToRender,
      filteredGraphTotal: response.Total,
      firstSelectedColumnCache: firstColumnToRender,
      pieGraphOptions: {
        ...this.state.pieGraphOptions,
        title: {
          text: firstColumnToRender.label,
        },
        series: [
          {
            colorByPoint: true,
            data: response.filteredArray,
          },
        ],
      },
    })
  }

  handleClose = () => {
    this.setState({
      open: false,
      selectedColumn: this.state.firstSelectedColumnCache,
    })
  }

  handleSelectedColumn = coluna => {
    let response = this.filterGraphData(coluna)

    this.setState({
      selectedColumn: coluna,
      filteredGraphTotal: response.Total,
      pieGraphOptions: {
        ...this.state.pieGraphOptions,
        title: {
          text: coluna.label,
        },
        series: [
          {
            colorByPoint: true,
            data: response.filteredArray,
          },
        ],
      },
    })
  }

  filterGraphData = column => {
    const { data } = this.props

    let KEY = column.dataKey
    let COLUMN_TYPE = column.type;

    let filteredArray = []

    data.map(obj => {
      if (obj[KEY] == '' || obj[KEY] == undefined || obj[KEY] == null) {
        obj[KEY] = 'Indefinido'
      }

      let hasInFilteredArray = null;

      if( COLUMN_TYPE === 'numeric'){
        hasInFilteredArray = filteredArray.find(e =>
          e.name.toString().includes(obj[KEY])
        )
      }else{
        hasInFilteredArray = filteredArray.find(e =>
          e.name.trim().toLowerCase().includes(obj[KEY].toLowerCase().trim())
        )
      }

      if (hasInFilteredArray) {
        hasInFilteredArray.y++
      } else {
        filteredArray.push({ name: obj[KEY], y: 1 })
      }
    })

    let Total = 0

    filteredArray.map(e => (Total += e.y))

    return { filteredArray, Total }
  }

  clearSelectedFilter = e => {
    const { filterData } = this.props

    if (e.columnType == 'date' || e.columnType == 'datetime') {
      e.value = ''
      console.log('e', e.el)
      e.el.handleClear()
    } else if (e.el.props) {
      e.el.props.clearInput()
    } else {
      e.el.value = ''
    }

    this.reRenderPieGraph()
    filterData({ isClearFilter: true })
  }

  clearAllFilters = () => {
    const { filterData, inputRefs } = this.props

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

    this.reRenderPieGraph()

    filterData({ isClearFilter: true })
  }

  renderFilterColumnList = () => {
    const { customColumns, data, classes, inputRefs } = this.props

    let inputsWhithValue = inputRefs.filter(input => {
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

    console.log('inputsWhithValue', inputsWhithValue)

    if (inputsWhithValue.length === 0) {
      return (
        <div style={{ textAlign: 'center', marginTop: 15 }}>Nenhum filtro</div>
      )
    }

    return (
      <List component="nav" dense style={{ overflow: 'auto', maxHeight: 450 }}>
        {inputsWhithValue.map(input => (
          <ListItem
            key={`RightColumn${input.name}`}
            style={{
              border: '1px solid #eee',
              borderRadius: 4,
              marginTop: 7,
              boxShadow: '1px 1px 2px #bbb',
              width: '98%',
            }}
          >
            <ListItemText
              primary={input.label}
              secondary={input.value || input.el.value}
            />
            <IconButton
              onClick={() => this.clearSelectedFilter(input)}
              classes={{
                root: classes.clearIconButton,
              }}
              size="small"
            >
              <ClearIcon style={{ fontSize: 20 }} />
            </IconButton>
          </ListItem>
        ))}
      </List>
    )
  }

  render() {
    const { customColumns, data, classes, inputRefs } = this.props
    const {
      selectedColumn,
      pieGraphOptions,
      filteredGraphTotal,
      open,
    } = this.state

    return (
      <div style={{ position: 'relative' }}>
        <Button
          style={{ marginRight: 8 }}
          disabled={data.length === 0}
          variant="contained"
          color="primary"
          size="small"
          onClick={() => this.handleClickOpen()}
        >
          <PieChartIcon style={{ marginRight: 4 }} />
          gráfico
        </Button>

        {open && (
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            fullWidth
            maxWidth="lg"
          >
            <DialogContent>
              <div className={classes.gridContainer}>
                <div className={classes.leftColumn}>
                  <List
                    component="nav"
                    dense
                    style={{ overflow: 'auto', maxHeight: 450 }}
                  >
                    {customColumns.map(coluna => {
                      if (coluna.renderGraph === false) {
                        return
                      }

                      return (
                        <ListItem
                          key={`leftColumn${coluna.dataKey}`}
                          selected={coluna.dataKey == selectedColumn.dataKey}
                          button
                          onClick={() => this.handleSelectedColumn(coluna)}
                        >
                          <ListItemText primary={coluna.label} />
                        </ListItem>
                      )
                    })}
                  </List>
                </div>
                <div className={classes.mainContent}>
                  <PieChart options={pieGraphOptions} />
                </div>
                <div className={classes.rigthColumn}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: '#eee',
                      padding: 10,
                      borderRadius: 4,
                    }}
                  >
                    <FilterListIcon style={{ marginRight: 5 }} /> Filtros
                  </div>
                  {inputRefs.length > 0 && this.renderFilterColumnList()}
                </div>
              </div>
            </DialogContent>

            <div
              style={{
                padding: '0px 24px 8px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>Total: {filteredGraphTotal}</div>
              <div>
                <Button
                  onClick={this.clearAllFilters}
                  color="primary"
                  autoFocus
                >
                  <CleanIcon />
                  Limpar filtro
                </Button>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(Graph)

Graph.propTypes = {
  customColumns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  classes: PropTypes.array.isRequired,
  inputRefs: PropTypes.array.isRequired,
}
