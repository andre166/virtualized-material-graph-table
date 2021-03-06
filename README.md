# virtualized-material-graph-table
A simple Grid for React based [react-virtualized](https://bvaughn.github.io/react-virtualized/#/components/Grid) and  [Material-UI](https://material-ui.com/getting-started/installation/).

## Features

- Sort asc/desc per column.
- Filter per column.
- Select input for filter.
- Date picker for date column filter.
- Piegraph per column.
- Custom rendering.


## Demo
[functional table demo](https://andre166.github.io/virtualized-material-graph-table/)


### Props

| Props         | Required      | Default value  | type        | Note     |
| ------------- |:-------------:| :-------------:|:-----------:|:--------:|
| customColumns | yes           | none           | Array       | Array de objetos.
| data          | yes           | none           | Array       | Array de objetos.
| noFilters     | no            | false          | boolean     | render/no render filter row.
| renderGraphBtn| no            | true           | boolean     | render/no render graph and graph button.
| rowHeight     | no            | 60             | number      | height of grid rows ( only numbers, not dynamic).
| tableHeight   | no            | 400            | number or string | height of Table Container rows.
| noBottomTotal | no            | false          | boolean     | render/no render total in bottom of the table.

#### Exemplos
```js
customColumns: [
  {
    dataKey: 'nome_cli',
    label: 'Nome do Cliente',
    type: 'string'
  }
]

data: [
  {
    nome_cli: 'clodoaldo alves'
    idade: 20,
    data_nasc: '2020-06-04'
    ...
  }
]

<ShowRelatorio customColumns={customColumns} data={data} rowHeight={50}/>
```
### customColumns Props

| Props   | Required | Default value  | type        | Note        |
| --------|:---------| :-------------:|:-----------:|:-----------:|
| dataKey | yes      | none           | object      | object key.                                       |
| label   | yes      | none           | object      | Column label.                                     |
| type    | no       | string         | enum        | object type: string, bool, number, date...        |
| dateType| no       | none           | enum        | 'dd/mm/yyyy', 'yyyy-mm-dd', 'iso'. (to prevent date format erros), all dates are formated in momen(date).format(date or date time + dateType). |
| inputFilterSelect | no       | none            | array      | render a select input over a text input. value, label pair for render data.                                         |
| render     | no       | none           | func        | func for custom rendering, receive {row, KEY}.                                           |
| renderGraph| no       | true           | boolean     | render/no render graph for the column.
| noFilter   | no       | false          | boolean     | render/no render filter input for the column.
| width      | no       | 200            | number      | column width.

#### Exemplos
```js
customColumns: [
  {
    dataKey: 'hora_ligacao',
    label: 'Hora da liga????o',
    type: 'datetime',
    dateType: 'iso',
    renderGraph: false,
    width: 220,
  },
  {
    dataKey: 'gender',
    label: 'G??nero',
    width: 150,
    //render exemple
    render: ({ row, KEY }) => <div>
      {row[KEY] == 'm' ? 'Male' : 'Female'}
    </div>
  },
  {
    dataKey: 'periodo',
    label: 'Per??odo',
    //inputFilterSelect example
    inputFilterSelect: [
      { value: 'Tarde', label: 'Tarde label' },
      { value: 'Manh??', label: 'Manh?? label' },
    ],
    renderGraph: true,
    width: 180,
  },
  {
    ...
  }
]
```

# Get Started

#### 1.Install package

npm install virtualized-material-graph-table --save
npm i @material-ui/icons

## Usage

Here is a basic example of using material-table within a react application.

```jsx
import React, { Component } from "react";
import ReactDOM from "react-dom";
import VirtualizedMaterialTable from "virtualized-material-graph-table";
import WbSunnyIcon from '@material-ui/icons/WbSunny'
import Brightness2Icon from '@material-ui/icons/Brightness2'

class GraphTable extends Component {
  render() {
    return (
      <div style={{ height: 800 }}>
        <VirtualizedMaterialTable
          customColumns={[
             {
              dataKey: 'nome_cli',
              label: 'Client Name',
              type: 'string',
              width: 200,
            },
            {
              dataKey: 'data_nasc',
              label: 'Birtdhay',
              type: 'date',
              width: 200,
            },
            {
              dataKey: 'data_chegada',
              label: 'Arrival date',
              type: 'datetime',
              dateType: 'dd/mm/yyyy',
              width: 200,
            },
            {
              label: 'Gender',
              dataKey: 'gender',
              width: 180,
              renderGraph: true,
              inputFilterSelect: [
                { value: 'F', label: 'Female' },
                { value: 'M', label: 'Male' },
              ],
            },
            {
              label: 'Cycle',
              dataKey: 'periodo',
              width: 200,
              render: ({ row, KEY }) => {
                return (
                  <div>
                    {row[KEY] == 'Manh??' ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundImage: 'linear-gradient(red, yellow)',
                          padding: 5,
                          borderRadius: 4,
                          color: '#fff',
                        }}
                      >
                        <WbSunnyIcon />
                        {row[KEY]}
                      </div>
                    ) : (
                      <>
                        {row[KEY] == 'Noite' && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundImage: 'linear-gradient(blue, black)',
                              color: '#fff',
                              padding: 5,
                              borderRadius: 4,
                            }}
                          >
                            <Brightness2Icon />
                            {row[KEY]}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              },
            },


          ]}
          data={[
            {
              nome_cli: 'Andr?? mesquita',
              data_nasc: '2021-06-04',
              data_chegada: '05/04/2021 15:42:21',
              periodo: 'Noite',
              gender: 'M'
            },
            {
              nome_cli: 'Jo??o das Couves',
              data_nasc: '1989-09-17',
              data_chegada: '05/04/2021 07:13:12',
              periodo: 'Manh??',
              gender: 'F'
            },

          ]}
        />
      </div>
    );
  }
}
```
