import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import {Grid, Header, Loader, Table} from 'semantic-ui-react'
import AdminUserRow from '/imports/components/admin/AdminUserRow'
import {Territories} from '/imports/api/territories/territories'

export class AdminUsersTable extends TrackerReact(Component){

  /*
    required props:
      - page: Number
    facultative props:
      - nb_results: Number
      - filter_text: String

  */

  state = {
    
  }

  render(){
    const {users, territories, loading} = this.props

    if(!loading){
      return(
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Nom d'utilisateur</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Créé le</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {users.map(function(user, index){
              return(
                <AdminUserRow user={user} key={index} territories={territories}/>
              )
            })}
          </Table.Body>
        </Table>
      )
    }else{
      return <Loader className="inline-block">Chargement des utilisateurs</Loader>
    }
  }
}

export default AdminUsersTableContainer = createContainer(({ page, filter_text, nb_results }) => {
  const usersPublication = Meteor.subscribe('users.search', {page, filter_text, nb_results})
  const territoriesPublication = Meteor.subscribe('territories.authorized_for_me')
  const loading = !usersPublication.ready() && !territoriesPublication.ready()
  const users = Meteor.users.find({_id: {$ne: Meteor.userId()}}).fetch()
  const territories = Territories.find({}).fetch()
  return {
    loading,
    users,
    territories
  }
}, AdminUsersTable)
