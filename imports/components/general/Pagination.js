import React, { Component, Fragment } from 'react'
import { Pagination as SemanticPagination, Select } from 'semantic-ui-react'
import _ from 'lodash'
import styled from 'styled-components'

export default class Pagination extends Component {

  /*
    required props:
      - page: Number
      - total_pages: Number

    facultative props:
      - onPageClick: Function
      - increment: Boolean
  */

  state = {
      forced_page: this.props.increment ? this.props.page + 1 : this.props.page
  }

  change_page = (e, {activePage}) => {
    e.preventDefault()
    this.props.onPageClick(this.props.increment ? activePage - 1 : activePage)
  }

  change_page_forced = (e) => {
    e.preventDefault()
    const { increment } = this.props
    const { forced_page } = this.state
    this.props.onPageClick(increment ? forced_page - 1 : forced_page)
  }

  componentWillReceiveProps(new_props) {
    let { increment, page } = new_props
    page = _.toNumber(page)
    this.setState({ forced_page: increment ? page + 1 : page })
  }

  handlePageSelect = (event, data) => {
    this.change_page(event, {activePage: data.value})
  }

  render() {
    const { increment } = this.props
    let { page, total_pages } = this.props
    let { forced_page } = this.state
    total_pages = _.toNumber(total_pages)
    page = _.toNumber(page)
    forced_page = _.toNumber(forced_page)
    if (increment) {
      page = page + 1
    }

    if (page < 1) {
      page = 1
    }
    if (page > total_pages) {
      page = total_pages
    }

    const pages_options = []
    for(var i = 1; i <= _.toNumber(total_pages) ; i++){
      pages_options.push({key: i, value: i, text: i})
    }
    
    return(
      <Fragment>
        {total_pages > 1 &&
          <Fragment>
            <CustomSelect options={pages_options} onChange={this.handlePageSelect} value={page}/>
            <CustomPagination activePage={page} totalPages={total_pages} onPageChange={this.change_page}/>
          </Fragment>
        }
      </Fragment>
    )


  }
}

const CustomPagination = styled(SemanticPagination)`

  @media screen and (max-width: 769px) {
    display: none !important;
  }
`

const CustomSelect = styled(Select)`

  @media screen and (min-width: 769px) {
    display: none !important;
  }
`