import React, { Component } from 'react'
import faker from 'faker'
import Relatorio from './components'
import { columns } from './components/devData/columns'
import { data } from './components/devData/data'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    let list = new Array(30).fill(true).map(() => ({
      first_name: faker.name.findName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      future: faker.date.future(),
      gender: faker.name.gender(),
      number: faker.datatype.number(),
    }))
    console.log('list', list)
    this.setState({
      data: list,
    })
  }

  render() {
    return (
      <div>
        {this.state.data.length > 0 ? (
          <Relatorio
            customColumns={columns}
            data={this.state.data}
            rowHeight={50}
            tableHeight="90vh"
          />
        ) : (
          <div>Gerando data...</div>
        )}
      </div>
    )
  }
}

export default App
