/* eslint-disable */

import React from 'react'
import { hot } from 'react-hot-loader'
import { array } from 'prop-types'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      unique: [],
      columns: [
        { headerName: 'State', field: 'state' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Covid-19 Deaths', field: 'deaths' }
      ],
      rows: [],
      value: ''
    }
  }

  componentDidMount() {
    fetch('https://data.cdc.gov/resource/9mfq-cb36.json')
      .then(res => res.json())
      .then(rows => this.setState({ rows }))

      .catch(err => console.log(err))
  }

  handleChange(event) {
    console.log(event.target.value)
    this.setState({ value: event.target.value })
  }

  render() {
    const filteredArray = array => {
      let hash = Object.create(null),
        unique = this.state.rows.reduce(function(r, o) {
          if (!(o.state in hash)) {
            hash[o.state] = r.push(o) - 1
            return r
          }
          if (o.submission_date > r[hash[o.state]].submission_date) {
            r[hash[o.state]] = o
          }
          return r
        }, [])
      unique.forEach(
        obj => (obj['percentDeaths'] = this.state.unique.tot_death / 342581)
      )
      console.log(unique)
      this.setState({ unique: unique })
    }

    return (
      <div className="myGrid">
        <h1 className="header">Covid-19 Deaths by the state</h1>
        <button onClick={() => filteredArray()}>Click to show data</button>
        <input
          type="text"
          placeholder="search by state"
          value={this.state.value}
          onChange={this.handleChange}
        />

        <TableHead>
          <TableRow>
            <TableCell>State</TableCell>

            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Covid-19 Deaths</TableCell>
            <TableCell align="right">% of US Covid-19 Deaths</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.unique.map(rows => (
            <TableRow key={rows.state}>
              <TableCell component="th" scope="row">
                {rows.state}
              </TableCell>
              <TableCell align="right">{rows.submission_date}</TableCell>
              <TableCell align="right">{rows.tot_death}</TableCell>
              <TableCell align="right">
                {parseFloat(rows.tot_death / 342581).toFixed(2) + '%'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </div>
    )
  }
}

export default hot(module)(App)
