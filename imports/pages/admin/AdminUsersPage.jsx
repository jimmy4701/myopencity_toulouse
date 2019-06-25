import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {Grid, Header, Container, Form, Input, Button, Pagination} from 'semantic-ui-react'
import AdminUsersTable from '/imports/components/admin/AdminUsersTable'
import _ from 'lodash'

export default class AdminUsersPage extends TrackerReact(Component){

  /*
    required props:
      - none
  */

  constructor(props){
    super(props);
    this.state = {
      page: 0,
      users_count: 0,
      filter_text: "",
      results_per_page: 20
    }
  }

  componentWillMount(){
    Meteor.call('users.count',(error, result) => {
      if(error){
        console.log(error)
        Bert.alert({
          title: "Une erreur est survenue lors du comptage des utilisateurs",
          message: error.reason,
          type: 'danger',
          style: 'growl-bottom-left',
        })
      }else{
        this.setState({users_count: result})
      }
    })
  }

  handleChange(attr, e){
    let state = this.state
    state[attr] = e.target.value
    this.setState(state)
  }

  changePage(page){
    this.setState({page})
  }

  render(){
    const {results_per_page, users_count, page, filter_text} = this.state
    const nb_pages = _.floor(users_count / results_per_page)

    return(
      <Grid stackable>
        <Grid.Column width={16}>
          <Container>
            <Header as="h3">Gestion des utilisateurs ({users_count})</Header>
            <Form>
              <Form.Field>
                <label>Filtrer les utilisateurs</label>
                <Input value={filter_text} type="text" onChange={(e) => {this.handleChange('filter_text', e)}} />
              </Form.Field>
            </Form>
            {nb_pages > 1 ?
              <Grid stackable>
                <Grid.Column width={16} className="center-align">
                  <Pagination
                    activePage={page + 1}
                    onPageChange={(e, {activePage}) => this.changePage(activePage - 1, e)}
                    totalPages={nb_pages +1}
                  />
                </Grid.Column>
              </Grid>
            : ''}
            <AdminUsersTable page={page} filter_text={filter_text} nb_results={results_per_page} />
          </Container>
        </Grid.Column>
      </Grid>
    )
  }
}
